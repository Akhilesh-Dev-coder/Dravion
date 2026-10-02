import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IDownload extends Document {
  userId?: string;
  materialId: mongoose.Types.ObjectId;
  ipAddress?: string;
  createdAt: Date;
}

const DownloadSchema = new Schema<IDownload>(
  {
    userId: { type: String, index: true },
    materialId: { type: Schema.Types.ObjectId, ref: "StudyMaterial", required: true, index: true },
    ipAddress: { type: String },
  },
  { timestamps: true }
);

const Download = models.Download || model<IDownload>("Download", DownloadSchema);
export default Download;
