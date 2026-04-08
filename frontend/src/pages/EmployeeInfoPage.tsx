import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import type { Employee } from "../types";
import api from "../utils/api";
import { handleError } from "../utils/error";
import NameSection from "../components/sections/NameSection";
import EditableSection from "../components/sections/EditableSection";
import EmergencyContactSection from "../components/sections/EmergencyContactSection";
import DocumentsSection from "../components/sections/DocumentsSection";
import {
  addressSchema,
  addressFields,
  contactSchema,
  contactFields,
  employmentSchema,
  employmentFields,
} from "../config/formConfig";
import { toast } from "sonner";

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
      <NameSection
        defaultValues={{
          firstName: employee.firstName || "",
          lastName: employee.lastName || "",
          middleName: employee.middleName || "",
          preferredName: employee.preferredName || "",
          ssn: employee.ssn || "",
          dateOfBirth: employee.dateOfBirth?.split("T")[0] || "",
          gender: employee.gender || "",
        }}
        email={employee.email}
        editable={editable}
        profilePicture={employee.profilePicture}
        onUploadPicture={onUploadPicture}
      />

      {/* Address */}
      <EditableSection
        title="Address"
        schema={addressSchema}
        fields={addressFields}
        defaultValues={{
          address: {
            building: employee.address?.building || "",
            streetName: employee.address?.streetName || "",
            city: employee.address?.city || "",
            state: employee.address?.state || "",
            zip: employee.address?.zip || "",
          },
        }}
        editable={editable}
      />

      {/* Contact Info */}
      <EditableSection
        title="Contact Info"
        schema={contactSchema}
        fields={contactFields}
        defaultValues={{
          cellPhone: employee.cellPhone || "",
          workPhone: employee.workPhone || "",
        }}
        editable={editable}
      />

      {/* Employment */}
      <EditableSection
        title="Employment"
        schema={employmentSchema}
        fields={employmentFields}
        defaultValues={{
          visaType: employee.visaType || "",
          visaTitle: employee.visaTitle || "",
          visaStartDate: employee.visaStartDate?.split("T")[0] || "",
          visaEndDate: employee.visaEndDate?.split("T")[0] || "",
        }}
        editable={editable}
      />

      <EmergencyContactSection
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
        editable={editable}
      />

      <DocumentsSection documents={employee.documents || {}} />
    </section>
  );
};

export default EmployeeInfoPage;
