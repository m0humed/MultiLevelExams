-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ENUM types
CREATE TYPE student_status AS ENUM ('active', 'inactive');
CREATE TYPE question_type AS ENUM ('multiple-choice', 'true-false', 'short-answer');
CREATE TYPE difficulty_level AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE session_status AS ENUM ('in_progress', 'completed', 'abandoned');

-- Trigger function to auto-update "updated_at"
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Students table
CREATE TABLE students (
    student_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    status student_status DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_students_updated_at
BEFORE UPDATE ON students
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Instructors table
CREATE TABLE instructors (
    instructor_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_instructors_updated_at
BEFORE UPDATE ON instructors
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Exams table
CREATE TABLE exams (
    exam_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_by UUID NOT NULL REFERENCES instructors(instructor_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    passing_score DECIMAL(5,2) NOT NULL,
    time_limit INT NOT NULL, -- in minutes
    is_published BOOLEAN DEFAULT FALSE
);

CREATE TRIGGER trg_exams_updated_at
BEFORE UPDATE ON exams
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Stages table (for multi-stage exams)
CREATE TABLE stages (
    stage_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID NOT NULL REFERENCES exams(exam_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    stage_order INT NOT NULL,
    passing_score DECIMAL(5,2) NOT NULL,
    time_limit INT NOT NULL, -- in minutes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Questions table
CREATE TABLE questions (
    question_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stage_id UUID NOT NULL REFERENCES stages(stage_id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type question_type NOT NULL,
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    points INT NOT NULL DEFAULT 1,
    difficulty difficulty_level DEFAULT 'medium',
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Question options table
CREATE TABLE question_options (
    option_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES questions(question_id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    option_letter CHAR(1) NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE
);

-- Exam sessions table
CREATE TABLE exam_sessions (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(student_id),
    exam_id UUID NOT NULL REFERENCES exams(exam_id),
    current_stage INT DEFAULT 1,
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP NULL,
    status session_status DEFAULT 'in_progress'
);

-- Student answers table
CREATE TABLE student_answers (
    answer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES exam_sessions(session_id),
    question_id UUID NOT NULL REFERENCES questions(question_id),
    selected_answer TEXT,
    is_correct BOOLEAN DEFAULT FALSE,
    answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Performance metrics table (optional, for analytics)
CREATE TABLE performance_metrics (
    metric_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES exam_sessions(session_id),
    total_score DECIMAL(5,2) NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    total_time_spent INT NOT NULL,
    questions_correct INT NOT NULL,
    total_questions INT NOT NULL,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_student_answers_session ON student_answers(session_id);
CREATE INDEX idx_exam_sessions_student ON exam_sessions(student_id);
CREATE INDEX idx_questions_stage ON questions(stage_id);

-- Views (optional)
CREATE VIEW student_exam_summary AS
SELECT 
    s.student_id,
    s.name AS student_name,
    e.exam_id,
    e.name AS exam_name,
    es.session_id,
    es.start_time,
    es.end_time,
    es.status,
    pm.percentage,
    pm.questions_correct,
    pm.total_questions
FROM students s
JOIN exam_sessions es ON s.student_id = es.student_id
JOIN exams e ON es.exam_id = e.exam_id
LEFT JOIN performance_metrics pm ON es.session_id = pm.session_id;

CREATE VIEW question_analytics AS
SELECT 
    q.question_id,
    q.question_text,
    q.category,
    q.difficulty,
    COUNT(sa.answer_id) AS total_attempts,
    SUM(CASE WHEN sa.is_correct = TRUE THEN 1 ELSE 0 END) AS correct_answers,
    AVG(EXTRACT(EPOCH FROM (sa.answered_at - es.start_time))) AS avg_time_spent,
    (SUM(CASE WHEN sa.is_correct = TRUE THEN 1 ELSE 0 END)::DECIMAL / NULLIF(COUNT(sa.answer_id), 0)) * 100 AS success_rate
FROM questions q
LEFT JOIN student_answers sa ON q.question_id = sa.question_id
LEFT JOIN exam_sessions es ON sa.session_id = es.session_id
GROUP BY q.question_id, q.question_text, q.category, q.difficulty;
