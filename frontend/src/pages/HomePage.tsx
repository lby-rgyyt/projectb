import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const HomePage = () => {
  const employee = useSelector((state: RootState) => state.auth.employee);

  return (
    <section className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>
            Welcome{employee?.firstName ? `, ${employee.firstName}` : ""}!
          </CardTitle>
          <CardDescription>
            {employee?.role === "hr"
              ? "Use the sidebar to manage employees, visa statuses, and hiring."
              : "Use the sidebar to view your personal information and visa status."}
          </CardDescription>
        </CardHeader>
      </Card>
    </section>
  );
};

export default HomePage;
