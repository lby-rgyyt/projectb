import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import RegistrationTokenManagement from "../components/RegistrationTokenManagement";
import OnboardingReview from "../components/OnboardingReview";

const HiringManagementPage = () => {
  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Hiring Management</h1>
      <Tabs defaultValue="token">
        <TabsList>
          <TabsTrigger value="token">Registration Token</TabsTrigger>
          <TabsTrigger value="review">Onboarding Review</TabsTrigger>
        </TabsList>
        <TabsContent value="token">
          <RegistrationTokenManagement />
        </TabsContent>
        <TabsContent value="review">
          <OnboardingReview />
        </TabsContent>
      </Tabs>
    </section>
  );
};
export default HiringManagementPage;
