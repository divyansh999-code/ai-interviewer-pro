
import { GoogleGenAI, Type } from "@google/genai";
import { InterviewData, Question, AnswerEvaluation, QuestionResult, WeaknessAnalysisResult, StudyPlan, AdaptiveQuestionResponse, CandidateAnalysis } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_ID = "gemini-3-flash-preview";

export const generateInterviewQuestions = async (resumeText: string): Promise<InterviewData> => {
  const systemInstruction = `
    You are an expert technical interviewer at a FAANG-level company.
    Analyze the resume and generate 10 high-quality interview questions.
    
    CRITICAL RULES:
    1. Questions must be DIVERSE: Mix of Coding (DSA), System Design, and Conceptual/Behavioral.
    2. Difficulty must match the resume:
       - 0-2 years: Focus on Arrays, Strings, HashMaps, Basic API design.
       - 3-5 years: Trees, Graphs, Async/Concurrency, Scalable DB design.
       - 5+ years: Distributed Systems, Microservices, Leadership, Hard DSA.
    3. JSON Format must be strictly followed.
  `;

  const prompt = `
    Resume Data:
    ${resumeText}
    
    Output strictly valid JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            candidate_analysis: {
              type: Type.OBJECT,
              properties: {
                experience_level: { type: Type.STRING, enum: ["0-1 years", "1-2 years", "2+ years"] },
                primary_skills: { type: Type.ARRAY, items: { type: Type.STRING } },
                weak_areas_detected: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["experience_level", "primary_skills", "weak_areas_detected"]
            },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  question: { type: Type.STRING },
                  difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
                  topic: { type: Type.STRING },
                  subtopic: { type: Type.STRING },
                  time_limit_minutes: { type: Type.INTEGER },
                  expected_approach: { type: Type.STRING },
                  key_concepts: { type: Type.ARRAY, items: { type: Type.STRING } },
                  hints: { type: Type.ARRAY, items: { type: Type.STRING } },
                  follow_up: { type: Type.STRING }
                },
                required: ["id", "question", "difficulty", "topic", "subtopic", "time_limit_minutes", "expected_approach", "key_concepts", "hints"]
              }
            }
          },
          required: ["candidate_analysis", "questions"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    return JSON.parse(text) as InterviewData;

  } catch (error) {
    console.error("Error generating interview questions:", error);
    throw new Error("Failed to generate interview questions. Please try again.");
  }
};

export const evaluateAnswer = async (question: Question, answerText: string): Promise<AnswerEvaluation> => {
  const systemInstruction = `
    You are a Senior Technical Mentor. Your goal is to EVALUATE and ENCOURAGE.
    
    SCORING RUBRIC (BE REASONABLE):
    - 0-2: Empty, completely irrelevant, or gibberish.
    - 3-5: Wrong approach, but understood the problem. Pseudocode logic is visible.
    - 6-7: Correct logic/algorithm, but syntax errors or minor bugs. (MOST COMMON)
    - 8-9: Working solution, good complexity.
    - 10: Perfect, optimized, handles edge cases, clean code.

    FEEDBACK STYLE:
    - Be specific. Quote the user's code.
    - If they used a brute force approach, acknowledge it works but suggest optimization.
    - If syntax is wrong, show the fix.
    - DO NOT be a harsh compiler. Be a human interviewer.
  `;

  const prompt = `
    QUESTION: ${question.question}
    TOPIC: ${question.topic}
    EXPECTED: ${question.expected_approach}

    CANDIDATE ANSWER:
    ${answerText}

    Analyze strictly but fairly. Return JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scores: {
              type: Type.OBJECT,
              properties: {
                correctness: { type: Type.NUMBER, description: "Score 0-10 based on logic validity" },
                approach_quality: { type: Type.NUMBER, description: "Score 0-10 based on Big O complexity" },
                code_quality: { type: Type.NUMBER, description: "Score 0-10 on readability/naming" },
                communication: { type: Type.NUMBER, description: "Score 0-10 on clarity/comments" },
                completeness: { type: Type.NUMBER, description: "Score 0-10 on edge cases" },
                overall: { type: Type.NUMBER, description: "Weighted average" },
              },
              required: ["correctness", "approach_quality", "code_quality", "communication", "completeness", "overall"],
            },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            specific_feedback: { type: Type.STRING, description: "Direct, actionable feedback. Mention specific lines or logic." },
            improvement_areas: { type: Type.ARRAY, items: { type: Type.STRING } },
            would_hire: { type: Type.BOOLEAN },
            confidence: { type: Type.STRING, enum: ["high", "medium", "low"] },
          },
          required: ["scores", "strengths", "weaknesses", "specific_feedback", "improvement_areas", "would_hire", "confidence"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    return JSON.parse(text) as AnswerEvaluation;
  } catch (error) {
    console.error("Error evaluating answer:", error);
    return {
      scores: { correctness: 5, approach_quality: 5, code_quality: 5, communication: 5, completeness: 5, overall: 5 },
      strengths: ["Attempted the problem"],
      weaknesses: ["System error during evaluation"],
      specific_feedback: "We encountered a glitch processing your answer. However, simply attempting the problem is good practice. Please try again.",
      improvement_areas: ["Retry submission"],
      would_hire: false,
      confidence: "low"
    };
  }
};

