interface Question {
    id: number;
    data: {
      type: 'mcq' | 'input';
      question: string;
      options?: string[];
    };
  }