import { z } from "zod";

export interface FieldConfig {
  name: string;
  label: string;
  type?: "text" | "date" | "select";
  options?: { value: string; label: string }[];
}

// Name
export const nameSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  middleName: z.string().optional(),
  preferredName: z.string().optional(),
  ssn: z.string().min(1, "SSN is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
});

export const nameFields: FieldConfig[] = [
  { name: "firstName", label: "First Name" },
  { name: "lastName", label: "Last Name" },
  { name: "middleName", label: "Middle Name" },
  { name: "preferredName", label: "Preferred Name" },
  { name: "ssn", label: "SSN" },
  { name: "dateOfBirth", label: "Date of Birth", type: "date" },
  {
    name: "gender",
    label: "Gender",
    type: "select",
    options: [
      { value: "Male", label: "Male" },
      { value: "Female", label: "Female" },
      { value: "I do not wish to answer", label: "I do not wish to answer" },
    ],
  },
];

// Address
export const addressSchema = z.object({
  address: z.object({
    building: z.string().optional(),
    streetName: z.string().min(1, "Street name is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zip: z.string().min(1, "Zip is required"),
  }),
});

export const addressFields: FieldConfig[] = [
  { name: "address.building", label: "Building/Apt #" },
  { name: "address.streetName", label: "Street Name" },
  { name: "address.city", label: "City" },
  { name: "address.state", label: "State" },
  { name: "address.zip", label: "Zip" },
];

// Contact
export const contactSchema = z.object({
  cellPhone: z.string().min(1, "Cell phone is required"),
  workPhone: z.string().optional(),
});

export const contactFields: FieldConfig[] = [
  { name: "cellPhone", label: "Cell Phone" },
  { name: "workPhone", label: "Work Phone" },
];

// Employment
export const employmentSchema = z.object({
  visaType: z.string().min(1, "Visa type is required"),
  visaTitle: z.string().optional(),
  visaStartDate: z.string().optional(),
  visaEndDate: z.string().optional(),
});

export const employmentFields: FieldConfig[] = [
  {
    name: "visaType",
    label: "Visa Type",
    type: "select",
    options: [
      { value: "Citizen", label: "Citizen" },
      { value: "Green Card", label: "Green Card" },
      { value: "H1-B", label: "H1-B" },
      { value: "L2", label: "L2" },
      { value: "F1(CPT/OPT)", label: "F1(CPT/OPT)" },
      { value: "H4", label: "H4" },
      { value: "Other", label: "Other" },
    ],
  },
  { name: "visaTitle", label: "Visa Title" },
  { name: "visaStartDate", label: "Start Date", type: "date" },
  { name: "visaEndDate", label: "End Date", type: "date" },
];

export const referenceSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  middleName: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  relationship: z.string().min(1, "Relationship is required"),
});

export const referenceFields: FieldConfig[] = [
  { name: "firstName", label: "First Name" },
  { name: "lastName", label: "Last Name" },
  { name: "middleName", label: "Middle Name" },
  { name: "phone", label: "Phone" },
  { name: "email", label: "Email" },
  { name: "relationship", label: "Relationship" },
];

export const emergencyContactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().optional(),
  relationship: z.string().min(1, "Relationship is required"),
});

export const emergencyContactFields: FieldConfig[] = [
  { name: "firstName", label: "First Name" },
  { name: "lastName", label: "Last Name" },
  { name: "phone", label: "Phone" },
  { name: "email", label: "Email" },
  { name: "relationship", label: "Relationship" },
];
