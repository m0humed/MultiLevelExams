// Mock data for the exam system

import { User, UserRole } from '../context/AuthContext';

// Types
export interface ExamStage {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  duration: number; // in minutes
  passingScore: number; // percentage required to pass
  order: number;
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: string[];
  correctAnswer: string | string[];
  points: number;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  createdBy: string; // instructor ID
  createdAt: string;
  stages: ExamStage[];
  isPublished: boolean;
}

export interface StudentProgress {
  studentId: string;
  examId: string;
  stageId: string;
  completed: boolean;
  score: number;
  passed: boolean;
  startedAt: string;
  completedAt?: string;
}

// Mock data
export const mockInstructors: User[] = [
  {
    id: '1',
    name: 'Esraa Mostafa',
    email: 'instructor@example.com',
    role: 'instructor' as UserRole,
  },
];

export const mockStudents: User[] = [
  {
    id: '2',
    name: 'ُEsraa Mostafa',
    email: 'student@example.com',
    role: 'student' as UserRole,
  },
  {
    id: '3',
    name: 'Esraa Mostafa',
    email: 'alice@example.com',
    role: 'student' as UserRole,
  },
];

export const mockExams: Exam[] = [
  {
    "id": "1",
    "title": "Fundamentals of Nursing Assessment",
    "description": "Evaluate your understanding of core clinical concepts including vital signs, electrolyte balance, and patient positioning.",
    "createdBy": "1",
    "createdAt": "2025-05-17T12:00:00Z",
    "isPublished": true,
    "stages": [
      {
        "id": "1-1",
        "title": "Patient Assessment Essentials",
        "description": "Test your knowledge of respiratory rate, blood pressure, electrolyte balance, and more.",
        "order": 1,
        "duration": 40,
        "passingScore": 50,
        "questions": [
          {
            "id": "1-1-1",
            "text": "What is the normal range for adult respiratory rate?",
            "type": "multiple-choice",
            "options": [
              "8–14 breaths/min",
              "10–20 breaths/min",
              "12–20 breaths/min",
              "16–24 breaths/min"
            ],
            "correctAnswer": "12–20 breaths/min",
            "points": 5
          },
          {
            "id": "1-1-2",
            "text": "Which electrolyte is most critical for cardiac muscle function?",
            "type": "multiple-choice",
            "options": ["Sodium", "Potassium", "Calcium", "Magnesium"],
            "correctAnswer": "Potassium",
            "points": 5
          },
          {
            "id": "1-1-3",
            "text": "Which of the following is the most accurate method to assess core body temperature?",
            "type": "multiple-choice",
            "options": ["Axillary", "Oral", "Tympanic", "Rectal"],
            "correctAnswer": "Rectal",
            "points": 5
          },
          {
            "id": "1-1-4",
            "text": "Which position is best for a patient experiencing difficulty breathing?",
            "type": "multiple-choice",
            "options": ["Supine", "Trendelenburg", "High Fowler’s", "Prone"],
            "correctAnswer": "High Fowler’s",
            "points": 5
          },
          {
            "id": "1-1-5",
            "text": "A pulse oximeter measures:",
            "type": "multiple-choice",
            "options": ["Blood pressure", "Oxygen saturation", "CO₂ level", "Pulse rate only"],
            "correctAnswer": "Oxygen saturation",
            "points": 5
          },
          {
            "id": "1-1-6",
            "text": "What is the primary purpose of incentive spirometry postoperatively?",
            "type": "multiple-choice",
            "options": ["Promote blood flow", "Prevent DVT", "Prevent atelectasis", "Control pain"],
            "correctAnswer": "Prevent atelectasis",
            "points": 5
          },
          {
            "id": "1-1-7",
            "text": "Which blood pressure reading indicates Stage 1 hypertension?",
            "type": "multiple-choice",
            "options": ["118/76 mmHg", "128/80 mmHg", "134/88 mmHg", "146/94 mmHg"],
            "correctAnswer": "146/94 mmHg",
            "points": 5
          },
          {
            "id": "1-1-8",
            "text": "A patient with low hemoglobin is most likely to exhibit:",
            "type": "multiple-choice",
            "options": ["Jaundice", "Cyanosis", "Fatigue", "Diarrhea"],
            "correctAnswer": "Fatigue",
            "points": 5
          },
          {
            "id": "1-1-9",
            "text": "What is the normal range for serum sodium?",
            "type": "multiple-choice",
            "options": ["125–135 mEq/L", "135–145 mEq/L", "140–150 mEq/L", "145–155 mEq/L"],
            "correctAnswer": "135–145 mEq/L",
            "points": 5
          },
          {
            "id": "1-1-10",
            "text": "Before giving digoxin, what should the nurse assess?",
            "type": "multiple-choice",
            "options": ["Respiratory rate", "Apical pulse", "Blood pressure", "Temperature"],
            "correctAnswer": "Apical pulse",
            "points": 5
          }
        ]
      }, 
      {
        "id": "1-2",
        "title": "Clinical Reasoning and Pathophysiology",
        "description": "Assess your understanding of fluid balance, respiratory disorders, post-operative care, and lab interpretation.",
        "order": 2,
        "duration": 40,
        "passingScore": 50,
        "questions": [
          {
            "id": "1-2-1",
            "text": "A patient with prolonged vomiting is most at risk for which acid-base imbalance?",
            "type": "multiple-choice",
            "options": [
              "Metabolic acidosis",
              "Metabolic alkalosis",
              "Respiratory acidosis",
              "Respiratory alkalosis"
            ],
            "correctAnswer": "Metabolic alkalosis",
            "points": 5
          },
          {
            "id": "1-2-2",
            "text": "The main goal of administering IV fluids to a dehydrated patient is to:",
            "type": "multiple-choice",
            "options": [
              "Prevent infection",
              "Decrease urine output",
              "Restore fluid volume",
              "Lower blood sugar"
            ],
            "correctAnswer": "Restore fluid volume",
            "points": 5
          },
          {
            "id": "1-2-3",
            "text": "A patient with COPD has a high CO₂ level. What does this indicate?",
            "type": "multiple-choice",
            "options": [
              "Hyperventilation",
              "Metabolic acidosis",
              "Respiratory acidosis",
              "Respiratory alkalosis"
            ],
            "correctAnswer": "Respiratory acidosis",
            "points": 5
          },
          {
            "id": "1-2-4",
            "text": "The purpose of checking a surgical patient’s hemoglobin postoperatively is to:",
            "type": "multiple-choice",
            "options": [
              "Check oxygen saturation",
              "Detect infection",
              "Evaluate fluid overload",
              "Assess for blood loss"
            ],
            "correctAnswer": "Assess for blood loss",
            "points": 5
          },
          {
            "id": "1-2-5",
            "text": "Why is early ambulation encouraged after surgery?",
            "type": "multiple-choice",
            "options": [
              "Improves appetite",
              "Promotes wound healing",
              "Prevents constipation and DVT",
              "Reduces pain"
            ],
            "correctAnswer": "Prevents constipation and DVT",
            "points": 5
          },
          {
            "id": "1-2-6",
            "text": "Which lab value indicates a risk for bleeding?",
            "type": "multiple-choice",
            "options": [
              "Elevated hemoglobin",
              "Low platelet count",
              "High BUN",
              "Elevated sodium"
            ],
            "correctAnswer": "Low platelet count",
            "points": 5
          },
          {
            "id": "1-2-7",
            "text": "In a patient with pneumonia, crackles on auscultation are due to:",
            "type": "multiple-choice",
            "options": [
              "Fluid in alveoli",
              "Muscle spasm",
              "Narrowed airways",
              "Inflammation of pleura"
            ],
            "correctAnswer": "Fluid in alveoli",
            "points": 5
          },
          {
            "id": "1-2-8",
            "text": "Which of the following indicates improvement in a patient with heart failure?",
            "type": "multiple-choice",
            "options": [
              "Increased edema",
              "Weight gain",
              "Decreased crackles",
              "Shortness of breath at rest"
            ],
            "correctAnswer": "Decreased crackles",
            "points": 5
          },
          {
            "id": "1-2-9",
            "text": "The nurse suspects hypokalemia. Which of the following would support this?",
            "type": "multiple-choice",
            "options": [
              "Hypertension",
              "Bradycardia",
              "Muscle weakness",
              "Diarrhea"
            ],
            "correctAnswer": "Muscle weakness",
            "points": 5
          },
          {
            "id": "1-2-10",
            "text": "A patient asks why they need to complete their antibiotics. The nurse explains:",
            "type": "multiple-choice",
            "options": [
              "So your symptoms go away faster.",
              "To save money.",
              "To prevent resistance and recurrence.",
              "Because your doctor said so."
            ],
            "correctAnswer": "To prevent resistance and recurrence.",
            "points": 5
          }
        ]
      },
      {
      "id": "1-3",
      "title": "Acute Care Priorities",
      "description": "Focus on decision-making in critical patient care situations including medications, monitoring, and emergency response.",
      "order": 3,
      "duration": 40,
      "passingScore": 70,
      "questions": [
        {
          "id": "1-3-1",
          "text": "A patient with heart failure is receiving furosemide. The nurse notices a decrease in urine output. What should be the nurse’s first action?",
          "type": "multiple-choice",
          "options": [
            "Increase the fluid intake",
            "Assess the patient’s blood pressure",
            "Notify the healthcare provider",
            "Document the finding"
          ],
          "correctAnswer": "Assess the patient’s blood pressure",
          "points": 5
        },
        {
          "id": "1-3-2",
          "text": "A patient with acute pancreatitis has severe abdominal pain. What should the nurse do to manage this pain?",
          "type": "multiple-choice",
          "options": [
            "Administer a high-fat diet",
            "Encourage the patient to walk",
            "Administer pain medication as prescribed",
            "Offer hot compresses to the abdomen"
          ],
          "correctAnswer": "Administer pain medication as prescribed",
          "points": 5
        },
        {
          "id": "1-3-3",
          "text": "A diabetic patient is receiving insulin and has a blood glucose of 60 mg/dL. The patient is conscious but reports feeling shaky and weak. What should the nurse do?",
          "type": "multiple-choice",
          "options": [
            "Administer a dose of insulin",
            "Encourage the patient to drink a sugary beverage",
            "Prepare to administer glucagon",
            "Withhold food and fluids"
          ],
          "correctAnswer": "Encourage the patient to drink a sugary beverage",
          "points": 5
        },
        {
          "id": "1-3-4",
          "text": "A patient recovering from a hip replacement surgery reports severe calf pain, redness, and swelling. What is the most likely cause?",
          "type": "multiple-choice",
          "options": [
            "Deep vein thrombosis (DVT)",
            "Hip prosthesis rejection",
            "Nerve impingement",
            "Wound infection"
          ],
          "correctAnswer": "Deep vein thrombosis (DVT)",
          "points": 5
        },
        {
          "id": "1-3-5",
          "text": "A nurse is caring for a patient with a tracheostomy who is experiencing difficulty breathing. What is the nurse’s first priority?",
          "type": "multiple-choice",
          "options": [
            "Suction the tracheostomy tube",
            "Call the healthcare provider",
            "Administer oxygen",
            "Reposition the patient"
          ],
          "correctAnswer": "Suction the tracheostomy tube",
          "points": 5
        },
        {
          "id": "1-3-6",
          "text": "A postoperative patient develops a fever and tachycardia on the second day after surgery. What should the nurse suspect?",
          "type": "multiple-choice",
          "options": [
            "Pulmonary embolism",
            "Infection",
            "Dehydration",
            "Hypovolemic shock"
          ],
          "correctAnswer": "Infection",
          "points": 5
        },
        {
          "id": "1-3-7",
          "text": "A patient is receiving anticoagulation therapy with warfarin. The nurse notes that the patient’s INR is 5.0. What action should the nurse take?",
          "type": "multiple-choice",
          "options": [
            "Administer the scheduled dose of warfarin",
            "Withhold the next dose of warfarin and notify the healthcare provider",
            "Increase the warfarin dose",
            "Document the findings and continue with care"
          ],
          "correctAnswer": "Withhold the next dose of warfarin and notify the healthcare provider",
          "points": 5
        },
        {
          "id": "1-3-8",
          "text": "A patient is admitted with chest pain and a history of hypertension. An EKG shows ST-segment elevation. What is the nurse’s priority action?",
          "type": "multiple-choice",
          "options": [
            "Administer morphine as prescribed",
            "Position the patient in a high Fowler's position",
            "Administer oxygen and notify the healthcare provider",
            "Obtain a chest x-ray"
          ],
          "correctAnswer": "Administer oxygen and notify the healthcare provider",
          "points": 5
        },
        {
          "id": "1-3-9",
          "text": "A patient with chronic kidney disease is being started on hemodialysis. The nurse should teach the patient that one of the most important aspects of care is:",
          "type": "multiple-choice",
          "options": [
            "Limiting fluid intake",
            "Taking potassium supplements",
            "Exercising regularly",
            "Increasing protein intake"
          ],
          "correctAnswer": "Limiting fluid intake",
          "points": 5
        },
        {
          "id": "1-3-10",
          "text": "A nurse is caring for a patient with a new diagnosis of a stroke affecting the right hemisphere. What symptoms should the nurse expect to observe?",
          "type": "multiple-choice",
          "options": [
            "Left-sided paralysis and speech impairment",
            "Right-sided paralysis and difficulty with vision",
            "Left-sided paralysis and difficulty with memory",
            "Right-sided paralysis and impulsive behavior"
          ],
          "correctAnswer": "Right-sided paralysis and impulsive behavior",
          "points": 5
        }
      ]
    }
  ]
}
  ,
    {
    id: '2',
    title: 'Acute Care Nursing Priorities',
    description: 'Evaluate critical nursing interventions and decision-making in acute clinical settings.',
    createdBy: '1',
    createdAt: '2025-05-17T12:00:00Z',
    isPublished: true,
    stages: [
      {
      id: '2-1',
      title: 'Clinical Decision-Making in Acute Care',
      description: 'Prioritize and apply appropriate nursing actions in acute care scenarios.',
      order: 1,
      duration: 45,
      passingScore: 50,
      questions: [
      {
      id: '2-1-1',
      text: 'A patient with a history of asthma is admitted to the emergency department in respiratory distress. The nurse notes the patient is using accessory muscles to breathe. What is the nurse’s priority action?',
      type: 'multiple-choice',
      options: [
      'Administer a bronchodilator',
      'Notify the healthcare provider',
      'Apply supplemental oxygen',
      'Initiate an intravenous line for fluids'
      ],
      correctAnswer: 'Administer a bronchodilator',
      points: 5
      },
      {
      id: '2-1-2',
      text: 'A nurse is caring for a patient receiving a blood transfusion. The patient begins to experience chills and a low-grade fever. What should the nurse do first?',
      type: 'multiple-choice',
      options: [
      'Stop the transfusion and notify the healthcare provider',
      'Increase the rate of the transfusion',
      'Administer acetaminophen for the fever',
      'Continue the transfusion at the current rate'
      ],
      correctAnswer: 'Stop the transfusion and notify the healthcare provider',
      points: 5
      },
      {
      id: '2-1-3',
      text: 'A patient with sepsis develops oliguria and low blood pressure. The nurse suspects acute kidney injury. What is the nurse’s priority action?',
      type: 'multiple-choice',
      options: [
      'Administer intravenous fluids',
      'Monitor vital signs every hour',
      'Perform a bladder scan',
      'Prepare the patient for dialysis'
      ],
      correctAnswer: 'Administer intravenous fluids',
      points: 5
      },
      {
      id: '2-1-4',
      text: 'A nurse is caring for a patient who has just undergone a lobectomy. The nurse notes that the patient is coughing up pink-tinged sputum. What is the nurse’s priority assessment?',
      type: 'multiple-choice',
      options: [
      'Oxygen saturation',
      'Blood pressure',
      'Temperature',
      'Pain level'
      ],
      correctAnswer: 'Oxygen saturation',
      points: 5
      },
      {
      id: '2-1-5',
      text: 'A patient is receiving opioids for pain management and develops shallow respirations. What is the nurse\'s priority action?',
      type: 'multiple-choice',
      options: [
      'Administer naloxone',
      'Increase the oxygen flow rate',
      'Administer an antiemetic',
      'Notify the healthcare provider'
      ],
      correctAnswer: 'Administer naloxone',
      points: 5
      },
      {
      id: '2-1-6',
      text: 'A nurse is assessing a patient with a history of heart failure. The patient is experiencing increased shortness of breath and peripheral edema. What should the nurse assess first?',
      type: 'multiple-choice',
      options: [
      'Oxygen saturation',
      'Heart sounds',
      'Blood pressure',
      'Fluid status (weight and intake/output)'
      ],
      correctAnswer: 'Fluid status (weight and intake/output)',
      points: 5
      },
      {
      id: '2-1-7',
      text: 'A patient with pneumonia is receiving antibiotics. The nurse notices that the patient’s temperature has increased despite treatment. What should the nurse assess next?',
      type: 'multiple-choice',
      options: [
      'Serum electrolyte levels',
      'Response to antibiotics (cultures and sensitivity)',
      'Kidney function tests',
      'Respiratory rate and effort'
      ],
      correctAnswer: 'Response to antibiotics (cultures and sensitivity)',
      points: 5
      },
      {
      id: '2-1-8',
      text: 'A nurse is caring for a patient who is receiving parenteral nutrition (PN). The nurse notes that the patient’s blood glucose level is 300 mg/dL. What is the most appropriate intervention?',
      type: 'multiple-choice',
      options: [
      'Administer insulin as ordered',
      'Increase the infusion rate of PN',
      'Administer a bolus of normal saline',
      'Decrease the PN infusion rate'
      ],
      correctAnswer: 'Administer insulin as ordered',
      points: 5
      },
      {
      id: '2-1-9',
      text: 'A nurse is assessing a patient after a stroke affecting the left hemisphere. What symptom is most likely to be observed?',
      type: 'multiple-choice',
      options: [
      'Right-sided paralysis',
      'Left-sided paralysis',
      'Difficulty with speech and language',
      'Impulsive behavior'
      ],
      correctAnswer: 'Difficulty with speech and language',
      points: 5
      },
      {
      id: '2-1-10',
      text: 'A nurse is caring for a patient post-laparotomy. The patient begins to complain of sudden chest pain and shortness of breath. What is the nurse’s priority intervention?',
      type: 'multiple-choice',
      options: [
      'Obtain a chest x-ray',
      'Administer pain medication as prescribed',
      'Assess for signs of a pulmonary embolism',
      'Notify the healthcare provider and prepare for a CT scan'
      ],
      correctAnswer: 'Assess for signs of a pulmonary embolism',
      points: 5
      }
      ]
      },
          {
        id: '2-2',
        title: 'Core Clinical Nursing Actions',
        description: 'Prioritize interventions in diverse clinical cases including chronic conditions, post-operative care, and emergencies.',
        order: 2,
        duration: 45,
        passingScore: 50,
        questions: [
          {
            id: '2-2-1',
            text: 'A nurse is planning care for a patient who has undergone a total hip replacement. Which intervention should be included in the patient\'s care plan to promote mobility?',
            type: 'multiple-choice',
            options: [
              'Encourage the patient to ambulate with the aid of a walker immediately after surgery',
              'Administer pain medication only when the patient complains of pain',
              'Teach the patient to perform leg exercises every 4 hours',
              'Teach the patient to avoid moving the affected leg for the first 48 hours'
            ],
            correctAnswer: 'Teach the patient to perform leg exercises every 4 hours',
            points: 5
          },
          {
            id: '2-2-2',
            text: 'A nurse is developing a care plan for a patient with chronic obstructive pulmonary disease (COPD). What is the priority nursing intervention?',
            type: 'multiple-choice',
            options: [
              'Monitor oxygen saturation levels frequently',
              'Administer corticosteroids as prescribed',
              'Provide a high-calorie diet to maintain weight',
              'Encourage the patient to perform chest physiotherapy'
            ],
            correctAnswer: 'Monitor oxygen saturation levels frequently',
            points: 5
          },
          {
            id: '2-2-3',
            text: 'A nurse is caring for a patient with end-stage liver disease. The patient is experiencing ascites. What intervention should the nurse implement to manage this condition?',
            type: 'multiple-choice',
            options: [
              'Administer diuretics as prescribed',
              'Provide a high-sodium diet',
              'Increase oral fluid intake',
              'Restrict protein intake'
            ],
            correctAnswer: 'Administer diuretics as prescribed',
            points: 5
          },
          {
            id: '2-2-4',
            text: 'A nurse is caring for a patient with congestive heart failure (CHF) who is experiencing shortness of breath and crackles in the lungs. What should the nurse do first?',
            type: 'multiple-choice',
            options: [
              'Administer oxygen as prescribed',
              'Increase the IV fluid rate',
              'Position the patient in a low Fowler’s position',
              'Administer a diuretic as prescribed'
            ],
            correctAnswer: 'Administer oxygen as prescribed',
            points: 5
          },
          {
            id: '2-2-5',
            text: 'A patient with a history of hypertension is prescribed a new antihypertensive medication. The nurse should monitor for which common side effect of this medication?',
            type: 'multiple-choice',
            options: [
              'Nausea and vomiting',
              'Headache and dizziness',
              'Tachycardia',
              'Excessive salivation'
            ],
            correctAnswer: 'Headache and dizziness',
            points: 5
          },
          {
            id: '2-2-6',
            text: 'A nurse is teaching a patient about lifestyle modifications for managing type 2 diabetes. Which statement indicates that the patient understands the teaching?',
            type: 'multiple-choice',
            options: [
              '“I will take my medications exactly as prescribed, and I don\'t need to change my diet.”',
              '“I will exercise at least 30 minutes a day and monitor my blood sugar regularly.”',
              '“I will follow a high-fat diet to help control my blood sugar levels.”',
              '“I will stop monitoring my blood sugar once my levels return to normal.”'
            ],
            correctAnswer: '“I will exercise at least 30 minutes a day and monitor my blood sugar regularly.”',
            points: 5
          },
          {
            id: '2-2-7',
            text: 'A nurse is caring for a patient with a burn injury. What is the priority intervention in the first 24 hours after the injury?',
            type: 'multiple-choice',
            options: [
              'Administer pain medications as prescribed',
              'Initiate fluid resuscitation',
              'Apply topical antibiotics to the burn area',
              'Elevate the patient’s limbs to reduce swelling'
            ],
            correctAnswer: 'Initiate fluid resuscitation',
            points: 5
          },
          {
            id: '2-2-8',
            text: 'A nurse is caring for a patient who has undergone a mastectomy. What is the most important action to include in the care plan to prevent lymphedema?',
            type: 'multiple-choice',
            options: [
              'Elevate the affected arm above the level of the heart',
              'Apply a tight compression bandage to the arm',
              'Encourage vigorous arm exercises immediately post-surgery',
              'Administer antibiotics to prevent infection'
            ],
            correctAnswer: 'Elevate the affected arm above the level of the heart',
            points: 5
          },
          {
            id: '2-2-9',
            text: 'A patient with a history of asthma is admitted with difficulty breathing. The nurse administers a bronchodilator, but the patient’s symptoms persist. What should the nurse do next?',
            type: 'multiple-choice',
            options: [
              'Administer an inhaled corticosteroid',
              'Call the healthcare provider immediately',
              'Increase the dose of the bronchodilator',
              'Continue monitoring the patient without further intervention'
            ],
            correctAnswer: 'Call the healthcare provider immediately',
            points: 5
          },
          {
            id: '2-2-10',
            text: 'A nurse is assessing a patient who has undergone a stroke. The patient has difficulty swallowing and is at risk for aspiration. What is the nurse’s priority action?',
            type: 'multiple-choice',
            options: [
              'Encourage the patient to eat small, frequent meals',
              'Place the patient on a soft diet',
              'Implement aspiration precautions and monitor for signs of choking',
              'Administer a feeding tube to ensure nutritional intake'
            ],
            correctAnswer: 'Implement aspiration precautions and monitor for signs of choking',
            points: 5
          }
        ]
      }
    ]
  }
  ];

