import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import api from "../utils/api";
import { handleUpload } from "../utils/document";
import type { OnboardingApplication, Contact } from "../types";
import { useNavigate, useParams } from "react-router-dom";
import OnboardingStatusBanner from "../components/OnboardingStatusBanner";
import { handleError } from "../utils/error";
import { z } from "zod";
import {
  nameSchema,
  addressSchema,
  addressFields,
  contactSchema,
  referenceSchema,
  referenceFields,
  emergencyContactSchema,
  nameFields,
  contactFields,
} from "@/config/formConfig";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import FormSection from "@/components/sections/FormSection";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import EmergencyContactSection from "@/components/sections/EmergencyContactSection";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import DocumentsSection from "@/components/sections/DocumentsSection";
import FormInput from "@/components/form/FormInput";
import FormSelect from "@/components/form/FormSelect";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toast } from "sonner";

const onboardingSchema = z.object({
  ...nameSchema.shape,
  ...contactSchema.shape,
  ...addressSchema.shape,
  isUnlimited: z.string().min(1, "This field is required"),
  visaType: z.string().optional(),
  visaTitle: z.string().optional(),
  visaStartDate: z.string().optional(),
  visaEndDate: z.string().optional(),
  reference: z.object({ ...referenceSchema.shape }),
  emergencyContacts: z.array(emergencyContactSchema).min(1),
});

type OnboardingApplicationFormData = z.infer<typeof onboardingSchema>;

