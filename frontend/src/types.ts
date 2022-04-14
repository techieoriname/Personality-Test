type QuizOptions = {
    points: number;
    answer: string;
};

export type QuizType = {
    _id: string;
    question: string;
    options: QuizOptions[];
};
