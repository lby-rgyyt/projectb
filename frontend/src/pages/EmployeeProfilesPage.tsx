import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import type { Employee } from "../types";
import { handleError } from "../utils/error";

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
      } catch (err) {
        handleError(err);
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
                <tr key={employee.id}>
                  <td>
                    <Link to={`/employees/${employee.id}`} target="_blank">
                      {`${employee.lastName || ""}, ${employee.firstName || ""}`}
                    </Link>
                  </td>
                  <td>{maskSSN(employee.ssn || "")}</td>
                  <td>
                    {employee.visaType
                      ? employee.visaType
                      : employee.visaTitle || ""}
                  </td>
                  <td>{employee.cellPhone || "N/A"}</td>
                  <td>{employee.email}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default EmployeeProfiles;
