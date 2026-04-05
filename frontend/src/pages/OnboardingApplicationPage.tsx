import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import api from "../utils/api";
import type { OnboardingApplication, Contact } from "../types";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import OnboardingStatusBanner from "../components/OnboardingStatusBanner";

interface OnboardingApplicationFormData {
  firstName: string;
  lastName: string;
  middleName?: string;
  preferredName?: string;
  profilePicture?: string;
  cellPhone: string;
  workPhone?: string;
  ssn: string;
  dateOfBirth: string;
  gender: string;
  address: {
    building?: string;
    streetName: string;
    city: string;
    state: string;
    zip: string;
  };
  isUnlimited: "yes" | "no" | "";
  visaType: string;
  visaTitle?: string;
  visaStartDate?: string;
  visaEndDate?: string;
  reference: {
    firstName: string;
    lastName: string;
    middleName?: string;
    phone: string;
    email: string;
    relationship: string;
  };
  emergencyContacts: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    relationship: string;
  }[];
}

const OnboardingApplicationPage = () => {
  // hr: /onboaring-application/:id
  // employee: /my-onboarding-application
  const { id } = useParams();
  // used for status management
  const [applicationData, setApplicationData] =
    useState<OnboardingApplication | null>(null);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const curEmp = useSelector((state: RootState) => state.auth.employee);

  // there is no id means it is not a hr, hr cannot edit
  const isOwner = !id;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingApplicationFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      middleName: "",
      preferredName: "",
      cellPhone: "",
      workPhone: "",
      ssn: "",
      dateOfBirth: "",
      gender: "",
      address: { building: "", streetName: "", city: "", state: "", zip: "" },
      isUnlimited: "",
      visaType: "",
      visaTitle: "",
      visaStartDate: "",
      visaEndDate: "",
      reference: {
        firstName: "",
        lastName: "",
        middleName: "",
        phone: "",
        email: "",
        relationship: "",
      },
      emergencyContacts: [
        { firstName: "", lastName: "", phone: "", email: "", relationship: "" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "emergencyContacts",
  });
  const isUnlimited = watch("isUnlimited");
  const visaType = watch("visaType");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isOwner) {
          // employee themselves
          const res = await api.get(
            "/api/onboarding-applications/my-application",
          );
          const app = res.data.onboardingApplication;
          // not the first time
          if (app) {
            // set status data
            setApplicationData(app);
            // emp here is a complete object
            const emp = app.employeeId;
            setEmail(emp.email || "");
            // set form data
            reset({
              firstName: emp.firstName || "",
              lastName: emp.lastName || "",
              middleName: emp.middleName || "",
              preferredName: emp.preferredName || "",
              cellPhone: emp.cellPhone || "",
              workPhone: emp.workPhone || "",
              ssn: emp.ssn || "",
              dateOfBirth: emp.dateOfBirth || "",
              gender: emp.gender || "",
              address: {
                building: emp.address?.building || "",
                streetName: emp.address?.streetName || "",
                city: emp.address?.city || "",
                state: emp.address?.state || "",
                zip: emp.address?.zip || "",
              },
              isUnlimited:
                emp.visaType === "Citizen" || emp.visaType === "Green Card"
                  ? "yes"
                  : emp.visaType
                    ? "no"
                    : "",
              visaType: emp.visaType || "",
              visaTitle: emp.visaTitle || "",
              visaStartDate: emp.visaStartDate || "",
              visaEndDate: emp.visaEndDate || "",
              reference: {
                firstName: emp.reference?.firstName || "",
                lastName: emp.reference?.lastName || "",
                middleName: emp.reference?.middleName || "",
                phone: emp.reference?.phone || "",
                email: emp.reference?.email || "",
                relationship: emp.reference?.relationship || "",
              },
              emergencyContacts: emp.emergencyContacts?.length
                ? emp.emergencyContacts.map((c: Contact) => ({
                    firstName: c.firstName || "",
                    lastName: c.lastName || "",
                    phone: c.phone || "",
                    email: c.email || "",
                    relationship: c.relationship || "",
                  }))
                : [
                    {
                      firstName: "",
                      lastName: "",
                      phone: "",
                      email: "",
                      relationship: "",
                    },
                  ],
            });
          }
          // first time, no existing onboarding application
          else {
            setEmail(curEmp?.email || "");
          }
        } else {
          // hr
          const res = await api.get(
            `/api/onboarding-applications/employee/${id}`,
          );
          const app = res.data.onboardingApplication;
          // set status data
          setApplicationData(app);
          const emp = app.employeeId;
          setEmail(emp.email || "");
          // set form data
          reset({
            firstName: emp.firstName || "",
            lastName: emp.lastName || "",
            middleName: emp.middleName || "",
            preferredName: emp.preferredName || "",
            cellPhone: emp.cellPhone || "",
            workPhone: emp.workPhone || "",
            ssn: emp.ssn || "",
            dateOfBirth: emp.dateOfBirth || "",
            gender: emp.gender || "",
            address: {
              building: emp.address?.building || "",
              streetName: emp.address?.streetName || "",
              city: emp.address?.city || "",
              state: emp.address?.state || "",
              zip: emp.address?.zip || "",
            },
            isUnlimited:
              emp.visaType === "Citizen" || emp.visaType === "Green Card"
                ? "yes"
                : emp.visaType
                  ? "no"
                  : "",
            visaType: emp.visaType || "",
            visaTitle: emp.visaTitle || "",
            visaStartDate: emp.visaStartDate || "",
            visaEndDate: emp.visaEndDate || "",
            reference: {
              firstName: emp.reference?.firstName || "",
              lastName: emp.reference?.lastName || "",
              middleName: emp.reference?.middleName || "",
              phone: emp.reference?.phone || "",
              email: emp.reference?.email || "",
              relationship: emp.reference?.relationship || "",
            },
            emergencyContacts: emp.emergencyContacts?.length
              ? emp.emergencyContacts.map((c: Contact) => ({
                  firstName: c.firstName || "",
                  lastName: c.lastName || "",
                  phone: c.phone || "",
                  email: c.email || "",
                  relationship: c.relationship || "",
                }))
              : [
                  {
                    firstName: "",
                    lastName: "",
                    phone: "",
                    email: "",
                    relationship: "",
                  },
                ],
          });
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isOwner, reset, curEmp]);

  const canEdit =
    isOwner && (!applicationData || applicationData.status === "rejected");
  const disabled = !canEdit;

  const handleApprove = async () => {
    if (!applicationData) return;
    try {
      await api.put(`/api/onboarding-applications/${applicationData.id}`, {
        status: "approved",
      });
      setApplicationData({ ...applicationData, status: "approved" });
    } catch (err) {
      console.log(err);
    }
  };
  const handleReject = async (feedback: string) => {
    if (!applicationData) return;
    try {
      await api.put(`/api/onboarding-applications/${applicationData.id}`, {
        status: "rejected",
        feedback,
      });
      setApplicationData({ ...applicationData, status: "rejected", feedback });
    } catch (err) {
      console.log(err);
    }
  };

  const onSubmit = async (data: OnboardingApplicationFormData) => {
    try {
      // update employee info
      await api.put("/api/employees/update", data);
      // create or update application status
      if (!applicationData) {
        // create
        await api.post("/api/onboarding-applications");
      } else {
        // update, clear feedback and update status
        await api.put(`/api/onboarding-applications/${applicationData.id}`, {
          status: "pending",
          feedback: "",
        });
      }

      // re-fetch data to reload page
      const res = await api.get("/api/onboarding-applications/my-application");
      setApplicationData(res.data.onboardingApplication);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        alert(error.response.data.message || "Submission failed");
      }
    }
  };

  // placeholder, need a real api to upload file
  const uploadPic = (file: File) => {
    console.log(file);
  };

  if (loading) return <p>Loading...</p>;
  if (isOwner && applicationData?.status === "approved") {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <h1>Onboarding Application</h1>
      {isOwner && (
        <p>Complete all required fields to submit your application</p>
      )}

      <OnboardingStatusBanner
        applicationData={applicationData}
        isOwner={isOwner}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/*Personal Information*/}
        <div>
          <h3>Personal Information</h3>

          <div>
            <label>First Name *</label>
            <input
              {...register("firstName", {
                required: "First name is required.",
              })}
              disabled={disabled}
            />
            {errors.firstName && <span>{errors.firstName.message}</span>}
          </div>

          <div>
            <label>Last Name *</label>
            <input
              {...register("lastName", { required: "Last name is required." })}
              disabled={disabled}
            />
            {errors.lastName && <span>{errors.lastName.message}</span>}
          </div>

          <div>
            <label>Middle Name</label>
            <input {...register("middleName")} disabled={disabled} />
          </div>

          <div>
            <label>Preferred Name</label>
            <input {...register("preferredName")} disabled={disabled} />
          </div>

          <div>
            <label>Profile Picture</label>
            <img src={"placeholder"} alt="avatar" />
            {canEdit && (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadPic(file);
                }}
              />
            )}
          </div>

          <div>
            <label>Email</label>
            <input value={email} disabled />
          </div>

          <div>
            <label>Cell Phone *</label>
            <input
              {...register("cellPhone", {
                required: "Cell phone is required.",
              })}
              disabled={disabled}
            />
            {errors.cellPhone && <span>{errors.cellPhone.message}</span>}
          </div>

          <div>
            <label>Work Phone</label>
            <input {...register("workPhone")} disabled={disabled} />
          </div>

          <div>
            <label>SSN *</label>
            <input
              {...register("ssn", { required: "SSN is required." })}
              disabled={disabled}
            />
            {errors.ssn && <span>{errors.ssn.message}</span>}
          </div>

          <div>
            <label>Date of Birth *</label>
            <input
              type="date"
              {...register("dateOfBirth", {
                required: "Date of birth is required.",
              })}
              disabled={disabled}
            />
            {errors.dateOfBirth && <span>{errors.dateOfBirth.message}</span>}
          </div>

          <div>
            <label>Gender *</label>
            <select
              {...register("gender", { required: "Gender is required." })}
              disabled={disabled}
            >
              <option value="">Select...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="I do not wish to answer">
                I do not wish to answer
              </option>
            </select>
            {errors.gender && <span>{errors.gender.message}</span>}
          </div>
        </div>

        {/*Address*/}
        <div>
          <h3>Address</h3>

          <div>
            <label>Building/Apt #</label>
            <input {...register("address.building")} disabled={disabled} />
          </div>

          <div>
            <label>Street Name *</label>
            <input
              {...register("address.streetName", {
                required: "Street name is required.",
              })}
              disabled={disabled}
            />
            {errors.address?.streetName && (
              <span>{errors.address.streetName.message}</span>
            )}
          </div>

          <div>
            <label>City *</label>
            <input
              {...register("address.city", { required: "City is required." })}
              disabled={disabled}
            />
            {errors.address?.city && <span>{errors.address.city.message}</span>}
          </div>

          <div>
            <label>State *</label>
            <input
              {...register("address.state", { required: "State is required." })}
              disabled={disabled}
            />
            {errors.address?.state && (
              <span>{errors.address.state.message}</span>
            )}
          </div>

          <div>
            <label>Zip *</label>
            <input
              {...register("address.zip", { required: "Zip is required." })}
              disabled={disabled}
            />
            {errors.address?.zip && <span>{errors.address.zip.message}</span>}
          </div>
        </div>

        {/*Citizenship / Work Authorization*/}
        <div>
          <h3>Citizenship / Work Authorization</h3>
          <div>
            <label>Permanent resident or citizen of the U.S.? *</label>
            <input
              type="hidden"
              {...register("isUnlimited", {
                required: "This field is required.",
              })}
            />

            <button
              type="button"
              onClick={() => {
                setValue("isUnlimited", "yes");
                setValue("visaType", "");
                setValue("visaTitle", "");
                setValue("visaStartDate", "");
                setValue("visaEndDate", "");
              }}
              disabled={disabled}
            >
              Yes
            </button>

            <button
              type="button"
              onClick={() => {
                setValue("isUnlimited", "no");
                setValue("visaType", "");
              }}
              disabled={disabled}
            >
              No
            </button>

            {errors.isUnlimited && <span>{errors.isUnlimited.message}</span>}
          </div>
          {/* option 1 */}
          {isUnlimited === "yes" && (
            <div>
              <label>Status *</label>
              <select
                {...register("visaType", {
                  required: "Work authorization is required.",
                })}
                disabled={disabled}
              >
                <option value="">Select...</option>
                <option value="Green Card">Green Card</option>
                <option value="Citizen">Citizen</option>
              </select>
              {errors.visaType && <span>{errors.visaType.message}</span>}
            </div>
          )}
          {isUnlimited === "no" && (
            <div>
              <label>Work Authorization Type *</label>
              <select
                {...register("visaType", {
                  required: "Work authorization is required.",
                })}
                disabled={disabled}
              >
                <option value="">Select...</option>
                <option value="H1-B">H1-B</option>
                <option value="L2">L2</option>
                <option value="F1(CPT/OPT)">F1(CPT/OPT)</option>
                <option value="H4">H4</option>
                <option value="Other">Other</option>
              </select>
              {errors.visaType && <span>{errors.visaType.message}</span>}
            </div>
          )}
          {/* placeholder: F1 employees need to upload file */}
          {visaType === "F1(CPT/OPT)" && (
            <div>
              <label>F1(CPT/OPT) — Upload OPT Receipt</label>
            </div>
          )}

          {/* custom title */}
          {visaType === "Other" && (
            <div>
              <label>Visa Title *</label>
              <input
                {...register("visaTitle", {
                  required: "Visa title is required.",
                })}
                disabled={disabled}
              />
              {errors.visaTitle && <span>{errors.visaTitle.message}</span>}
            </div>
          )}

          {/* visa date */}
          {isUnlimited === "no" && (
            <div>
              <div>
                <label>Start Date *</label>
                <input
                  type="date"
                  {...register("visaStartDate", {
                    required: "Visa start date is required.",
                  })}
                  disabled={disabled}
                />
                {errors.visaStartDate && (
                  <span>{errors.visaStartDate.message}</span>
                )}
              </div>
              <div>
                <label>End Date *</label>
                <input
                  type="date"
                  {...register("visaEndDate", {
                    required: "Visa end date is required.",
                  })}
                  disabled={disabled}
                />
                {errors.visaEndDate && (
                  <span>{errors.visaEndDate.message}</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/*Reference*/}
        <div>
          <h3>Reference</h3>

          <div>
            <label>First Name *</label>
            <input
              {...register("reference.firstName", {
                required: "First name is required.",
              })}
              disabled={disabled}
            />
            {errors.reference?.firstName && (
              <span>{errors.reference.firstName.message}</span>
            )}
          </div>

          <div>
            <label>Last Name *</label>
            <input
              {...register("reference.lastName", {
                required: "Last name is required.",
              })}
              disabled={disabled}
            />
            {errors.reference?.lastName && (
              <span>{errors.reference.lastName.message}</span>
            )}
          </div>

          <div>
            <label>Middle Name</label>
            <input {...register("reference.middleName")} disabled={disabled} />
          </div>

          <div>
            <label>Phone</label>
            <input {...register("reference.phone")} disabled={disabled} />
          </div>

          <div>
            <label>Email</label>
            <input {...register("reference.email")} disabled={disabled} />
          </div>

          <div>
            <label>Relationship *</label>
            <input
              {...register("reference.relationship", {
                required: "Relationship is required.",
              })}
              disabled={disabled}
            />
            {errors.reference?.relationship && (
              <span>{errors.reference.relationship.message}</span>
            )}
          </div>
        </div>

        {/*Emergency Contacts*/}
        <div>
          <h3>Emergency Contact(s)</h3>

          {fields.map((field, index) => (
            <div
              key={field.id}
              style={{
                marginBottom: 16,
                padding: 16,
                border: "1px solid #ccc",
                borderRadius: 8,
              }}
            >
              <p>Emergency Contact #{index + 1}</p>

              <div>
                <label>First Name *</label>
                <input
                  {...register(`emergencyContacts.${index}.firstName`, {
                    required: "First name is required.",
                  })}
                  disabled={disabled}
                />
                {errors.emergencyContacts?.[index]?.firstName && (
                  <span>
                    {errors.emergencyContacts[index].firstName.message}
                  </span>
                )}
              </div>

              <div>
                <label>Last Name *</label>
                <input
                  {...register(`emergencyContacts.${index}.lastName`, {
                    required: "Last name is required.",
                  })}
                  disabled={disabled}
                />
                {errors.emergencyContacts?.[index]?.lastName && (
                  <span>
                    {errors.emergencyContacts[index].lastName.message}
                  </span>
                )}
              </div>

              <div>
                <label>Phone *</label>
                <input
                  {...register(`emergencyContacts.${index}.phone`, {
                    required: "Phone is required.",
                  })}
                  disabled={disabled}
                />
                {errors.emergencyContacts?.[index]?.phone && (
                  <span>{errors.emergencyContacts[index].phone.message}</span>
                )}
              </div>

              <div>
                <label>Email</label>
                <input
                  {...register(`emergencyContacts.${index}.email`)}
                  disabled={disabled}
                />
              </div>

              <div>
                <label>Relationship *</label>
                <input
                  {...register(`emergencyContacts.${index}.relationship`, {
                    required: "Relationship is required.",
                  })}
                  disabled={disabled}
                />
                {errors.emergencyContacts?.[index]?.relationship && (
                  <span>
                    {errors.emergencyContacts[index].relationship.message}
                  </span>
                )}
              </div>

              {fields.length > 1 && !disabled && (
                <button type="button" onClick={() => remove(index)}>
                  Remove
                </button>
              )}
            </div>
          ))}

          {!disabled && (
            <button
              type="button"
              onClick={() =>
                append({
                  firstName: "",
                  lastName: "",
                  phone: "",
                  email: "",
                  relationship: "",
                })
              }
            >
              + Add Another Emergency Contact
            </button>
          )}
        </div>

        {/*Submit*/}
        {canEdit && (
          <div style={{ marginTop: 24 }}>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default OnboardingApplicationPage;
