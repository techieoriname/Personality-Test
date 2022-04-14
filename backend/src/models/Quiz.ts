import { Schema, model, Document } from "mongoose";

type QuizOptions = {
    points: number;
    answer: string;
};

// 1. Create an interface representing a document in MongoDB.
export interface IQuiz extends Document {
    question: string;
    options: QuizOptions[];
}

// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema(
    {
        question: { type: String, required: true },
        options: [
            {
                _id: false,
                points: { type: Number, required: true },
                answer: { type: String, required: true }
            }
        ]
    },
    { timestamps: true }
);

// 3. Create a Model.
const User = model<IQuiz>("Quiz", userSchema);

export default User;