const OnboardingApplicationPage = () => {
  const navigate = useNavigate();
  // hr: /onboaring-application/:id
  // employee: /my-onboarding-application
  const { id } = useParams();
  // used for status management
  const [applicationData, setApplicationData] =
    useState<OnboardingApplication | null>(null);

  const [documents, setDocuments] = useState<Record<string, string>>({});

  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [loading, setLoading] = useState(true);
  const curEmp = useSelector((state: RootState) => state.auth.employee);

  const [redirectCountdown, setRedirectCountdown] = useState(5);

  // there is no id means it is not a hr, hr cannot edit
  const isOwner = !id;

  const form = useForm({
    resolver: zodResolver(onboardingSchema),
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

  const isUnlimited = form.watch("isUnlimited");
  const visaType = form.watch("visaType");

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
            setProfilePicture(emp.profilePicture || "");
            if (emp.documents) {
              setDocuments(emp.documents);
            }

            // set form data
            form.reset({
              firstName: emp.firstName || "",
              lastName: emp.lastName || "",
              middleName: emp.middleName || "",
              preferredName: emp.preferredName || "",
              cellPhone: emp.cellPhone || "",
              workPhone: emp.workPhone || "",
              ssn: emp.ssn || "",
              dateOfBirth: emp.dateOfBirth?.split("T")[0] || "",
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
              visaStartDate: emp.visaStartDate?.split("T")[0] || "",
              visaEndDate: emp.visaEndDate?.split("T")[0] || "",
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
          setProfilePicture(emp.profilePicture || "");
          if (emp.documents) {
            setDocuments(emp.documents);
          }
          // set form data
          form.reset({
            firstName: emp.firstName || "",
            lastName: emp.lastName || "",
            middleName: emp.middleName || "",
            preferredName: emp.preferredName || "",
            cellPhone: emp.cellPhone || "",
            workPhone: emp.workPhone || "",
            ssn: emp.ssn || "",
            dateOfBirth: emp.dateOfBirth?.split("T")[0] || "",
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
            visaStartDate: emp.visaStartDate?.split("T")[0] || "",
            visaEndDate: emp.visaEndDate?.split("T")[0] || "",
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
        handleError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isOwner, form, curEmp]);

  useEffect(() => {
    if (isOwner && applicationData?.status === "approved") {
      const timer = setInterval(() => {
        setRedirectCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isOwner, applicationData]);

  useEffect(() => {
    if (redirectCountdown <= 0) {
      navigate("/");
    }
  }, [redirectCountdown, navigate]);

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
      handleError(err);
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
      handleError(err);
      console.log(err);
    }
  };

  const onUpload = async (file: File, fileType: string) => {
    try {
      await handleUpload(file, fileType);
      toast.success("File uploaded successfully!");
    } catch (err) {
      handleError(err);
      console.log(err);
    }
  };

  const uploadPic = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.put("/api/employees/profile-picture", formData);
      setProfilePicture(res.data.filePath);
      toast.success("Profile picture uploaded!");
    } catch (err) {
      handleError(err);
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
          status: "pendingApprove",
          feedback: "",
        });
      }

      // re-fetch data to reload page
      const res = await api.get("/api/onboarding-applications/my-application");
      setApplicationData(res.data.onboardingApplication);
    } catch (err) {
      handleError(err);
    }
  };

  if (loading) return <p>Loading...</p>;

  if (isOwner && applicationData?.status === "approved") {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Application Approved!</CardTitle>
            <CardDescription>
              Your onboarding application has been approved. You now have full
              access to the portal.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Redirecting to homepage in {redirectCountdown} seconds...
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <section className="flex flex-col gap-6">
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

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-6"
        >
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {/* profile picture */}
              <fieldset className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={
                      profilePicture
                        ? `${import.meta.env.VITE_API_URL}/${profilePicture}`
                        : `${import.meta.env.VITE_API_URL}/public/avatars/default_avatar.png`
                    }
                    alt="avatar"
                  />
                  <AvatarFallback>N/A</AvatarFallback>
                </Avatar>
                {canEdit && (
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadPic(file);
                    }}
                  />
                )}
              </fieldset>

              {/* Email readonly */}
              <fieldset>
                <Label>Email</Label>
                <Input value={email} disabled />
              </fieldset>

              {/* name */}
              <FormSection
                form={form}
                fields={nameFields}
                disabled={disabled}
              />
              {/* contact */}
              <FormSection
                form={form}
                fields={contactFields}
                disabled={disabled}
              />
            </CardContent>
          </Card>

          {/* Address */}
          <Card>
            <CardHeader>
              <CardTitle>Address</CardTitle>
            </CardHeader>
            <CardContent>
              <FormSection
                form={form}
                fields={addressFields}
                disabled={disabled}
              />
            </CardContent>
          </Card>

          {/* Citizenship / Work Auth */}
          <Card>
            <CardHeader>
              <CardTitle>Citizenship / Work Authorization</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="isUnlimited"
                render={() => (
                  <FormItem>
                    <FormLabel>
                      Permanent resident or citizen of the U.S.? *
                    </FormLabel>
                    <FormControl>
                      <ToggleGroup
                        type="single"
                        value={form.watch("isUnlimited")}
                        onValueChange={(val) => {
                          if (!val) return;
                          form.setValue("isUnlimited", val);
                          form.setValue("visaType", "");
                          form.setValue("visaTitle", "");
                          form.setValue("visaStartDate", "");
                          form.setValue("visaEndDate", "");
                        }}
                        disabled={disabled}
                      >
                        <ToggleGroupItem value="yes">Yes</ToggleGroupItem>
                        <ToggleGroupItem value="no">No</ToggleGroupItem>
                      </ToggleGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isUnlimited === "yes" && (
                <FormSelect
                  form={form}
                  name="visaType"
                  label="Status *"
                  options={[
                    { value: "Green Card", label: "Green Card" },
                    { value: "Citizen", label: "Citizen" },
                  ]}
                  disabled={disabled}
                />
              )}

              {isUnlimited === "no" && (
                <FormSelect
                  form={form}
                  name="visaType"
                  label="Work Authorization Type *"
                  options={[
                    { value: "H1-B", label: "H1-B" },
                    { value: "L2", label: "L2" },
                    { value: "F1(CPT/OPT)", label: "F1(CPT/OPT)" },
                    { value: "H4", label: "H4" },
                    { value: "Other", label: "Other" },
                  ]}
                  disabled={disabled}
                />
              )}

              {visaType === "F1(CPT/OPT)" && canEdit && (
                <fieldset>
                  <Label>Upload OPT Receipt</Label>
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (!applicationData) {
                        await api.post("/api/visa-status/create");
                      }
                      await onUpload(file, "optReceipt");
                    }}
                  />
                </fieldset>
              )}

              {visaType === "Other" && (
                <FormInput
                  form={form}
                  name="visaTitle"
                  label="Visa Title *"
                  disabled={disabled}
                />
              )}

              {isUnlimited === "no" && (
                <fieldset className="grid gap-4 sm:grid-cols-2">
                  <FormInput
                    form={form}
                    name="visaStartDate"
                    label="Start Date *"
                    type="date"
                    disabled={disabled}
                  />
                  <FormInput
                    form={form}
                    name="visaEndDate"
                    label="End Date *"
                    type="date"
                    disabled={disabled}
                  />
                </fieldset>
              )}
            </CardContent>
          </Card>

          {/* Reference */}
          <Card>
            <CardHeader>
              <CardTitle>Reference</CardTitle>
            </CardHeader>
            <CardContent>
              <FormSection
                form={form}
                fields={referenceFields}
                namePrefix="reference"
                disabled={disabled}
              />
            </CardContent>
          </Card>

          {/* Emergency Contacts */}
          <Card>
            <CardHeader>
              <CardTitle>Emergency Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <EmergencyContactSection form={form} disabled={disabled} />
            </CardContent>
          </Card>

          {/* Submit */}
          {canEdit && (
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting
                ? "Submitting..."
                : "Submit Application"}
            </Button>
          )}
        </form>
      </Form>

      {/* Documents */}
      <DocumentsSection documents={documents} />

      {/* Upload  */}
      {canEdit && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Documents</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <fieldset>
              <Label>Driver's License</Label>
              <Input
                type="file"
                accept=".pdf,image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onUpload(file, "driverLicense");
                }}
              />
            </fieldset>
            <fieldset>
              <Label>Work Authorization Document</Label>
              <Input
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onUpload(file, "workAuthorization");
                }}
              />
            </fieldset>
          </CardContent>
        </Card>
      )}
    </section>
  );
};

export default OnboardingApplicationPage;
