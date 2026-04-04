export interface OnboardingApplication {
  _id: string;
  employeeId: string;
  status: "pending" | "approved" | "rejected";
  feedback?: string;
  documents?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}
export interface Employee {
  id: string;
  username: string;
  email: string;
  role: "employee" | "hr";
  firstName?: string;
  lastName?: string;
  middleName?: string;
  preferredName?: string;
  profilePicture?: string;
  ssn?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: {
    building?: string;
    streetName?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  visaType?:string;
  visaTitle?:string;
  visaStartDate?: string;
  visaEndDate?: string;
  cellPhone?: string;
  workPhone?: string;
  emergencyContacts?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    relationship?: string;
  }[];
  onboardingApplication: OnboardingApplication | null;
}

export interface AuthState {
  token: string | null;
  employee: Employee | null;
  loading: boolean;
}
