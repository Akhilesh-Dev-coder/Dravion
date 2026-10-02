import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IChapter extends Document {
  name: string;
  subjectId: mongoose.Types.ObjectId;
  description?: string;
  chapterNumber: number;
  slug: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ChapterSchema = new Schema<IChapter>(
  {
    name: { type: String, required: true, trim: true },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true, index: true },
    description: { type: String },
    chapterNumber: { type: Number, required: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ChapterSchema.index({ subjectId: 1, slug: 1 }, { unique: true });

const Chapter = models.Chapter || model<IChapter>("Chapter", ChapterSchema);
export default Chapter;
