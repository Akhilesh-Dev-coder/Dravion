import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IQuestion extends Document {
  question: string;
  answer?: string;
  subjectId: mongoose.Types.ObjectId;
  chapterId?: mongoose.Types.ObjectId;
  marks?: number; // e.g. 5, 10
  year?: number; // e.g. 2025
  isImportant: boolean;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true, index: true },
    chapterId: { type: Schema.Types.ObjectId, ref: "Chapter", index: true },
    marks: { type: Number, default: 5 },
    year: { type: Number },
    isImportant: { type: Boolean, default: true },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Question = models.Question || model<IQuestion>("Question", QuestionSchema);
export default Question;
