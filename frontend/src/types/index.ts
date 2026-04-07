export interface VisaStatus {
  id: string;
  employeeId: string | Employee;
  currentStep: "optReceipt" | "optEAD" | "i983" | "i20" | "completed";
  currentStatus: "pendingSubmit" | "pendingApprove" | "approved" | "rejected";
  feedback?: string;
  inProgress: boolean;
  documents?: Record<string, string>;
}

export interface OnboardingApplication {
  id: string;
  employeeId: string | Employee;
  status: "pending" | "approved" | "rejected";
  feedback?: string;
  documents?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  relationship?: string;
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
  visaType?: string;
  visaTitle?: string;
  visaStartDate?: string;
  visaEndDate?: string;
  cellPhone?: string;
  workPhone?: string;
  reference?: {
    firstName?: string;
    lastName?: string;
    middleName?: string;
    phone?: string;
    email?: string;
    relationship?: string;
  };
  emergencyContacts?: Contact[];
  onboardingApplication: OnboardingApplication | null;
  documents?: Record<string, string>;
}

export interface RegistrationToken {
  id: string;
  email: string;
  name: string;
  token: string;
  link: string;
  status: "pending" | "registered" | "expired";
}

export interface AuthState {
  token: string | null;
  employee: Employee | null;
  loading: boolean;
}
