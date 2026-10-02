import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IBookmark extends Document {
  userId?: string; // NextAuth user ID or guest identifier
  targetId: mongoose.Types.ObjectId; // StudyMaterial, Subject, Chapter, or Question ID
  targetType: "material" | "subject" | "chapter" | "question";
  createdAt: Date;
}

const BookmarkSchema = new Schema<IBookmark>(
  {
    userId: { type: String, required: true, index: true },
    targetId: { type: Schema.Types.ObjectId, required: true, index: true },
    targetType: {
      type: String,
      enum: ["material", "subject", "chapter", "question"],
      required: true,
    },
  },
  { timestamps: true }
);

BookmarkSchema.index({ userId: 1, targetId: 1, targetType: 1 }, { unique: true });

const Bookmark = models.Bookmark || model<IBookmark>("Bookmark", BookmarkSchema);
export default Bookmark;
