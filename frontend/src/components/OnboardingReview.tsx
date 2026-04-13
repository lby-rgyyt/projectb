import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import type { Employee, OnboardingApplication } from "../types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";

const OnboardingReview = () => {
  const [applications, setApplications] = useState<OnboardingApplication[]>([]);
  useEffect(() => {
    const fetchAll = async () => {
      const res = await api.get("/api/onboarding-applications/all");
      setApplications(res.data.onboardingApplications);
    };
    fetchAll();
  }, []);
  const pending = applications.filter((a) => a.status === "pending");
  const rejected = applications.filter((a) => a.status === "rejected");
  const approved = applications.filter((a) => a.status === "approved");
  return (
    <Tabs defaultValue="pending">
      <TabsList>
        <TabsTrigger value="pending">Pending</TabsTrigger>
        <TabsTrigger value="rejected">Rejected</TabsTrigger>
        <TabsTrigger value="approved">Approved</TabsTrigger>
      </TabsList>

      <TabsContent value="pending">
        <ApplicationList applications={pending} />
      </TabsContent>
      <TabsContent value="rejected">
        <ApplicationList applications={rejected} />
      </TabsContent>
      <TabsContent value="approved">
        <ApplicationList applications={approved} />
      </TabsContent>
    </Tabs>
  );
};

const ApplicationList = ({
  applications,
}: {
  applications: OnboardingApplication[];
}) => {
  return (
    <Table className="table-fixed">
      <TableHeader>
        <TableRow>
          <TableHead className="w-1/4">Full Name</TableHead>
          <TableHead className="w-1/4">Email</TableHead>
          <TableHead className="w-1/4">Submitted</TableHead>
          <TableHead className="w-1/4">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applications.map((application) => {
          const emp = application.employeeId as Employee;
          return (
            <TableRow key={application.id}>
              <TableCell>{emp.firstName + " " + emp.lastName}</TableCell>
              <TableCell>{emp.email}</TableCell>
              <TableCell>{application.createdAt}</TableCell>
              <TableCell>
                <Button asChild>
                  <Link
                    to={`/employees/onboarding-application/${emp.id}`}
                    target="_blank"
                  >
                    View Application
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default OnboardingReview;
