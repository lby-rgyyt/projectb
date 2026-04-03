export interface OnboardingApplication {
  _id: string;
  employeeId: string;
  status: "pending" | "approved" | "rejected";
  feedback?: string;
  documents?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  token: string | null;
  employee: {
    id: string;
    username: string;
    email: string;
    role: "employee" | "hr";
    onboardingApplication: OnboardingApplication | null;
  } | null;
  loading: boolean;
}
