import { Modal } from "antd";
import { useEffect, useState } from "react";
import type { Employee, VisaStatus } from "../types";
import api from "../utils/api";

const getDaysLeft = (endDate?: string): number | string => {
  if (!endDate) return "N/A";
  return Math.ceil(
    (new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
};

const getNextStep = (vs: VisaStatus): string => {
  const stepLabels: Record<string, string> = {
    optReceipt: "OPT Receipt",
    optEAD: "OPT EAD",
    i983: "I-983",
    i20: "I-20",
  };
  if (vs.currentStatus === "pendingSubmit")
    return `Submit ${stepLabels[vs.currentStep]}`;
  if (vs.currentStatus === "pendingApprove")
    return `Waiting for HR approval: ${stepLabels[vs.currentStep]}`;
  if (vs.currentStatus === "rejected")
    return `Resubmit ${stepLabels[vs.currentStep]}`;
  return "";
};

const VisaStatusManagementPage = () => {
  const [activeTab, setActiveTab] = useState("inProgress");
  const [visaStatuses, setVisaStatuses] = useState<VisaStatus[]>([]);
  const [search, setSearch] = useState("");

  const [approveModal, setApproveModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [selectedVisa, setSelectedVisa] = useState<VisaStatus | null>(null);

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

  const handleApprove = async () => {
    try {
      const res = await api.put(`/api/visa-status/approve/${selectedVisa?.id}`);
      const updatedVs = res.data.visaStatus;
      // update local status
      setVisaStatuses((prev) =>
        prev
          .map((vs) => (vs.id === selectedVisa?.id ? updatedVs : vs))
          .filter((vs) => activeTab !== "inProgress" || vs.inProgress),
      );
      setApproveModal(false);
      setFeedback("");
    } catch (err) {
      console.log(err);
    }
  };

  const handleReject = async () => {
    try {
      const res = await api.put(`/api/visa-status/${selectedVisa?.id}`, {
        currentStatus: "rejected",
        feedback: feedback,
      });
      const updatedVs = res.data.visaStatus;
      // update local status
      setVisaStatuses((prev) =>
        prev.map((vs) => (vs.id === selectedVisa?.id ? updatedVs : vs)),
      );
      setRejectModal(false);
      setFeedback("");
    } catch (err) {
      console.log(err);
    }
  };

  const handleNotify = async (vs: VisaStatus) => {
    try {
      await api.post(`/api/visa-status/notify/${vs.id}`);
      alert("Notification has been sent.");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Modal
        title="Approve Document"
        open={approveModal}
        onOk={handleApprove}
        onCancel={() => setApproveModal(false)}
      >
        <p>Confirm to approve this document?</p>
      </Modal>

      <Modal
        title="Reject Document"
        open={rejectModal}
        onOk={handleReject}
        onCancel={() => {
          setRejectModal(false);
          setFeedback("");
        }}
      >
        <p>Please provide feedback:</p>
        <input
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Explain why this document is being rejected..."
        />
      </Modal>

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
                    <td>{getNextStep(vs)}</td>
                    <td>
                      {/* action */}
                      {/* {documents preview} */}
                      {vs.currentStatus === "pendingApprove" && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedVisa(vs);
                              setApproveModal(true);
                            }}
                          >
                            ✅
                          </button>
                          <button
                            onClick={() => {
                              setSelectedVisa(vs);
                              setRejectModal(true);
                            }}
                          >
                            ❌
                          </button>
                        </>
                      )}
                      {vs.currentStatus === "pendingSubmit" && (
                        <button onClick={() => handleNotify(vs)}>Notify</button>
                      )}
                    </td>
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
