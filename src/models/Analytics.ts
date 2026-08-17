import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IAnalytics extends Document {
  cardId: mongoose.Types.ObjectId;
  eventType: "view" | "qr_scan" | "whatsapp" | "phone" | "email" | "website" | "social_click";
  timestamp: Date;
  metadata?: Record<string, any>;
}

const AnalyticsSchema = new Schema<IAnalytics>(
  {
    cardId: { type: Schema.Types.ObjectId, ref: "Card", required: true, index: true },
    eventType: { 
      type: String, 
      required: true, 
      enum: ["view", "qr_scan", "whatsapp", "phone", "email", "website", "social_click"],
      index: true
    },
    timestamp: { type: Date, default: Date.now, index: true },
    metadata: { type: Schema.Types.Mixed },
  }
);

// Compound index to speed up filtering logs by card and event type
AnalyticsSchema.index({ cardId: 1, eventType: 1, timestamp: -1 });

const Analytics = models.Analytics || model<IAnalytics>("Analytics", AnalyticsSchema);
export default Analytics;
