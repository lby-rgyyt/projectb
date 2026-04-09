import mongoose from "mongoose";
import dotenv from "dotenv";
import Employee from "./src/models/employee.model";
import OnboardingApplication from "./src/models/onboardingApplication.model";
import VisaStatus from "./src/models/visaStatus.model";
import RegistrationToken from "./src/models/registrationToken.model";

dotenv.config();

/*
 * ============ TEST ACCOUNTS (password: 123456) ============
 *
 * HR:
 *   hr1 / 123456          — HR admin, full access
 *
 * Employees (approved onboarding):
 *   john / 123456          — F1(CPT/OPT), visa in progress (optEAD, pendingSubmit)
 *   alice / 123456         — Citizen, no visa tracking
 *   david / 123456         — H1-B, visa completed
 *   emma / 123456          — Green Card, no visa tracking
 *   kevin / 123456         — F1(CPT/OPT), visa in progress (i983, pendingApprove)
 *   rachel / 123456        — F1(CPT/OPT), visa in progress (optReceipt, rejected)
 *
 * Employees (pending onboarding):
 *   mike / 123456          — submitted, waiting for HR review
 *   sophia / 123456        — submitted, waiting for HR review
 *
 * Employees (rejected onboarding):
 *   lisa / 123456          — rejected, needs to fix SSN
 *
 * Employees (no onboarding yet):
 *   tony / 123456          — just registered, hasn't submitted
 */

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI as string);
  console.log("Connected to MongoDB");

  await Employee.deleteMany({});
  await OnboardingApplication.deleteMany({});
  await VisaStatus.deleteMany({});
  await RegistrationToken.deleteMany({});

  // ========== HR ==========
  await Employee.create({
    username: "hr1",
    email: "hr1@test.com",
    password: "123456",
    role: "hr",
    firstName: "Admin",
    lastName: "HR",
  });

  // ========== john: approved, F1, visa optEAD pendingSubmit ==========
  const john = await Employee.create({
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
    workPhone: "123-456-7891",
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
      { firstName: "Jane", lastName: "Smith", phone: "987-654-3210", email: "jane@test.com", relationship: "Spouse" },
      { firstName: "Mark", lastName: "Smith", phone: "987-654-3211", email: "mark@test.com", relationship: "Brother" },
    ],
    reference: { firstName: "Bob", lastName: "Manager", phone: "555-555-5555", email: "bob@test.com", relationship: "Manager" },
  });
  const johnApp = await OnboardingApplication.create({ employeeId: john._id, status: "approved" });
  john.onboardingApplication = johnApp._id;
  const johnVs = await VisaStatus.create({ employeeId: john._id, currentStep: "optEAD", currentStatus: "pendingSubmit", inProgress: true });
  john.visaStatus = johnVs._id;
  await john.save();

  // ========== alice: approved, Citizen ==========
  const alice = await Employee.create({
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
    address: { streetName: "456 Oak Ave", city: "Los Angeles", state: "CA", zip: "90001" },
    emergencyContacts: [
      { firstName: "Tom", lastName: "Wang", phone: "555-999-8888", email: "tom@test.com", relationship: "Brother" },
    ],
    reference: { firstName: "Sarah", lastName: "Director", phone: "555-111-2222", email: "sarah@test.com", relationship: "Director" },
  });
  const aliceApp = await OnboardingApplication.create({ employeeId: alice._id, status: "approved" });
  alice.onboardingApplication = aliceApp._id;
  await alice.save();

  // ========== david: approved, H1-B, visa completed ==========
  const david = await Employee.create({
    username: "david",
    email: "david@test.com",
    password: "123456",
    role: "employee",
    firstName: "David",
    lastName: "Kim",
    ssn: "111-22-3333",
    dateOfBirth: new Date("1992-11-08"),
    gender: "Male",
    cellPhone: "555-222-3333",
    visaType: "H1-B",
    visaStartDate: new Date("2024-06-01"),
    visaEndDate: new Date("2027-06-01"),
    address: { building: "Suite 500", streetName: "789 Pine Rd", city: "Chicago", state: "IL", zip: "60601" },
    emergencyContacts: [
      { firstName: "Soo", lastName: "Kim", phone: "555-444-5555", email: "soo@test.com", relationship: "Spouse" },
    ],
    reference: { firstName: "James", lastName: "Lead", phone: "555-666-7777", email: "james@test.com", relationship: "Team Lead" },
  });
  const davidApp = await OnboardingApplication.create({ employeeId: david._id, status: "approved" });
  david.onboardingApplication = davidApp._id;
  await david.save();

  // ========== emma: approved, Green Card ==========
  const emma = await Employee.create({
    username: "emma",
    email: "emma@test.com",
    password: "123456",
    role: "employee",
    firstName: "Emma",
    lastName: "Garcia",
    ssn: "444-55-6666",
    dateOfBirth: new Date("1996-02-14"),
    gender: "Female",
    cellPhone: "555-888-9999",
    visaType: "Green Card",
    address: { streetName: "321 Elm St", city: "Houston", state: "TX", zip: "77001" },
    emergencyContacts: [
      { firstName: "Carlos", lastName: "Garcia", phone: "555-777-8888", email: "carlos@test.com", relationship: "Father" },
      { firstName: "Maria", lastName: "Garcia", phone: "555-777-8889", email: "maria@test.com", relationship: "Mother" },
    ],
    reference: { firstName: "Linda", lastName: "VP", phone: "555-333-4444", email: "linda@test.com", relationship: "VP of Engineering" },
  });
  const emmaApp = await OnboardingApplication.create({ employeeId: emma._id, status: "approved" });
  emma.onboardingApplication = emmaApp._id;
  await emma.save();

  // ========== kevin: approved, F1, visa i983 pendingApprove ==========
  const kevin = await Employee.create({
    username: "kevin",
    email: "kevin@test.com",
    password: "123456",
    role: "employee",
    firstName: "Kevin",
    lastName: "Zhang",
    ssn: "555-66-7777",
    dateOfBirth: new Date("1997-09-25"),
    gender: "Male",
    cellPhone: "555-111-0000",
    visaType: "F1(CPT/OPT)",
    visaStartDate: new Date("2025-03-01"),
    visaEndDate: new Date("2028-03-01"),
    address: { building: "Unit 3B", streetName: "100 University Ave", city: "San Jose", state: "CA", zip: "95112" },
    emergencyContacts: [
      { firstName: "Wei", lastName: "Zhang", phone: "555-222-0000", email: "wei@test.com", relationship: "Father" },
    ],
    reference: { firstName: "Amy", lastName: "Advisor", phone: "555-333-0000", email: "amy@test.com", relationship: "Academic Advisor" },
  });
  const kevinApp = await OnboardingApplication.create({ employeeId: kevin._id, status: "approved" });
  kevin.onboardingApplication = kevinApp._id;
  const kevinVs = await VisaStatus.create({ employeeId: kevin._id, currentStep: "i983", currentStatus: "pendingApprove", inProgress: true });
  kevin.visaStatus = kevinVs._id;
  await kevin.save();

  // ========== rachel: approved, F1, visa optReceipt rejected ==========
  const rachel = await Employee.create({
    username: "rachel",
    email: "rachel@test.com",
    password: "123456",
    role: "employee",
    firstName: "Rachel",
    lastName: "Lee",
    ssn: "666-77-8888",
    dateOfBirth: new Date("1999-04-12"),
    gender: "Female",
    cellPhone: "555-444-1111",
    visaType: "F1(CPT/OPT)",
    visaStartDate: new Date("2025-05-01"),
    visaEndDate: new Date("2028-05-01"),
    address: { streetName: "50 College Blvd", city: "Seattle", state: "WA", zip: "98101" },
    emergencyContacts: [
      { firstName: "Grace", lastName: "Lee", phone: "555-555-1111", email: "grace@test.com", relationship: "Sister" },
    ],
    reference: { firstName: "Peter", lastName: "Prof", phone: "555-666-1111", email: "peter@test.com", relationship: "Professor" },
  });
  const rachelApp = await OnboardingApplication.create({ employeeId: rachel._id, status: "approved" });
  rachel.onboardingApplication = rachelApp._id;
  const rachelVs = await VisaStatus.create({ employeeId: rachel._id, currentStep: "optReceipt", currentStatus: "rejected", inProgress: true, feedback: "Document is blurry, please upload a clearer copy." });
  rachel.visaStatus = rachelVs._id;
  await rachel.save();

  // ========== mike: pending onboarding ==========
  const mike = await Employee.create({
    username: "mike",
    email: "mike@test.com",
    password: "123456",
    role: "employee",
    firstName: "Mike",
    lastName: "Johnson",
    ssn: "222-33-4444",
    dateOfBirth: new Date("2000-01-10"),
    gender: "Male",
    cellPhone: "555-000-1111",
    visaType: "F1(CPT/OPT)",
    address: { streetName: "200 Broad St", city: "Boston", state: "MA", zip: "02101" },
    emergencyContacts: [
      { firstName: "Karen", lastName: "Johnson", phone: "555-000-2222", email: "karen@test.com", relationship: "Mother" },
    ],
    reference: { firstName: "Dan", lastName: "Mentor", phone: "555-000-3333", email: "dan@test.com", relationship: "Mentor" },
  });
  const mikeApp = await OnboardingApplication.create({ employeeId: mike._id, status: "pending" });
  mike.onboardingApplication = mikeApp._id;
  await mike.save();

  // ========== sophia: pending onboarding ==========
  const sophia = await Employee.create({
    username: "sophia",
    email: "sophia@test.com",
    password: "123456",
    role: "employee",
    firstName: "Sophia",
    lastName: "Brown",
    ssn: "333-44-5555",
    dateOfBirth: new Date("1999-06-30"),
    gender: "Female",
    cellPhone: "555-111-2222",
    visaType: "L2",
    visaStartDate: new Date("2025-02-01"),
    visaEndDate: new Date("2027-02-01"),
    address: { building: "Apt 7", streetName: "88 Market St", city: "San Francisco", state: "CA", zip: "94102" },
    emergencyContacts: [
      { firstName: "Jack", lastName: "Brown", phone: "555-111-3333", email: "jack@test.com", relationship: "Spouse" },
    ],
    reference: { firstName: "Nancy", lastName: "HR", phone: "555-111-4444", email: "nancy@test.com", relationship: "Former Manager" },
  });
  const sophiaApp = await OnboardingApplication.create({ employeeId: sophia._id, status: "pending" });
  sophia.onboardingApplication = sophiaApp._id;
  await sophia.save();

  // ========== lisa: rejected onboarding ==========
  const lisa = await Employee.create({
    username: "lisa",
    email: "lisa@test.com",
    password: "123456",
    role: "employee",
    firstName: "Lisa",
    lastName: "Chen",
    ssn: "999-88-7777",
    dateOfBirth: new Date("2001-12-05"),
    gender: "Female",
    cellPhone: "555-222-3333",
    visaType: "F1(CPT/OPT)",
    address: { streetName: "15 Park Ave", city: "Philadelphia", state: "PA", zip: "19101" },
    emergencyContacts: [
      { firstName: "Lily", lastName: "Chen", phone: "555-222-4444", email: "lily@test.com", relationship: "Sister" },
    ],
    reference: { firstName: "Steve", lastName: "Coach", phone: "555-222-5555", email: "steve@test.com", relationship: "Career Coach" },
  });
  const lisaApp = await OnboardingApplication.create({
    employeeId: lisa._id,
    status: "rejected",
    feedback: "SSN format is incorrect, please fix and resubmit.",
  });
  lisa.onboardingApplication = lisaApp._id;
  await lisa.save();

  // ========== tony: no onboarding yet ==========
  await Employee.create({
    username: "tony",
    email: "tony@test.com",
    password: "123456",
    role: "employee",
    firstName: "Tony",
    lastName: "Davis",
  });

  console.log("\n=== Seed Complete ===");
  console.log("See top of seed.ts for all accounts");

  await mongoose.disconnect();
};

seed().catch(console.error);
