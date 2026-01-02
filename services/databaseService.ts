
import { supabase } from '../lib/supabaseClient';
import { Question, AnswerEvaluation } from '../types';

export const saveInterviewSession = async (userId: string, resumeText: string, difficulty: string) => {
  try {
    const { data, error } = await supabase
      .from('interviews')
      .insert([{ user_id: userId, resume_text: resumeText, difficulty }])
      .select()
      .single();

    if (error) {
      console.warn("Supabase saveInterviewSession failed (using mock ID):", error.message);
      // Return a mock ID so the app flow continues even if DB is down/misconfigured
      return { id: 'mock-session-' + Date.now() };
    }
    return data;
  } catch (err) {
    console.error("Unexpected error saving interview:", err);
    return { id: 'mock-session-' + Date.now() };
  }
};

export const saveQuestions = async (interviewId: string, questions: Question[]) => {
  // If we have a mock session ID, don't try to save to DB as foreign key constraint will fail
  if (interviewId.startsWith('mock-')) {
     return questions.map(q => ({ ...q, id: 'mock-q-' + q.id }));
  }

  try {
    const rows = questions.map((q, index) => ({
      interview_id: interviewId,
      question_index: index,
      question_data: q 
    }));

    const { data, error } = await supabase
      .from('questions')
      .insert(rows)
      .select();

    if (error) {
      console.error("Error saving questions:", error);
      return [];
    }
    return data;
  } catch (err) {
    console.error("Unexpected error saving questions:", err);
    return [];
  }
};

export const saveQuestionResult = async (
  userId: string, 
  questionDbId: string, 
  answerText: string, 
  evaluation: AnswerEvaluation
) => {
  // If mock ID, skip DB
  if (!questionDbId || questionDbId.startsWith('mock-')) return null;

  try {
    const { data, error } = await supabase
      .from('question_results')
      .insert([{
        user_id: userId,
        question_id: questionDbId,
        answer_text: answerText,
        evaluation_data: evaluation
      }]);

    if (error) console.error("Error saving result:", error);
    return data;
  } catch (err) {
    console.error("Unexpected error saving result:", err);
    return null;
  }
};
