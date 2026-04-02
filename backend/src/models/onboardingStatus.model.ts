import mongoose, { Schema, Types, Document } from "mongoose";

interface IOnboardingApplication extends Document {
  employee: Types.ObjectId;
  status: "pending" | "approved" | "rejected";
  feedback?: string;
  documents?: Map<string, Types.ObjectId>;
  createdAt: Date;
  updatedAt: Date;
}

const onboardingApplicationSchema = new Schema<IOnboardingApplication>(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    feedback: String,
    documents: {
      type: Map,
      of: { type: Schema.Types.ObjectId, ref: "Document" },
      default: new Map(),
    },
  },
  { timestamps: true },
);

const OnboardingApplication = mongoose.model<IOnboardingApplication>(
  "OnboardingApplication",
  onboardingApplicationSchema,
);
export default OnboardingApplication;
