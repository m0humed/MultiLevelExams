import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getExamById, Exam } from '../../data/mockData';
import { 
  Save, 
  Plus, 
  Trash2, 
  GripVertical, 
  CheckCircle, 
  BookOpen,
  ChevronLeft 
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { motion } from 'framer-motion';

// Reuse the same interfaces from ExamCreate
interface QuestionForm {
  text: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options: string[];
  correctAnswer: string;
  points: number;
}

interface StageForm {
  title: string;
  description: string;
  duration: number;
  passingScore: number;
  questions: QuestionForm[];
}

const ExamEdit = () => {
  const { user } = useAuth();
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  
  const [examTitle, setExamTitle] = useState('');
  const [examDescription, setExamDescription] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [stages, setStages] = useState<StageForm[]>([]);
  const [currentStageIndex, setCurrentStageIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (!examId) return;
    
    // Get exam details
    const exam = getExamById(examId);
    if (!exam) {
      navigate('/404');
      return;
    }
    
    // Populate form with exam data
    setExamTitle(exam.title);
    setExamDescription(exam.description);
    setIsPublished(exam.isPublished);
    
    // Convert exam stages to form format
    const stagesForms: StageForm[] = exam.stages.map(stage => ({
      title: stage.title,
      description: stage.description,
      duration: stage.duration,
      passingScore: stage.passingScore,
      questions: stage.questions.map(question => ({
        text: question.text,
        type: question.type,
        options: question.options || [],
        correctAnswer: Array.isArray(question.correctAnswer) 
          ? question.correctAnswer[0] 
          : question.correctAnswer,
        points: question.points,
      })),
    }));
    
    setStages(stagesForms);
    setLoading(false);
  }, [examId, navigate]);

  // Add a new stage
  const addStage = () => {
    const newStage: StageForm = {
      title: '',
      description: '',
      duration: 30,
      passingScore: 70,
      questions: [],
    };
    
    setStages([...stages, newStage]);
    setCurrentStageIndex(stages.length);
  };

  // Update stage details
  const updateStage = (index: number, field: keyof StageForm, value: any) => {
    const updatedStages = [...stages];
    updatedStages[index] = {
      ...updatedStages[index],
      [field]: value,
    };
    setStages(updatedStages);
  };

  // Delete a stage
  const deleteStage = (index: number) => {
    const updatedStages = [...stages];
    updatedStages.splice(index, 1);
    setStages(updatedStages);
    
    if (currentStageIndex === index) {
      setCurrentStageIndex(null);
    } else if (currentStageIndex !== null && currentStageIndex > index) {
      setCurrentStageIndex(currentStageIndex - 1);
    }
  };

  // Add a question to the current stage
  const addQuestion = () => {
    if (currentStageIndex === null) return;
    
    const newQuestion: QuestionForm = {
      text: '',
      type: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: '',
      points: 5,
    };
    
    const updatedStages = [...stages];
    updatedStages[currentStageIndex].questions.push(newQuestion);
    setStages(updatedStages);
  };

  // Update a question
  const updateQuestion = (questionIndex: number, field: keyof QuestionForm, value: any) => {
    if (currentStageIndex === null) return;
    
    const updatedStages = [...stages];
    updatedStages[currentStageIndex].questions[questionIndex] = {
      ...updatedStages[currentStageIndex].questions[questionIndex],
      [field]: value,
    };
    setStages(updatedStages);
  };

  // Update an option in a multiple-choice question
  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    if (currentStageIndex === null) return;
    
    const updatedStages = [...stages];
    const question = updatedStages[currentStageIndex].questions[questionIndex];
    
    if (question.type === 'multiple-choice') {
      const updatedOptions = [...question.options];
      updatedOptions[optionIndex] = value;
      
      question.options = updatedOptions;
      setStages(updatedStages);
    }
  };

  // Delete a question
  const deleteQuestion = (questionIndex: number) => {
    if (currentStageIndex === null) return;
    
    const updatedStages = [...stages];
    updatedStages[currentStageIndex].questions.splice(questionIndex, 1);
    setStages(updatedStages);
  };

  // Handle stage reordering
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    
    if (sourceIndex === destinationIndex) return;
    
    const updatedStages = [...stages];
    const [removed] = updatedStages.splice(sourceIndex, 1);
    updatedStages.splice(destinationIndex, 0, removed);
    
    setStages(updatedStages);
    
    // Update current stage index if needed
    if (currentStageIndex === sourceIndex) {
      setCurrentStageIndex(destinationIndex);
    } else if (
      currentStageIndex !== null &&
      ((currentStageIndex > sourceIndex && currentStageIndex <= destinationIndex) ||
        (currentStageIndex < sourceIndex && currentStageIndex >= destinationIndex))
    ) {
      setCurrentStageIndex(
        currentStageIndex + (sourceIndex > destinationIndex ? 1 : -1)
      );
    }
  };

  // Save the exam
  const saveExam = () => {
    if (!examTitle || stages.length === 0) {
      // Validate basic requirements
      return;
    }
    
    setSaving(true);
    
    // Simulate API call to save the exam
    setTimeout(() => {
      setSaving(false);
      setSaveSuccess(true);
      
      // Show success message then navigate
      setTimeout(() => {
        navigate('/instructor/dashboard');
      }, 1500);
    }, 1500);
  };

  // Validate if the form can be submitted
  const canSubmit = () => {
    if (!examTitle) return false;
    if (stages.length === 0) return false;
    
    // Check if all stages have titles and at least one question
    return stages.every(
      stage => stage.title && stage.questions.length > 0 && stage.questions.every(q => q.text)
    );
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl pb-12">
      {/* Back button */}
      <div className="mb-4">
        <button
          onClick={() => navigate('/instructor/dashboard')}
          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to Dashboard
        </button>
      </div>
      
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Edit Exam</h1>
          <p className="mt-1 text-gray-600">Update exam details and stages</p>
        </div>
        
        <button
          onClick={saveExam}
          disabled={!canSubmit() || saving}
          className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {saving ? (
            <>Saving...</>
          ) : saveSuccess ? (
            <>
              <CheckCircle size={16} className="mr-2" />
              Saved!
            </>
          ) : (
            <>
              <Save size={16} className="mr-2" />
              Save Changes
            </>
          )}
        </button>
      </div>
      
      {/* Exam details */}
      <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Exam Details</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="examTitle" className="mb-1 block text-sm font-medium text-gray-700">
              Exam Title
            </label>
            <input
              id="examTitle"
              type="text"
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          
          <div>
            <label htmlFor="examDescription" className="mb-1 block text-sm font-medium text-gray-700">
              Exam Description
            </label>
            <textarea
              id="examDescription"
              value={examDescription}
              onChange={(e) => setExamDescription(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            ></textarea>
          </div>
          
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="h-4 w-4 rounded text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Published (visible to students)</span>
            </label>
          </div>
        </div>
      </div>
      
      {/* Stages section */}
      <div className="grid gap-6 md:grid-cols-7">
        {/* Stage list */}
        <div className="md:col-span-2">
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Stages</h2>
              <button
                onClick={addStage}
                className="inline-flex items-center rounded-md bg-primary-600 px-2 py-1 text-xs font-medium text-white hover:bg-primary-700"
              >
                <Plus size={14} className="mr-1" />
                Add
              </button>
            </div>
            
            {stages.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-300 p-4 text-center">
                <BookOpen size={24} className="mx-auto text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">No stages yet</p>
                <button
                  onClick={addStage}
                  className="mt-2 text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  Add your first stage
                </button>
              </div>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="stages">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2"
                    >
                      {stages.map((stage, index) => (
                        <Draggable key={index} draggableId={`stage-${index}`} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`flex cursor-pointer items-center rounded-md border p-3 hover:bg-gray-50 ${
                                currentStageIndex === index
                                  ? 'border-primary-500 bg-primary-50'
                                  : 'border-gray-200'
                              }`}
                              onClick={() => setCurrentStageIndex(index)}
                            >
                              <div
                                {...provided.dragHandleProps}
                                className="mr-2 text-gray-400"
                              >
                                <GripVertical size={16} />
                              </div>
                              <div className="flex-1 overflow-hidden">
                                <p className="font-medium text-gray-900 truncate">
                                  {stage.title || `Stage ${index + 1}`}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {stage.questions.length} questions
                                </p>
                              </div>
                              <button
                                className="ml-2 text-gray-400 hover:text-error-500"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteStage(index);
                                }}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </div>
        </div>
        
        {/* Stage editor - reusing most of the code from ExamCreate */}
        <div className="md:col-span-5">
          {currentStageIndex !== null ? (
            <motion.div
              key={currentStageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-lg bg-white p-6 shadow-sm"
            >
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Edit Stage {currentStageIndex + 1}
              </h2>
              
              <div className="space-y-4">
                {/* Stage details */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Stage Title
                    </label>
                    <input
                      type="text"
                      value={stages[currentStageIndex].title}
                      onChange={(e) => updateStage(currentStageIndex, 'title', e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Stage Description
                    </label>
                    <input
                      type="text"
                      value={stages[currentStageIndex].description}
                      onChange={(e) => updateStage(currentStageIndex, 'description', e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={stages[currentStageIndex].duration}
                      onChange={(e) => updateStage(currentStageIndex, 'duration', parseInt(e.target.value) || 30)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Passing Score (%)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={stages[currentStageIndex].passingScore}
                      onChange={(e) => updateStage(currentStageIndex, 'passingScore', parseInt(e.target.value) || 70)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                </div>
                
                {/* Questions */}
                <div className="mt-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-md font-semibold text-gray-900">Questions</h3>
                    <button
                      onClick={addQuestion}
                      className="inline-flex items-center rounded-md bg-primary-600 px-2 py-1 text-xs font-medium text-white hover:bg-primary-700"
                    >
                      <Plus size={14} className="mr-1" />
                      Add Question
                    </button>
                  </div>
                  
                  {stages[currentStageIndex].questions.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-gray-300 p-4 text-center">
                      <p className="text-sm text-gray-500">No questions yet</p>
                      <button
                        onClick={addQuestion}
                        className="mt-2 text-sm font-medium text-primary-600 hover:text-primary-700"
                      >
                        Add your first question
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {stages[currentStageIndex].questions.map((question, questionIndex) => (
                        <div
                          key={questionIndex}
                          className="rounded-lg border border-gray-200 p-4"
                        >
                          <div className="mb-3 flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-900">
                              Question {questionIndex + 1}
                            </h4>
                            <button
                              onClick={() => deleteQuestion(questionIndex)}
                              className="text-gray-400 hover:text-error-500"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <label className="mb-1 block text-sm font-medium text-gray-700">
                                Question Text
                              </label>
                              <input
                                type="text"
                                value={question.text}
                                onChange={(e) => updateQuestion(questionIndex, 'text', e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                              />
                            </div>
                            
                            <div className="grid gap-4 md:grid-cols-3">
                              <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                  Question Type
                                </label>
                                <select
                                  value={question.type}
                                  onChange={(e) => updateQuestion(
                                    questionIndex,
                                    'type',
                                    e.target.value as 'multiple-choice' | 'true-false' | 'short-answer'
                                  )}
                                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                >
                                  <option value="multiple-choice">Multiple Choice</option>
                                  <option value="true-false">True/False</option>
                                  <option value="short-answer">Short Answer</option>
                                </select>
                              </div>
                              
                              <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                  Points
                                </label>
                                <input
                                  type="number"
                                  min="1"
                                  value={question.points}
                                  onChange={(e) => updateQuestion(questionIndex, 'points', parseInt(e.target.value) || 5)}
                                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                />
                              </div>
                            </div>
                            
                            {/* Question type specific fields - same as in ExamCreate */}
                            {question.type === 'multiple-choice' && (
                              <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                  Options
                                </label>
                                <div className="space-y-2">
                                  {question.options.map((option, optionIndex) => (
                                    <div key={optionIndex} className="flex items-center">
                                      <input
                                        type="radio"
                                        name={`correct-${questionIndex}`}
                                        checked={question.correctAnswer === option}
                                        onChange={() => updateQuestion(questionIndex, 'correctAnswer', option)}
                                        className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500"
                                      />
                                      <input
                                        type="text"
                                        value={option}
                                        onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                                        className="flex-1 rounded-md border border-gray-300 px-3 py-1 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                      />
                                    </div>
                                  ))}
                                </div>
                                <p className="mt-1 text-xs text-gray-500">
                                  Select the radio button next to the correct answer
                                </p>
                              </div>
                            )}
                            
                            {question.type === 'true-false' && (
                              <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                  Correct Answer
                                </label>
                                <div className="flex space-x-4">
                                  <label className="inline-flex items-center">
                                    <input
                                      type="radio"
                                      name={`tf-${questionIndex}`}
                                      value="true"
                                      checked={question.correctAnswer === 'true'}
                                      onChange={() => updateQuestion(questionIndex, 'correctAnswer', 'true')}
                                      className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500"
                                    />
                                    <span className="text-sm text-gray-700">True</span>
                                  </label>
                                  <label className="inline-flex items-center">
                                    <input
                                      type="radio"
                                      name={`tf-${questionIndex}`}
                                      value="false"
                                      checked={question.correctAnswer === 'false'}
                                      onChange={() => updateQuestion(questionIndex, 'correctAnswer', 'false')}
                                      className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500"
                                    />
                                    <span className="text-sm text-gray-700">False</span>
                                  </label>
                                </div>
                              </div>
                            )}
                            
                            {question.type === 'short-answer' && (
                              <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                  Correct Answer
                                </label>
                                <input
                                  type="text"
                                  value={question.correctAnswer as string}
                                  onChange={(e) => updateQuestion(questionIndex, 'correctAnswer', e.target.value)}
                                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex h-full items-center justify-center rounded-lg bg-white p-6 shadow-sm">
              <div className="text-center">
                <BookOpen size={40} className="mx-auto text-gray-400" />
                <p className="mt-2 text-gray-600">
                  {stages.length > 0
                    ? 'Select a stage to edit or add a new one'
                    : 'Add a stage to get started'}
                </p>
                <button
                  onClick={addStage}
                  className="mt-4 inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
                >
                  <Plus size={16} className="mr-2" />
                  Add Stage
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamEdit;