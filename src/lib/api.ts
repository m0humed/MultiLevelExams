const API_URL = import.meta.env.VITE_API_URL;

export const api = {
  // Auth
  register: async (data: any) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  login: async (data: any) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Exams
  getExams: async () => {
    const response = await fetch(`${API_URL}/exams`);
    return response.json();
  },

  getExam: async (id: string) => {
    const response = await fetch(`${API_URL}/exams/${id}`);
    return response.json();
  },

  createExam: async (data: any) => {
    const response = await fetch(`${API_URL}/exams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  updateExam: async (id: string, data: any) => {
    const response = await fetch(`${API_URL}/exams/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Progress
  getProgress: async (studentId: string, examId: string) => {
    const response = await fetch(`${API_URL}/progress/${studentId}/${examId}`);
    return response.json();
  },

  getStageProgress: async (studentId: string, examId: string, stageId: string) => {
    const response = await fetch(`${API_URL}/progress/${studentId}/${examId}/${stageId}`);
    return response.json();
  },

  saveProgress: async (data: any) => {
    const response = await fetch(`${API_URL}/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
};