import { useEffect, useState } from "react";
import type { Employee, VisaStatus } from "../types";
import api from "../utils/api";

const getDaysLeft = (endDate?: string): number | string => {
  if (!endDate) return "N/A";
  return Math.ceil(
    (new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
};

const VisaStatusManagementPage = () => {
  const [activeTab, setActiveTab] = useState("inProgress");
  const [visaStatuses, setVisaStatuses] = useState<VisaStatus[]>([]);
  const [search, setSearch] = useState("");

  const filteredVisaStatuses = visaStatuses.filter((vs) => {
    const emp = vs.employeeId as Employee;
    const name =
      `${emp.firstName || ""} ${emp.lastName || ""} ${emp.preferredName || ""}`.toLowerCase();
    return name.includes(search.toLowerCase());
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === "inProgress") {
          const res = await api.get("/api/visa-status/in-progress");
          setVisaStatuses(res.data.visaStatuses);
        } else {
          const res = await api.get("/api/visa-status/all");
          setVisaStatuses(res.data.visaStatuses);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [activeTab]);

  return (
    <>
      <div>
        <button
          type="button"
          onClick={() => {
            setActiveTab("inProgress");
          }}
        >
          In Progress
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("all");
          }}
        >
          All
        </button>
      </div>
      {activeTab === "inProgress" && (
        <div>
          <table>
            <thead>
              <tr>
                <th>EMPLOYEE</th>
                <th>WORK AUTH</th>
                <th>START</th>
                <th>END</th>
                <th>DAYS LEFT</th>
                <th>NEXT STEP</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {visaStatuses.map((vs) => {
                const emp = vs.employeeId as Employee;
                const daysLeft = getDaysLeft(emp.visaEndDate);
                return (
                  <tr key={vs.id}>
                    <td>
                      {(emp.firstName || "") + " " + (emp.lastName || "")}
                    </td>
                    <td>{emp.visaType || ""}</td>
                    <td>{emp.visaStartDate || ""}</td>
                    <td>{emp.visaEndDate || ""}</td>
                    <td>{daysLeft}</td>
                    <td>{/* next step */}</td>
                    <td>{/* action */}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {activeTab === "all" && (
        <div>
          <p>{filteredVisaStatuses.length} employees(sort by last name) </p>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by employee name..."
          />
          <table>
            <thead>
              <tr>
                <th>EMPLOYEE</th>
                <th>WORK AUTH</th>
                <th>START</th>
                <th>END</th>
                <th>DAYS LEFT</th>
                <th>DOCUMENTS</th>
              </tr>
            </thead>
            <tbody>
              {filteredVisaStatuses.map((vs) => {
                const emp = vs.employeeId as Employee;
                const daysLeft = getDaysLeft(emp.visaEndDate);
                return (
                  <tr key={vs.id}>
                    <td>
                      {(emp.firstName || "") + " " + (emp.lastName || "")}
                    </td>
                    <td>{emp.visaType || ""}</td>
                    <td>{emp.visaStartDate || ""}</td>
                    <td>{emp.visaEndDate || ""}</td>
                    <td>{daysLeft}</td>
                    <td>{/* documents */}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default VisaStatusManagementPage;
