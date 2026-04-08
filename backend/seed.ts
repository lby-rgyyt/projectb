import mongoose from "mongoose";
import dotenv from "dotenv";
import Employee from "./src/models/employee.model";
import OnboardingApplication from "./src/models/onboardingApplication.model";
import VisaStatus from "./src/models/visaStatus.model";
import RegistrationToken from "./src/models/registrationToken.model";

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI as string);
  console.log("Connected to MongoDB");

  // 清空旧数据
  await Employee.deleteMany({});
  await OnboardingApplication.deleteMany({});
  await VisaStatus.deleteMany({});
  await RegistrationToken.deleteMany({});

  // ========== HR 账号 ==========
  const hr = await Employee.create({
    username: "hr1",
    email: "hr1@test.com",
    password: "123456", // pre-save hook 会自动 hash
    role: "hr",
    firstName: "Admin",
    lastName: "HR",
  });

  // ========== 员工1: approved, F1 with visa status ==========
  const emp1 = await Employee.create({
    username: "john",
    email: "john@test.com",
    password: "123456",
    role: "employee",
    firstName: "John",
    lastName: "Smith",
    preferredName: "Johnny",
    ssn: "123-45-6789",
    dateOfBirth: new Date("1995-03-15"),
    gender: "Male",
    cellPhone: "123-456-7890",
    visaType: "F1(CPT/OPT)",
    visaStartDate: new Date("2025-01-01"),
    visaEndDate: new Date("2027-01-01"),
    address: {
      building: "Apt 101",
      streetName: "123 Main St",
      city: "New York",
      state: "NY",
      zip: "10001",
    },
    emergencyContacts: [
      {
        firstName: "Jane",
        lastName: "Smith",
        phone: "987-654-3210",
        email: "jane@test.com",
        relationship: "Spouse",
      },
    ],
    reference: {
      firstName: "Bob",
      lastName: "Manager",
      phone: "555-555-5555",
      email: "bob@test.com",
      relationship: "Manager",
    },
  });

  const app1 = await OnboardingApplication.create({
    employeeId: emp1._id,
    status: "approved",
  });
  emp1.onboardingApplication = app1._id;

  const vs1 = await VisaStatus.create({
    employeeId: emp1._id,
    currentStep: "optEAD",
    currentStatus: "pendingSubmit",
    inProgress: true,
  });
  emp1.visaStatus = vs1._id;
  await emp1.save();

  // ========== 员工2: approved, Citizen (no visa status) ==========
  const emp2 = await Employee.create({
    username: "alice",
    email: "alice@test.com",
    password: "123456",
    role: "employee",
    firstName: "Alice",
    lastName: "Wang",
    ssn: "987-65-4321",
    dateOfBirth: new Date("1998-07-20"),
    gender: "Female",
    cellPhone: "555-123-4567",
    visaType: "Citizen",
    address: {
      streetName: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      zip: "90001",
    },
    emergencyContacts: [
      {
        firstName: "Tom",
        lastName: "Wang",
        phone: "555-999-8888",
        email: "tom@test.com",
        relationship: "Brother",
      },
    ],
    reference: {
      firstName: "Sarah",
      lastName: "Director",
      phone: "555-111-2222",
      email: "sarah@test.com",
      relationship: "Director",
    },
  });

  const app2 = await OnboardingApplication.create({
    employeeId: emp2._id,
    status: "approved",
  });
  emp2.onboardingApplication = app2._id;
  await emp2.save();

  // ========== 员工3: pending onboarding ==========
  const emp3 = await Employee.create({
    username: "mike",
    email: "mike@test.com",
    password: "123456",
    role: "employee",
    firstName: "Mike",
    lastName: "Johnson",
  });

  const app3 = await OnboardingApplication.create({
    employeeId: emp3._id,
    status: "pending",
  });
  emp3.onboardingApplication = app3._id;
  await emp3.save();

  // ========== 员工4: rejected onboarding ==========
  const emp4 = await Employee.create({
    username: "lisa",
    email: "lisa@test.com",
    password: "123456",
    role: "employee",
    firstName: "Lisa",
    lastName: "Chen",
  });

  const app4 = await OnboardingApplication.create({
    employeeId: emp4._id,
    status: "rejected",
    feedback: "SSN format is incorrect, please fix and resubmit.",
  });
  emp4.onboardingApplication = app4._id;
  await emp4.save();

  console.log("\n=== Seed Complete ===");
  console.log("HR:        hr1 / 123456");
  console.log("Employee1: john / 123456  (approved, F1, visa in progress)");
  console.log("Employee2: alice / 123456 (approved, Citizen)");
  console.log("Employee3: mike / 123456  (pending onboarding)");
  console.log("Employee4: lisa / 123456  (rejected onboarding)");

  await mongoose.disconnect();
};

seed().catch(console.error);
