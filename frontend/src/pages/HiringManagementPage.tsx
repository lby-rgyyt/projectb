import { useState } from "react";
import RegistrationTokenManagement from "../components/RegistrationTokenManagement";
import OnboardingReview from "../components/OnboardingReview";

const HiringManagementPage = () => {
  const [activeTab, setActiveTab] = useState("token");

  return (
    <>
      <div>
        <button onClick={() => setActiveTab("token")}>
          Registration Token
        </button>
        <button onClick={() => setActiveTab("review")}>
          Onboarding Review
        </button>
      </div>
      {activeTab === "token" && <RegistrationTokenManagement />}
      {activeTab === "review" && <OnboardingReview />}
    </>
  );
};
export default HiringManagementPage;
