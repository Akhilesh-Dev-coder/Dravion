import mongoose, { Schema, Document, model, models } from "mongoose";

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId;
  plan: "free" | "pro" | "business";
  status: "active" | "inactive" | "trial";
  razorpayCustomerId?: string;
  razorpaySubscriptionId?: string;
  startedAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    plan: { type: String, enum: ["free", "pro", "business"], default: "free", required: true },
    status: { type: String, enum: ["active", "inactive", "trial"], default: "active", required: true },
    razorpayCustomerId: { type: String },
    razorpaySubscriptionId: { type: String },
    startedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

const Subscription = models.Subscription || model<ISubscription>("Subscription", SubscriptionSchema);
export default Subscription;
