import mongoose, { Schema, Types, Document } from "mongoose";
import bcrypt from "bcrypt";

interface IAddress {
  building?: string;
  streetName?: string;
  city?: string;
  state?: string;
  zip?: string;
}

interface IContact {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  phone?: string;
  email?: string;
  relationship?: string;
}

export interface IEmployee extends Document {
  username: string;
  email: string;
  password: string;
  role: "employee" | "hr";

  firstName?: string;
  lastName?: string;
  middleName?: string;
  preferredName?: string;
  profilePicture?: string;
  ssn?: string;
  dateOfBirth?: Date;
  gender?: "Male" | "Female" | "I do not wish to answer";
  visaType?:
    | "Citizen"
    | "Green Card"
    | "H1-B"
    | "L2"
    | "F1(CPT/OPT)"
    | "H4"
    | "Other";
  visaTitle?: string;
  visaStartDate?: Date;
  visaEndDate?: Date;
  address?: IAddress;
  cellPhone?: string;
  workPhone?: string;
  reference?: IContact;
  emergencyContacts?: IContact[];

  documents?: Map<string, Types.ObjectId>;
  onboardingApplication: Types.ObjectId | null;
  visaStatus: Types.ObjectId | null;
}

const addressSchema = new Schema<IAddress>(
  {
    building: String,
    streetName: String,
    city: String,
    state: String,
    zip: String,
  },
  { _id: false },
);

const contactSchema = new Schema<IContact>(
  {
    firstName: String,
    lastName: String,
    phone: String,
    email: String,
    relationship: String,
  },
  { _id: false },
);

const employeeSchema = new Schema<IEmployee>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["employee", "hr"],
      default: "employee",
    },

    firstName: String,
    lastName: String,
    middleName: String,
    preferredName: String,
    profilePicture: { type: String, default: "default_avatar.png" },
    ssn: String,
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ["Male", "Female", "I do not wish to answer"],
    },
    visaType: {
      type: String,
      enum: [
        "Citizen",
        "Green Card",
        "H1-B",
        "L2",
        "F1(CPT/OPT)",
        "H4",
        "Other",
      ],
    },
    visaTitle: String,
    visaStartDate: Date,
    visaEndDate: Date,
    address: { type: addressSchema, default: undefined },
    cellPhone: String,
    workPhone: String,
    reference: { type: contactSchema, default: undefined },
    emergencyContacts: { type: [contactSchema], default: [] },

    documents: {
      type: Map,
      of: { type: Schema.Types.ObjectId, ref: "Document" },
      default: new Map(),
    },
    onboardingApplication: {
      type: Schema.Types.ObjectId,
      ref: "OnboardingApplication",
      default: null,
    },
    visaStatus: {
      type: Schema.Types.ObjectId,
      ref: "VisaStatus",
      default: null,
    },
  },
  { timestamps: true },
);

employeeSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

employeeSchema.set("toJSON", { virtuals: true });

const Employee = mongoose.model<IEmployee>("Employee", employeeSchema);

export default Employee;
