import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import type { Employee, OnboardingApplication } from "../types";

const OnboardingReview = () => {
  const [activeTab, setActiveTab] = useState("pending");

  return (
    <>
      <div>
        <button onClick={() => setActiveTab("pending")}>Pending</button>
        <button onClick={() => setActiveTab("rejected")}>Rejected</button>
        <button onClick={() => setActiveTab("approved")}>Approved</button>
      </div>
      <div>
        <table>
          <thead>
            <tr>
              <th>FULL NAME</th>
              <th>EMAIL</th>
              <th>SUBMITTED</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {activeTab === "pending" && <ApplicationList status="pending" />}
            {activeTab === "rejected" && <ApplicationList status="rejected" />}
            {activeTab === "approved" && <ApplicationList status="approved" />}
          </tbody>
        </table>
      </div>
    </>
  );
};

const ApplicationList = ({ status }: { status: string }) => {
  const [applications, setApplications] = useState<OnboardingApplication[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await api.get("/api/onboarding-applications/all", {
        params: { status },
      });
      setApplications(res.data.onboardingApplications);
    };
    fetch();
  }, [status]);

  return (
    <>
      {applications.map((application) => {
        const emp = application.employeeId as Employee;
        return (
          <tr key={application.id}>
            <td>{emp.firstName + " " + emp.lastName}</td>
            <td>{emp.email}</td>
            <td>{application.createdAt}</td>
            <td>
              <Link
                to={`/employees/onboarding-application/${emp.id}`}
                target="_blank"
              >
                View Application
              </Link>
            </td>
          </tr>
        );
      })}
    </>
  );
};

export default OnboardingReview;
