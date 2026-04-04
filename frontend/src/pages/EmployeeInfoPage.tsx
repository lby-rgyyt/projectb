import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import type { Employee } from "../types";
import api from "../utils/api";
import NameSection from "../components/sections/NameSection";
import AddressSection from "../components/sections/AddressSection";
import ContactInfoSection from "../components/sections/ContactInfoSection";
import EmploymentSection from "../components/sections/EmploymentSection";
import EmergencyContactSection from "../components/sections/EmergencyContactSection";
import DocumentsSection from "../components/sections/DocumentsSection";

const EmployeeInfoPage = () => {
  // hr: /employees/:id
  // employee: /personal-info
  const { id } = useParams();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  // placeholder, will need a real api to fetch all documents
  const documents = [{ name: "", url: "" }];

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
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [id, isOwner]);

  // need a real backend api
  const onUploadPicture = (file: File) => {
    console.log(file);
  };

  if (loading) return <p>Loading...</p>;
  if (!employee) return <p>Employee not found</p>;

  return (
    <div>
      <h1>
        {isOwner
          ? "Personal Information"
          : `${employee.firstName} ${employee.lastName}`}
      </h1>

      <NameSection
        defaultValues={{
          firstName: employee.firstName || "",
          lastName: employee.lastName || "",
          middleName: employee.middleName || "",
          preferredName: employee.preferredName || "",
          ssn: employee.ssn || "",
          dateOfBirth: employee.dateOfBirth || "",
          gender: employee.gender || "",
        }}
        email={employee.email}
        editable={editable}
        profilePicture={employee.profilePicture}
        onUploadPicture={onUploadPicture}
      />

      <AddressSection
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

      <ContactInfoSection
        defaultValues={{
          cellPhone: employee.cellPhone || "",
          workPhone: employee.workPhone || "",
        }}
        editable={editable}
      />

      <EmploymentSection
        defaultValues={{
          visaType: employee.visaType || "",
          visaTitle: employee.visaTitle || "",
          visaStartDate: employee.visaStartDate || "",
          visaEndDate: employee.visaEndDate || "",
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

      <DocumentsSection documents={documents} />
    </div>
  );
};

export default EmployeeInfoPage;