export const mockStudentProgress: StudentProgress[] = [
  {
    studentId: '2',
    examId: '1',
    stageId: '1-1',
    completed: true,
    score: 80,
    passed: true,
    startedAt: '2024-04-10T09:15:00Z',
    completedAt: '2024-04-10T09:40:00Z',
  },
  {
    studentId: '2',
    examId: '1',
    stageId: '1-2',
    completed: false,
    score: 0,
    passed: false,
    startedAt: '2024-04-10T10:00:00Z',
  },
];

// Helper functions
export const getAvailableExams = (studentId: string) => {
  return mockExams.filter(exam => exam.isPublished);
};

export const getExamById = (examId: string) => {
  return mockExams.find(exam => exam.id === examId);
};

export const getStudentProgress = (studentId: string, examId: string) => {
  return mockStudentProgress.filter(
    progress => progress.studentId === studentId && progress.examId === examId
  );
};

export const getExamStageById = (examId: string, stageId: string) => {
  const exam = getExamById(examId);
  return exam?.stages.find(stage => stage.id === stageId);
};

export const canAccessStage = (studentId: string, examId: string, stageId: string) => {
  const exam = getExamById(examId);
  if (!exam) return false;
  
  const stage = exam.stages.find(s => s.id === stageId);
  if (!stage) return false;
  
  // If it's the first stage, they can access it
  if (stage.order === 1) return true;
  
  // Find the previous stage
  const previousStage = exam.stages.find(s => s.order === stage.order - 1);
  if (!previousStage) return true;
  
  // Check if they've passed the previous stage
  const progress = mockStudentProgress.find(
    p => p.studentId === studentId && p.examId === examId && p.stageId === previousStage.id
  );
  
  return progress?.passed === true;
};

export const getStudentsForInstructor = () => {
  return mockStudents;
};

export const getExamsCreatedByInstructor = (instructorId: string) => {
  return mockExams.filter(exam => exam.createdBy === instructorId);
};