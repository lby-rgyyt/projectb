import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../utils/api";
import { handlePreview, handleDownload, handleUpload } from "../utils/document";
import type { RootState } from "../store";
import type { VisaStatus } from "../types";
import { handleError } from "../utils/error";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";
import {
  Stepper,
  StepperNav,
  StepperItem,
  StepperTrigger,
  StepperIndicator,
  StepperSeparator,
  StepperTitle,
  StepperPanel,
  StepperContent,
} from "@/components/reui/stepper";
// import { toast } from "sonner";

const steps = ["optReceipt", "optEAD", "i983", "i20"];
const stepLabels: Record<string, string> = {
  optReceipt: "OPT Receipt",
  optEAD: "OPT EAD",
  i983: "I-983",
  i20: "I-20",
};

const stepMessages: Record<string, Record<string, string>> = {
  optReceipt: {
    pendingSubmit: "Please upload your OPT Receipt.",
    pendingApprove: "Waiting for HR to approve your OPT Receipt.",
    approved:
      "Your OPT Receipt has been approved. Please upload a copy of your OPT EAD.",
    rejected: "",
  },
  optEAD: {
    pendingSubmit: "Please upload your OPT EAD.",
    pendingApprove: "Waiting for HR to approve your OPT EAD.",
    approved:
      "Your OPT EAD has been approved. Please download and fill out the I-983 form.",
    rejected: "",
  },
  i983: {
    pendingSubmit:
      "Please download the template, fill it out, and upload the completed I-983.",
    pendingApprove: "Waiting for HR to approve and sign your I-983.",
    approved:
      "Your I-983 has been approved. Please send it to your school and upload the new I-20.",
    rejected: "",
  },
  i20: {
    pendingSubmit: "Please upload your I-20.",
    pendingApprove: "Waiting for HR to approve your I-20.",
    approved: "All documents have been approved.",
    rejected: "",
  },
};

const EmployeeVisaStatusPage = () => {
  const navigate = useNavigate();
  const [visaStatus, setVisaStatus] = useState<VisaStatus | null>(null);
  const [activeTab, setActiveTab] = useState("");

  const currentEmp = useSelector((state: RootState) => state.auth.employee);
  const loading = useSelector((state: RootState) => state.auth.loading);

  const currentStep = visaStatus?.currentStep || "";
  const currentStatus = visaStatus?.currentStatus || "";
  const currentStepIndex = steps.indexOf(currentStep);
  const activeTabIndex = steps.indexOf(activeTab);

  const [redirectCountdown, setRedirectCountdown] = useState(5);
  const shouldRedirect =
    !loading && currentEmp && currentEmp.visaType !== "F1(CPT/OPT)";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/api/visa-status/my-visa-status");
        setVisaStatus(res.data.visaStatus);
        setActiveTab(res.data.visaStatus.currentStep);
      } catch (err) {
        handleError(err);
      }
    };
    fetchData();
  }, []);

  // redirect
  useEffect(() => {
    if (shouldRedirect) {
      const timer = setInterval(() => {
        setRedirectCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [shouldRedirect]);

  useEffect(() => {
    if (redirectCountdown <= 0) {
      navigate("/");
    }
  }, [redirectCountdown, navigate]);

  // get the status of current tab
  const getTabStatus = (): string => {
    if (activeTabIndex < currentStepIndex) return "approved";
    if (activeTabIndex === currentStepIndex) return currentStatus;
    return "notStarted";
  };
  const tabStatus = getTabStatus();

  // message to be displayed at active tab
  const message =
    tabStatus === "notStarted"
      ? "Waiting for previous documents to be completed."
      : stepMessages[activeTab]?.[tabStatus] || "";

  const canUpload =
    activeTab === currentStep &&
    (currentStatus === "pendingSubmit" || currentStatus === "rejected");

  if (shouldRedirect) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>No Visa Tracking Required</CardTitle>
            <CardDescription>
              Your work authorization type ({currentEmp?.visaType}) does not
              require visa status tracking.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Redirecting to homepage in {redirectCountdown} seconds...
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (!activeTab) return null;

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Visa Status Management</h1>

      <Stepper
        className="flex flex-col gap-6"
        value={steps.indexOf(activeTab) + 1}
        onValueChange={(val) => setActiveTab(steps[val - 1])}
        indicators={{ completed: <Check className="h-3 w-3" /> }}
      >
        <StepperNav>
          {steps.map((s, i) => (
            <StepperItem key={s} step={i + 1} completed={i < currentStepIndex}>
              <StepperTrigger>
                <StepperIndicator>{i + 1}</StepperIndicator>
                <StepperTitle>{stepLabels[s]}</StepperTitle>
              </StepperTrigger>

              {i < steps.length - 1 && <StepperSeparator />}
            </StepperItem>
          ))}
        </StepperNav>

        <StepperPanel>
          {steps.map((s, i) => (
            <StepperContent key={s} value={i + 1}>
              <Card>
                <CardHeader>
                  <CardTitle>{stepLabels[s]}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  {/* Status message */}
                  {message && (
                    <Alert
                      variant={
                        tabStatus === "rejected" ? "destructive" : "default"
                      }
                    >
                      <AlertDescription>{message}</AlertDescription>
                    </Alert>
                  )}

                  {/* Rejected feedback */}
                  {s === currentStep && currentStatus === "rejected" && (
                    <Alert variant="destructive">
                      <AlertTitle>HR Feedback</AlertTitle>
                      <AlertDescription>
                        {visaStatus?.feedback}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* I-983 templates */}
                  {s === "i983" && (
                    <nav className="flex gap-2">
                      <Button variant="outline" asChild>
                        <a
                          href={`${import.meta.env.VITE_API_URL}/public/templates/i983-empty.pdf`}
                          download
                        >
                          Empty Template
                        </a>
                      </Button>
                      <Button variant="outline" asChild>
                        <a
                          href={`${import.meta.env.VITE_API_URL}/public/templates/i983-sample.pdf`}
                          download
                        >
                          Sample Template
                        </a>
                      </Button>
                    </nav>
                  )}

                  {/* Upload */}
                  {canUpload && s === activeTab && (
                    <fieldset>
                      <Input
                        type="file"
                        accept=".pdf"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                            await handleUpload(file, currentStep);
                            // toast.success("File uploaded successfully!");
                            const res = await api.get(
                              "/api/visa-status/my-visa-status",
                            );
                            setVisaStatus(res.data.visaStatus);
                          } catch (err) {
                            handleError(err);
                          }
                        }}
                      />
                    </fieldset>
                  )}

                  {/* Preview / Download */}
                  {tabStatus !== "notStarted" && visaStatus?.documents?.[s] && (
                    <fieldset className="flex items-center gap-2">
                      <p className="text-sm">Uploaded: {stepLabels[s]}</p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePreview(visaStatus!.documents![s])}
                      >
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleDownload(visaStatus!.documents![s])
                        }
                      >
                        Download
                      </Button>
                    </fieldset>
                  )}
                </CardContent>
              </Card>
            </StepperContent>
          ))}
        </StepperPanel>
      </Stepper>
    </section>
  );
};

export default EmployeeVisaStatusPage;
