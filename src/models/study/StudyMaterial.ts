import mongoose, { Schema, Document, model, models } from "mongoose";

export type MaterialType = "notes" | "question-paper" | "important-question" | "reference";

export interface IStudyMaterial extends Document {
  title: string;
  description?: string;
  chapterId: mongoose.Types.ObjectId;
  subjectId: mongoose.Types.ObjectId;
  semesterId: mongoose.Types.ObjectId;
  type: MaterialType;
  fileUrl: string;
  notebookLmUrl?: string;
  publicId?: string;
  thumbnail?: string;
  size?: number; // bytes
  pageCount?: number;
  year?: number; // for question papers e.g. 2025, 2024
  published: boolean;
  downloadCount: number;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const StudyMaterialSchema = new Schema<IStudyMaterial>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    chapterId: { type: Schema.Types.ObjectId, ref: "Chapter", required: true, index: true },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true, index: true },
    semesterId: { type: Schema.Types.ObjectId, ref: "Semester", required: true, index: true },
    type: {
      type: String,
      enum: ["notes", "question-paper", "important-question", "reference"],
      required: true,
      index: true,
    },
    fileUrl: { type: String, required: true },
    notebookLmUrl: { type: String, trim: true },
    publicId: { type: String },
    thumbnail: { type: String },
    size: { type: Number, default: 0 },
    pageCount: { type: Number, default: 1 },
    year: { type: Number },
    published: { type: Boolean, default: true },
    downloadCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const StudyMaterial = models.StudyMaterial || model<IStudyMaterial>("StudyMaterial", StudyMaterialSchema);
export default StudyMaterial;
