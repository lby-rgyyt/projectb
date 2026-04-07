import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../utils/api";
import { handlePreview, handleDownload, handleUpload } from "../utils/document";
import type { RootState } from "../store";
import type { VisaStatus } from "../types";

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

  const currentStep = visaStatus?.currentStep || "";
  const currentStatus = visaStatus?.currentStatus || "";
  const currentStepIndex = steps.indexOf(currentStep);
  const activeTabIndex = steps.indexOf(activeTab);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/api/visa-status/my-visa-status");
        setVisaStatus(res.data.visaStatus);
        setActiveTab(res.data.visaStatus.currentStep);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

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

  if (currentEmp?.visaType !== "F1(CPT/OPT)") {
    navigate("/");
  }

  return (
    <div>
      <h1>Visa Status Management</h1>
      <div>
        {steps.map((s) => (
          <button key={s} type="button" onClick={() => setActiveTab(s)}>
            {stepLabels[s]}
          </button>
        ))}
      </div>

      <div>
        <h3>{stepLabels[activeTab]}</h3>

        <p>{message}</p>
        {activeTab === currentStep && currentStatus === "rejected" && (
          <div>
            <p>HR Feedback: {visaStatus?.feedback}</p>
          </div>
        )}

        {/* i983 should have two template file */}
        {activeTab === "i983" && (
          <div>
            <a
              href={`${import.meta.env.VITE_API_URL}/public/templates/i983-empty.pdf`}
              download
            >
              Empty Template
            </a>
            <a
              href={`${import.meta.env.VITE_API_URL}/public/templates/i983-sample.pdf`}
              download
            >
              Sample Template
            </a>
          </div>
        )}
        {/* upload */}
        {canUpload && (
          <div>
            <input
              type="file"
              accept=".pdf"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  await handleUpload(file, currentStep);
                  alert("File uploaded successfully!");
                  const res = await api.get("/api/visa-status/my-visa-status");
                  setVisaStatus(res.data.visaStatus);
                } catch {
                  alert("Upload failed");
                }
              }}
            />
          </div>
        )}

        {/* download and preview */}
        {tabStatus !== "notStarted" && visaStatus?.documents?.[activeTab] && (
          <div>
            <p>Uploaded document: {stepLabels[activeTab]}</p>
            <button
              type="button"
              onClick={() => handlePreview(visaStatus!.documents![activeTab])}
            >
              Preview
            </button>
            <button
              type="button"
              onClick={() => handleDownload(visaStatus!.documents![activeTab])}
            >
              Download
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeVisaStatusPage;
