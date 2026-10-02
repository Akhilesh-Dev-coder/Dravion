import mongoose, { Schema, Document, model, models } from "mongoose";

export interface ISemester extends Document {
  name: string; // e.g. "Semester 1", "Semester 4"
  number: number; // 1, 2, 3, 4, 5, 6
  description?: string;
  published: boolean;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const SemesterSchema = new Schema<ISemester>(
  {
    name: { type: String, required: true, trim: true },
    number: { type: Number, required: true, unique: true },
    description: { type: String },
    published: { type: Boolean, default: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  },
  { timestamps: true }
);

const Semester = models.Semester || model<ISemester>("Semester", SemesterSchema);
export default Semester;
