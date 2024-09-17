export interface Question {
    id: number;
    data: {
      type: 'mcq' | 'input';
      question: string;
      options?: string[];
    };
  }
export interface QuestionInfo {
    question_id: string,
    user_answer: string
}