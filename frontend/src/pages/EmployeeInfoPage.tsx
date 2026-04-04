import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import type { Employee } from "../types";
import axios from "axios";
import NameSection from "../components/sections/NameSection";
import AddressSection from "../components/sections/AddressSection";
import ContactInfoSection from "../components/sections/ContactInfoSection";

const EmployeeInfoPage = () => {
  // hr
  const { id } = useParams();
  const currentEmployee = useSelector(
    (state: RootState) => state.auth.employee,
  );
  const token = useSelector((state: RootState) => state.auth.token);

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
          setEmployee(currentEmployee);
        } else {
          // hr
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/employees/${id}`,
            { headers: { Authorization: `Bearer ${token}` } },
          );
          setEmployee(res.data.employee);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [id, token, currentEmployee]);

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
    </div>
  );
};

export default EmployeeInfoPage;
