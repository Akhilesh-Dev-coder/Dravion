import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IProgress extends Document {
  userId: string;
  materialId: mongoose.Types.ObjectId;
  subjectId?: mongoose.Types.ObjectId;
  chapterId?: mongoose.Types.ObjectId;
  lastPage: number;
  completed: boolean;
  lastOpenedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProgressSchema = new Schema<IProgress>(
  {
    userId: { type: String, required: true, index: true },
    materialId: { type: Schema.Types.ObjectId, ref: "StudyMaterial", required: true, index: true },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject" },
    chapterId: { type: Schema.Types.ObjectId, ref: "Chapter" },
    lastPage: { type: Number, default: 1 },
    completed: { type: Boolean, default: false },
    lastOpenedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

ProgressSchema.index({ userId: 1, materialId: 1 }, { unique: true });

const Progress = models.Progress || model<IProgress>("Progress", ProgressSchema);
export default Progress;
