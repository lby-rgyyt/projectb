import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import type { Employee } from "../types";
import api from "../utils/api";
import { handleError } from "../utils/error";
import EditableSection from "../components/sections/EditableSection";
import DocumentsSection from "../components/sections/DocumentsSection";
import {
  addressSchema,
  addressFields,
  contactSchema,
  contactFields,
  employmentSchema,
  employmentFields,
  emergencySectionSchema,
  nameSchema,
  nameFields,
} from "../config/formConfig";
import { toast } from "sonner";
import FormSection from "@/components/sections/FormSection";
import AdditionalNameSection from "@/components/sections/AdditionalNameSection";
import EmergencyContactFields from "@/components/sections/EmergencyContactSection";

const EmployeeInfoPage = () => {
  // hr: /employees/:id
  // employee: /personal-info
  const { id } = useParams();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  // there is no id means it is not a hr
  const isOwner = !id;
  const editable = isOwner;

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        if (isOwner) {
          // employee themselves
          const res = await api.get(`/api/auth/me`);
          setEmployee(res.data.employee);
        } else {
          // hr
          const res = await api.get(`/api/employees/${id}`);
          setEmployee(res.data.employee);
        }
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [id, isOwner]);

  const onUploadPicture = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.put("/api/employees/profile-picture", formData);
      setEmployee((prev) =>
        prev ? { ...prev, profilePicture: res.data.filePath } : prev,
      );
      toast.success("Profile picture uploaded!");
    } catch (err) {
      console.log(err);
      handleError(err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!employee) return <p>Employee not found</p>;

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">
        {isOwner
          ? "Personal Information"
          : `${employee.firstName} ${employee.lastName}`}
      </h1>

      {/* Name */}

      <EditableSection
        title="Name"
        schema={nameSchema}
        defaultValues={{
          firstName: employee.firstName || "",
          lastName: employee.lastName || "",
          middleName: employee.middleName || "",
          preferredName: employee.preferredName || "",
          ssn: employee.ssn || "",
          dateOfBirth: employee.dateOfBirth?.split("T")[0] || "",
          gender: employee.gender || "",
        }}
        renderContent={(form, disabled) => (
          <section className="flex flex-col gap-4">
            {/* email and profilePicture */}
            <AdditionalNameSection
              email={employee.email}
              profilePicture={employee.profilePicture}
              onUploadPicture={onUploadPicture}
              disabled={disabled}
            />
            <FormSection form={form} fields={nameFields} disabled={disabled} />
          </section>
        )}
        editable={editable}
      />

      {/* Address */}
      <EditableSection
        title="Address"
        schema={addressSchema}
        defaultValues={{
          address: {
            building: employee.address?.building || "",
            streetName: employee.address?.streetName || "",
            city: employee.address?.city || "",
            state: employee.address?.state || "",
            zip: employee.address?.zip || "",
          },
        }}
        renderContent={(form, disabled) => (
          <FormSection form={form} fields={addressFields} disabled={disabled} />
        )}
        editable={editable}
      />

      {/* Contact Info */}
      <EditableSection
        title="Contact Info"
        schema={contactSchema}
        defaultValues={{
          cellPhone: employee.cellPhone || "",
          workPhone: employee.workPhone || "",
        }}
        renderContent={(form, disabled) => (
          <FormSection form={form} fields={contactFields} disabled={disabled} />
        )}
        editable={editable}
      />

      {/* Employment */}
      <EditableSection
        title="Employment"
        schema={employmentSchema}
        defaultValues={{
          visaType: employee.visaType || "",
          visaTitle: employee.visaTitle || "",
          visaStartDate: employee.visaStartDate?.split("T")[0] || "",
          visaEndDate: employee.visaEndDate?.split("T")[0] || "",
        }}
        renderContent={(form, disabled) => (
          <FormSection
            form={form}
            fields={employmentFields}
            disabled={disabled}
          />
        )}
        editable={editable}
      />

      <EditableSection
        title="Emergency Contacts"
        schema={emergencySectionSchema}
        defaultValues={{
          emergencyContacts: employee.emergencyContacts?.length
            ? employee.emergencyContacts.map((c) => ({
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
        }}
        renderContent={(form, disabled) => (
          <EmergencyContactFields form={form} disabled={disabled} />
        )}
        editable={editable}
      />

      <DocumentsSection documents={employee.documents || {}} />
    </section>
  );
};

export default EmployeeInfoPage;
