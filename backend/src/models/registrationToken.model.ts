import mongoose, { Schema, Document, Types } from "mongoose";

interface IRegistrationToken extends Document {
  email: string;
  name: string;
  token: string;
  link: string;
  status: "pending" | "registered" | "expired";
  createdBy: Types.ObjectId;
  createdAt: Date;
}

const registerTokenSchema = new Schema<IRegistrationToken>({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  token: { type: String, required: true },
  link: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "registered", "expired"],
    default: "pending",
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

registerTokenSchema.set("toJSON", { virtuals: true });

const RegisterToken = mongoose.model<IRegistrationToken>(
  "RegisterToken",
  registerTokenSchema,
);
export default RegisterToken;
