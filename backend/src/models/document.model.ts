import mongoose, { Schema, Types } from "mongoose";

interface IDocument extends mongoose.Document {
  filePath: string;
  originalFileName: string;
  fileType:
    | "driverLicense"
    | "workAuthorization"
    | "optReceipt"
    | "optEAD"
    | "i983"
    | "i20";
  uploadedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const documentSchema = new Schema<IDocument>(
  {
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    fileType: {
      type: String,
      enum: [
        "driverLicense",
        "workAuthorization",
        "optReceipt",
        "optEAD",
        "i983",
        "i20",
      ],
      required: true,
    },
    filePath: { type: String, required: true },
    originalFileName: { type: String, required: true },
  },
  { timestamps: true },
);

documentSchema.set("toJSON", { virtuals: true });

const FileDocument = mongoose.model<IDocument>("Document", documentSchema);

export default FileDocument;
