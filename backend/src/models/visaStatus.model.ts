import mongoose, { Schema, Types, Document } from "mongoose";

interface IVisaStatus extends Document {
  employee: Types.ObjectId;
  currentStep: "optReceipt" | "optEAD" | "i983" | "i20" | "completed";
  currentStatus: "pending" | "approved" | "rejected";
  feedback?: string;
  documents?: Map<string, Types.ObjectId>;
  createdAt: Date;
  updatedAt: Date;
}

const visaStatusSchema = new Schema<IVisaStatus>(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    currentStep: {
      type: String,
      enum: ["optReceipt", "optEAD", "i983", "i20", "completed"],
      default: "optReceipt",
    },
    currentStatus: {
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

const VisaStatus = mongoose.model<IVisaStatus>("VisaStatus", visaStatusSchema);
export default VisaStatus;
