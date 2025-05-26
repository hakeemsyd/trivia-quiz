export interface Question {
  id: string;
  text: string;
  choices: string[];
  answerIndex: number;
  category: string;
  difficulty: string;
}

import { Schema, model, Document } from 'mongoose';

export interface QuestionDoc extends Omit<Question, 'id'>, Document {}

const QuestionSchema = new Schema<QuestionDoc>(
  {
    text: { type: String, required: true },
    category: { type: String, required: true },
    difficulty: { type: String, required: true },
    choices: { type: [String], required: true },
    answerIndex: { type: Number, required: true },
  },
  { timestamps: true }
);

export const QuestionModel = model<QuestionDoc>('Question', QuestionSchema);
