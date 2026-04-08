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
  return (
    <Tabs defaultValue="pending">
      <TabsList>
        <TabsTrigger value="pending">Pending</TabsTrigger>
        <TabsTrigger value="rejected">Rejected</TabsTrigger>
        <TabsTrigger value="approved">Approved</TabsTrigger>
      </TabsList>

      <TabsContent value="pending">
        <ApplicationList status="pending" />
      </TabsContent>
      <TabsContent value="rejected">
        <ApplicationList status="rejected" />
      </TabsContent>
      <TabsContent value="approved">
        <ApplicationList status="approved" />
      </TabsContent>
    </Tabs>
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Full Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Submitted</TableHead>
          <TableHead>Action</TableHead>
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
                <Button variant="link" asChild>
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
