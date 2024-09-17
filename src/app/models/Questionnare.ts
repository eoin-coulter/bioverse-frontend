export interface Questionnaire{
    id: number;
    title:string;
}
export interface QuestionnaireQuestions extends Questionnaire {
    questions: Question[]
}




export interface Answer {
    id?:number
    question_id: number;
    answer: string | string[];  // Can be a string (for input) or array (for multiple-choice)
  }

  