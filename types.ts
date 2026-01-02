
export interface CandidateAnalysis {
  experience_level: "0-1 years" | "1-2 years" | "2+ years";
  primary_skills: string[];
  weak_areas_detected: string[];
}

export interface Question {
  id: number;
  question: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  subtopic: string;
  time_limit_minutes: number;
  expected_approach: string;
  key_concepts: string[];
  hints: string[];
  follow_up?: string;
  isAdaptive?: boolean; // New optional flag to mark adaptive questions
}

export interface InterviewData {
  candidate_analysis: CandidateAnalysis;
  questions: Question[];
}

export interface GenerationState {
  isLoading: boolean;
  error: string | null;
  data: InterviewData | null;
}

export interface EvaluationScores {
  correctness: number;
  approach_quality: number;
  code_quality: number;
  communication: number;
  completeness: number;
  overall: number;
}

export interface AnswerEvaluation {
  scores: EvaluationScores;
  strengths: string[];
  weaknesses: string[];
  specific_feedback: string;
  improvement_areas: string[];
  would_hire: boolean;
  confidence: "high" | "medium" | "low";
}

export interface QuestionResult {
  question: Question;
  evaluation: AnswerEvaluation;
  timestamp: number;
}

export interface WeakArea {
  area: string;
  severity: "high" | "medium" | "low";
  evidence: string;
  gap_type: "knowledge" | "application" | "communication";
  impact: string;
  priority: number;
}

export interface Recommendation {
  action: string;
  reason: string;
  estimated_time: string;
}

export interface WeaknessAnalysisResult {
  weak_areas: WeakArea[];
  strong_areas: string[];
  recommendations: Recommendation[];
  next_focus: string;
}

export interface StudyResource {
  step: number;
  resource_type: "video" | "article" | "practice" | "course";
  title: string;
  url: string;
  duration?: string;
  count?: string;
  why_recommended: string;
}

export interface StudyPlan {
  topic: string;
  learning_path: StudyResource[];
  practice_problems: string[];
  estimated_mastery_time: string;
}

export interface AdaptiveQuestionResponse {
  next_question: Question;
  adaptation_applied: "Increased difficulty" | "Maintained level" | "Decreased difficulty";
  encouragement_message: string;
}

export interface LiveFeedbackReport {
  overallScore: number;
  summary: string;
  hiringRecommendation: "YES" | "NO" | "MAYBE";
  categoryScores: {
    category: string;
    score: number;
  }[];
  strengths: string[];
  weaknesses: string[];
  transcriptAnalysis: {
    question: string;
    candidateResponseSummary: string;
    evaluation: "STRONG" | "ADEQUATE" | "WEAK" | "FAIL";
    feedback: string;
    improvementTip: string;
    score: number;
  }[];
  roadmap: {
    phase: string;
    tasks: string[];
  }[];
}
