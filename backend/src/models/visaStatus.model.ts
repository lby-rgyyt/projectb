import mongoose, { Schema, Types, Document } from "mongoose";

interface IVisaStatus extends Document {
  employeeId: Types.ObjectId;
  currentStep: "optReceipt" | "optEAD" | "i983" | "i20" | "completed";
  currentStatus: "pendingSubmit" | "pendingApprove" | "approved" | "rejected";
  feedback?: string;
  documents?: Map<string, Types.ObjectId>;
  inProgress: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const visaStatusSchema = new Schema<IVisaStatus>(
  {
    employeeId: {
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
      enum: ["pendingSubmit","pendingApprove", "approved", "rejected"],
      default: "pendingSubmit",
    },
    feedback: String,
    documents: {
      type: Map,
      of: { type: Schema.Types.ObjectId, ref: "Document" },
      default: new Map(),
    },
    inProgress: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const VisaStatus = mongoose.model<IVisaStatus>("VisaStatus", visaStatusSchema);
export default VisaStatus;
