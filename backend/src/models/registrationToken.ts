import mongoose, { Schema,Document } from "mongoose";

interface IRegistrationToken extends Document {
  email: string;
  name: string;
  token: string;
  link: string;
  status: "pending" | "registered" | "expired";
  createdAt: Date;
}

const registerTokenSchema = new Schema<IRegistrationToken>({
  email: { type: String, required: true },
  name: { type: String, required: true },
  token: { type: String, required: true },
  link: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "registered", "expired"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const RegisterToken = mongoose.model<IRegistrationToken>(
  "RegisterToken",
  registerTokenSchema,
);
export default RegisterToken;
