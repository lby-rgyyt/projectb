import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import type { Employee } from "../types";
import { handleError } from "../utils/error";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";

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
    <section className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold">Employee Profiles</h1>
        <p className="text-sm text-muted-foreground">
          {employees.length} employees (sorted by last name)
        </p>
      </header>

      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Search by first name, last name or preferred name..."
      />

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>SSN</TableHead>
                <TableHead>Work Auth</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <Link
                      to={`/employees/${employee.id}`}
                      target="_blank"
                      className="text-primary underline"
                    >
                      {`${employee.lastName || ""}, ${employee.firstName || ""}`}
                    </Link>
                  </TableCell>
                  <TableCell>{maskSSN(employee.ssn || "")}</TableCell>
                  <TableCell>
                    {employee.visaType || employee.visaTitle || ""}
                  </TableCell>
                  <TableCell>{employee.cellPhone || "N/A"}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
};

export default EmployeeProfiles;
