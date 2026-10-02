import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IMCQ extends Document {
  question: string;
  options: string[];
  correctAnswer: number; // Index 0-3
  explanation?: string;
  subjectId: mongoose.Types.ObjectId;
  chapterId?: mongoose.Types.ObjectId;
  difficulty: "easy" | "medium" | "hard";
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MCQSchema = new Schema<IMCQ>(
  {
    question: { type: String, required: true, trim: true },
    options: { type: [String], required: true },
    correctAnswer: { type: Number, required: true },
    explanation: { type: String },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true, index: true },
    chapterId: { type: Schema.Types.ObjectId, ref: "Chapter", index: true },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const MCQ = models.MCQ || model<IMCQ>("MCQ", MCQSchema);
export default MCQ;