export const analyzeWeaknesses = async (history: QuestionResult[]): Promise<WeaknessAnalysisResult> => {
  const systemInstruction = `
    You are a Lead Data Analyst for Engineering Hiring at Google.
    Analyze the candidate's entire interview session.
    
    GOAL: Create a "Precision Report" that identifies exactly why they passed or failed.
    
    RULES:
    1. Be Brutally Honest but Constructive.
    2. Cite specific evidence from their history (e.g., "In the Dynamic Programming question, you missed the memoization table").
    3. Identify "Gap Type": 
       - Knowledge (didn't know algorithm)
       - Application (knew algorithm but couldn't code it)
       - Communication (poor naming/comments).
    
    OUTPUT: Strictly valid JSON.
  `;

  const simpleHistory = history.map(h => ({
    topic: h.question.topic,
    difficulty: h.question.difficulty,
    score: h.evaluation.scores.overall,
    feedback_summary: h.evaluation.weaknesses.join(", ")
  }));

  const prompt = `
    Session History Data:
    ${JSON.stringify(simpleHistory)}

    Based on this, generate a comprehensive Weakness Analysis Report.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            weak_areas: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  area: { type: Type.STRING },
                  severity: { type: Type.STRING, enum: ["high", "medium", "low"] },
                  evidence: { type: Type.STRING, description: "Reference specific question/topic they failed." },
                  gap_type: { type: Type.STRING, enum: ["knowledge", "application", "communication"] },
                  impact: { type: Type.STRING, description: "Why this prevents hiring (e.g. 'Scalability risk')." },
                  priority: { type: Type.INTEGER }
                },
                required: ["area", "severity", "evidence", "gap_type", "impact", "priority"]
              }
            },
            strong_areas: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  action: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  estimated_time: { type: Type.STRING }
                },
                required: ["action", "reason", "estimated_time"]
              }
            },
            next_focus: { type: Type.STRING }
          },
          required: ["weak_areas", "strong_areas", "recommendations", "next_focus"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    return JSON.parse(text) as WeaknessAnalysisResult;
  } catch (error) {
    console.error("Error analyzing weaknesses:", error);
    throw new Error("Failed to analyze weaknesses.");
  }
};

export const generateStudyPlan = async (area: string, gapType: string): Promise<StudyPlan> => {
  const systemInstruction = `
    You are a personalized learning algorithm.
    Create a micro-study plan for "${area}".
    Focus on free, high-quality resources.
  `;

  const prompt = `Topic: ${area}, Gap: ${gapType}. Output JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            learning_path: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  step: { type: Type.INTEGER },
                  resource_type: { type: Type.STRING, enum: ["video", "article", "practice", "course"] },
                  title: { type: Type.STRING },
                  url: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  count: { type: Type.STRING },
                  why_recommended: { type: Type.STRING }
                },
                required: ["step", "resource_type", "title", "url", "why_recommended"]
              }
            },
            practice_problems: { type: Type.ARRAY, items: { type: Type.STRING } },
            estimated_mastery_time: { type: Type.STRING }
          },
          required: ["topic", "learning_path", "practice_problems", "estimated_mastery_time"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    return JSON.parse(text) as StudyPlan;
  } catch (error) {
    console.error("Error generating study plan:", error);
    throw new Error("Failed to generate study plan.");
  }
};

export const generateNextAdaptiveQuestion = async (
  history: QuestionResult[], 
  nextId: number, 
  analysis?: CandidateAnalysis, 
  weaknessAnalysis?: WeaknessAnalysisResult
): Promise<AdaptiveQuestionResponse> => {
  const systemInstruction = `
    You are an Adaptive Testing Engine.
    Generate the NEXT Question based on candidate performance.
    Adapt difficulty dynamically.
  `;
  
  const last3 = history.slice(-3);
  const scores = last3.map(h => h.evaluation.scores.overall);
  const prompt = `Scores: ${JSON.stringify(scores)}. Generate QID: ${nextId}.`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            next_question: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.INTEGER },
                question: { type: Type.STRING },
                difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
                topic: { type: Type.STRING },
                subtopic: { type: Type.STRING },
                time_limit_minutes: { type: Type.INTEGER },
                expected_approach: { type: Type.STRING },
                key_concepts: { type: Type.ARRAY, items: { type: Type.STRING } },
                hints: { type: Type.ARRAY, items: { type: Type.STRING } },
                follow_up: { type: Type.STRING }
              },
              required: ["id", "question", "difficulty", "topic", "subtopic", "time_limit_minutes", "expected_approach", "key_concepts", "hints"]
            },
            adaptation_applied: { type: Type.STRING, enum: ["Increased difficulty", "Maintained level", "Decreased difficulty"] },
            encouragement_message: { type: Type.STRING }
          },
          required: ["next_question", "adaptation_applied", "encouragement_message"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    return JSON.parse(text) as AdaptiveQuestionResponse;

  } catch (error) {
    console.error("Error generating adaptive question", error);
    throw new Error("Failed to generate adaptive question");
  }
};
