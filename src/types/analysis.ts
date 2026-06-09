export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string; // The correct option string
  explanation: string;
}

export interface AnalysisResult {
  diagramType: string;
  explanation: string;
  components: string[];
  summary: string;
  improvements: string[];
  questions: QuizQuestion[];
}

export interface AnalysisResponse {
  success: boolean;
  error?: string;
  data?: AnalysisResult;
  isMocked?: boolean;
}
