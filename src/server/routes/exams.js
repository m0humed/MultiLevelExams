import express from 'express';
import { Pool } from 'pg';

import dotenv from 'dotenv';
dotenv.config();



const router = express.Router();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/exams?studentId=...
router.get('/exams', async (req, res) => {
  //console.log('Received request for exams');
  const { studentId } = req.params;
  try {
    // Return published exams with instructor name, number of stages, and total exam time
    const exams = await pool.query(
      `SELECT e.*, 
              i.name as instructor_name,
              (SELECT COUNT(*) FROM stages s WHERE s.exam_id = e.exam_id) AS stage_count,
              (SELECT COALESCE(SUM(s.time_limit), 0) FROM stages s WHERE s.exam_id = e.exam_id) AS total_time_minutes
       FROM exams e
       JOIN instructors i ON e.created_by = i.instructor_id
       WHERE e.is_published = TRUE`
    );
    //console.log(exams);
    res.json(exams.rows);
  } catch (err) {

    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/exams/:examId
router.get('/details/:examId', async (req, res) => {
  const { examId } = req.params;
  //console.log(`Fetching exam with ID ${examId}`);
  try {
    const exam = await pool.query('SELECT * FROM exams WHERE exam_id = $1', [examId]);
    if (exam.rowCount === 0) return res.status(404).json({ error: 'Not found' });

    const stages = await pool.query(
      'SELECT * FROM stages WHERE exam_id = $1 ORDER BY stage_order ASC',
      [examId]
    );
    //console.log(`Found ${stages.rowCount} stages for exam ${examId}`);
    res.json({ ...exam.rows[0], stages: stages.rows });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


// GET /api/stages/:stageId
router.get('/stages/:stageId', async (req, res) => {
  const { stageId } = req.params;
  try {
    const stage = await pool.query('SELECT * FROM stages WHERE stage_id = $1', [stageId]);
    if (stage.rowCount === 0) return res.status(404).json({ error: 'Not found' });
    
    const questions = await pool.query(
      'SELECT * FROM questions WHERE stage_id = $1 ORDER BY created_at ASC',
      [stageId]
    );
    // For each question, get options
    const questionIds = questions.rows.map(q => q.question_id);
    let options = [];
    if (questionIds.length) {
      const optRes = await pool.query(
        'SELECT * FROM question_options WHERE question_id = ANY($1::uuid[])',
        [questionIds]
      );
      options = optRes.rows;
    }
    // Attach options to questions
    const questionsWithOptions = questions.rows.map(q => ({
      ...q,
      options: options.filter(o => o.question_id === q.question_id)
    }));
    res.json({ ...stage.rows[0], questions: questionsWithOptions });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/progress?studentId=...&examId=...
router.get('/progress/:studentId', async (req, res) => {
  const { studentId } = req.params;
  //console.log(`Fetching progress for student ${studentId}`);
  try {
    // Get all exam sessions for the student, joined with exam info
    let sessions;
    try {
      sessions = await pool.query(
      `SELECT es.*, e.name AS exam_title, e.is_published
       FROM exam_sessions es
       JOIN exams e ON es.exam_id = e.exam_id
       WHERE es.student_id = $1
       ORDER BY es.start_time DESC`,
      [studentId]
      );
    } catch (err) {
      console.error('Error fetching sessions:', err);
      return res.status(500).json({ error: 'Database error fetching sessions' });
    }
    //console.log(`Found ${sessions.rowCount} sessions for student ${studentId}`);
    res.json(sessions.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error in progress fetching' });
  }
});



// POST /api/submit-stage
router.post('/submit-stage', async (req, res) => {
  const { studentId, examId, stageId, answers } = req.body;
  try {
    console.log(answers);
    // Find the stage order for this stage
    //console.log(`Submitting stage for student ${studentId}, exam ${examId}, stage ${stageId}`);
    const stageRes = await pool.query(
      `SELECT stage_order FROM stages WHERE stage_id = $1`,
      [stageId]
    );
    if (stageRes.rowCount === 0) return res.status(400).json({ error: 'Invalid stageId' });
    const stageOrder = stageRes.rows[0].stage_order;
    //console.log(`Stage order for stage ${stageId} is ${typeof(stageOrder)}`);

    // Create a new session or update existing (current_stage is INT in schema)
    
    let session = await pool.query(
      `SELECT * FROM exam_sessions WHERE student_id = $1 AND exam_id = $2 AND current_stage = $3 AND status = 'in_progress'`,
      [studentId, examId, stageOrder]
    );
    //console.log(`Found session: ${JSON.stringify(session)}`);
    let sessionId;
    //console.log(`Session row count: ${session.rowCount}`);
    if (session.rowCount === 0) {
      const newSession = await pool.query(
        `INSERT INTO exam_sessions (student_id, exam_id, current_stage, status) VALUES ($1, $2, $3, 'in_progress') RETURNING session_id`,
        [studentId, examId, stageOrder]
      );

      sessionId = newSession.rows[0].session_id;
    } else {
      sessionId = session.rows[0].session_id;
    }
    //console.log(`Session ID: ${sessionId}`);

    // Save answers (answer_id is auto-generated, session_id + question_id is unique for ON CONFLICT)
    for (const q of answers) {
      console.log(`Saving answer for question ${q.questionId}: ${q.selectedAnswer} (correct: ${q.isCorrect})`);
      await pool.query(
        `INSERT INTO student_answers (session_id, question_id, selected_answer, is_correct)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (session_id, question_id) DO UPDATE SET selected_answer = EXCLUDED.selected_answer, is_correct = EXCLUDED.is_correct, answered_at = CURRENT_TIMESTAMP`,
        [sessionId, q.questionId, q.selectedAnswer, q.isCorrect]
      );
    }

    // Mark session as completed
    await pool.query(
      `UPDATE exam_sessions SET status = 'completed', end_time = NOW() WHERE session_id = $1`,
      [sessionId]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/review?studentId=...&examId=...&stageId=...
router.get('/review', async (req, res) => {
  const { studentId, examId, stageId } = req.query;

  try {
    // Get the latest completed session for the student and exam
    const sessionResult = await pool.query(
      `SELECT * FROM exam_sessions 
       WHERE student_id = $1 AND exam_id = $2 AND status = 'completed' 
       ORDER BY end_time DESC LIMIT 1`,
      [studentId, examId]
    );

    if (sessionResult.rowCount === 0) {
      return res.status(404).json({ error: 'No completed session found' });
    }

    const session = sessionResult.rows[0];

    // Get answers only for the specified stage
    const answersResult = await pool.query(
      `SELECT sa.*, q.stage_id, q.question_text, q.correct_answer, q.explanation
       FROM student_answers sa
       JOIN questions q ON sa.question_id = q.question_id
       WHERE sa.session_id = $1 AND q.stage_id = $2`,
      [session.session_id, stageId]
    );

    res.json({ session, answers: answersResult.rows });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});
router.get('/reviewdetails', async (req, res) => {
  const { studentId, examId, stageId } = req.query;
  try {
    // Get the latest completed session for the student and exam
    const sessionResult = await pool.query(
      `SELECT * FROM exam_sessions 
       WHERE student_id = $1 AND exam_id = $2 AND status = 'completed' 
       ORDER BY end_time DESC LIMIT 1`,
      [studentId, examId]
    );
    if (sessionResult.rowCount === 0) {
      return res.status(404).json({ error: 'No completed session found' });
    }
    const session = sessionResult.rows[0];

    // Get answers for the specified stage, including options for each question
    const answersResult = await pool.query(
      `SELECT sa.*, q.stage_id, q.question_text, q.correct_answer, q.explanation, q.question_id
       FROM student_answers sa
       JOIN questions q ON sa.question_id = q.question_id
       WHERE sa.session_id = $1 AND q.stage_id = $2`,
      [session.session_id, stageId]
    );

    // Get all options for these questions
    const questionIds = answersResult.rows.map(a => a.question_id);
    let options = [];
    if (questionIds.length) {
      const optRes = await pool.query(
        'SELECT * FROM question_options WHERE question_id = ANY($1::uuid[])',
        [questionIds]
      );
      options = optRes.rows;
    }

    // Attach options to each answer/question
    const answersWithOptions = answersResult.rows.map(q => ({
      ...q,
      options: options.filter(o => o.question_id === q.question_id)
    }));

    res.json({ session, answers: answersWithOptions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


// GET /api/exams/:examId/progress/:studentId
router.get('/:examId/progress/:studentId', async (req, res) => {
  const { examId, studentId } = req.params;
  //console.log(`Fetching progress for exam ${examId} and student ${studentId}`);
  try {
    const sessions = await pool.query(
      `SELECT * FROM exam_sessions WHERE exam_id = $1 AND student_id = $2`,
      [examId, studentId]
    );
    res.json(sessions.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
