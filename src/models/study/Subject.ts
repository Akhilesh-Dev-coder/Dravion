import mongoose, { Schema, Document, model, models } from "mongoose";

export interface ISubject extends Document {
  name: string;
  code: string; // e.g. "CS401"
  semesterId: mongoose.Types.ObjectId;
  description?: string;
  thumbnail?: string;
  slug: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SubjectSchema = new Schema<ISubject>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true, uppercase: true },
    semesterId: { type: Schema.Types.ObjectId, ref: "Semester", required: true, index: true },
    description: { type: String },
    thumbnail: { type: String },
    slug: { type: String, required: true, lowercase: true, trim: true },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

SubjectSchema.index({ semesterId: 1, slug: 1 }, { unique: true });

const Subject = models.Subject || model<ISubject>("Subject", SubjectSchema);
export default Subject;
