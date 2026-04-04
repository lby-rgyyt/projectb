import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import axios from "axios";
import type { Employee } from "../types";

interface EmployeeItemPrors {
  id: string;
  name: string;
  SSN: string;
  workAuth: string;
  phone: string;
  email: string;
}

const EmployeeProfiles = () => {
  const [name, setName] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get(`/api/employees/search`, {
          params: { name: name },
        });
        setEmployees(res.data.employees);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          alert(error.response.data.error);
        }
      }
    };
    fetchEmployees();
  }, [name]);

  const maskSSN = (ssn: string) => {
    const last4 = ssn.slice(-4);
    return `***-**-${last4}`;
  };

  return (
    <>
      <h1>Employee Profiles</h1>
      <p>{employees.length} employees(sort by last name) </p>
      <input
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
        placeholder="Search by first name, last name or preferred name..."
      />
      <div>
        <table>
          <thead>
            <tr>
              <th>NAME</th>
              <th>SSN</th>
              <th>WORK AUTH</th>
              <th>PHONE</th>
              <th>EMAIL</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => {
              return (
                <EmployeeItem
                  key={employee.id}
                  id={employee.id}
                  name={`${employee.lastName || ""}, ${employee.firstName || ""}`}
                  SSN={maskSSN(employee.ssn || "")}
                  workAuth={
                    employee.visaType
                      ? employee.visaType
                      : employee.visaTitle || ""
                  }
                  phone={employee.cellPhone || "N/A"}
                  email={employee.email}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

const EmployeeItem = ({
  id,
  name,
  SSN,
  workAuth,
  phone,
  email,
}: EmployeeItemPrors) => {
  return (
    <tr>
      <td>
        <Link to={`/employees/${id}`} target="_blank">
          {name}
        </Link>
      </td>
      <td>{SSN}</td>
      <td>{workAuth}</td>
      <td>{phone}</td>
      <td>{email}</td>
    </tr>
  );
};

export default EmployeeProfiles;
