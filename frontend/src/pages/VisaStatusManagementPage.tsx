import { useEffect, useState } from "react";
import type { Employee, VisaStatus } from "../types";
import { handlePreview, handleDownload } from "../utils/document";
import api from "../utils/api";
import { handleError } from "../utils/error";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Check, X } from "lucide-react";
import { toast } from "sonner";

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
  const [selectedDocVisa, setSelectedDocVisa] = useState<VisaStatus | null>(
    null,
  );

  const [search, setSearch] = useState("");

  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [docOpen, setDocOpen] = useState(false);
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
        handleError(err);
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
      setApproveOpen(false);
      setFeedback("");
    } catch (err) {
      handleError(err);
      console.log(err);
    }
  };

  const handleReject = async () => {
    if (!feedback.trim()) {
      toast.error("Please provide feedback before rejecting.");
      return;
    }
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
      setRejectOpen(false);
      setFeedback("");
    } catch (err) {
      handleError(err);
      console.log(err);
    }
  };

  const handleNotify = async (vs: VisaStatus) => {
    try {
      await api.post(`/api/visa-status/notify/${vs.id}`);
      toast.success("Notification has been sent.");
    } catch (err) {
      handleError(err);
      console.log(err);
    }
  };

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Visa Status Management</h1>

      {/* Approve Dialog */}
      <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Document</DialogTitle>
            <DialogDescription>
              Confirm to approve this document?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApprove}>Confirm Approve</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog
        open={rejectOpen}
        onOpenChange={(open) => {
          setRejectOpen(open);
          if (!open) setFeedback("");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Document</DialogTitle>
            <DialogDescription>Please provide feedback:</DialogDescription>
          </DialogHeader>
          <fieldset className="flex flex-col gap-2">
            <Label>
              Feedback<span className="text-destructive">*</span>
            </Label>
            <Input
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Explain why this document is being rejected..."
            />
          </fieldset>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectOpen(false);
                setFeedback("");
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Confirm Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Documents Dialog */}
      <Dialog
        open={docOpen}
        onOpenChange={(open) => {
          setDocOpen(open);
          if (!open) setSelectedDocVisa(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Documents — {(selectedDocVisa?.employeeId as Employee)?.firstName}{" "}
              {(selectedDocVisa?.employeeId as Employee)?.lastName}
            </DialogTitle>
          </DialogHeader>
          {selectedDocVisa?.documents &&
          Object.keys(selectedDocVisa.documents).length > 0 ? (
            <Table>
              <TableBody>
                {Object.entries(selectedDocVisa.documents).map(
                  ([type, docId]) => (
                    <TableRow key={type}>
                      <TableCell className="font-medium">{type}</TableCell>
                      <TableCell className="text-right">
                        <nav className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePreview(docId)}
                          >
                            Preview
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownload(docId)}
                          >
                            Download
                          </Button>
                        </nav>
                      </TableCell>
                    </TableRow>
                  ),
                )}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">
              No documents uploaded.
            </p>
          )}
        </DialogContent>
      </Dialog>

      {/* Tabs */}
      <Tabs
        defaultValue="inProgress"
        onValueChange={(val) => setActiveTab(val)}
      >
        <TabsList>
          <TabsTrigger value="inProgress">In Progress</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        {/* In Progress Tab */}
        <TabsContent value="inProgress">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Work Auth</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Days Left</TableHead>
                <TableHead>Next Step</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visaStatuses.map((vs) => {
                const emp = vs.employeeId as Employee;
                const daysLeft = getDaysLeft(emp.visaEndDate);
                return (
                  <TableRow key={vs.id}>
                    <TableCell>
                      {(emp.firstName || "") + " " + (emp.lastName || "")}
                    </TableCell>
                    <TableCell>{emp.visaType || ""}</TableCell>
                    <TableCell>{emp.visaStartDate || ""}</TableCell>
                    <TableCell>{emp.visaEndDate || ""}</TableCell>
                    <TableCell>{daysLeft}</TableCell>
                    <TableCell>{getNextStep(vs)}</TableCell>
                    <TableCell>
                      {vs.currentStatus === "pendingApprove" && (
                        <nav className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handlePreview(vs.documents![vs.currentStep])
                            }
                          >
                            Preview
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setSelectedVisa(vs);
                              setApproveOpen(true);
                            }}
                          >
                            <Check className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setSelectedVisa(vs);
                              setRejectOpen(true);
                            }}
                          >
                            <X className="h-4 w-4 text-red-600" />
                          </Button>
                        </nav>
                      )}
                      {(vs.currentStatus === "pendingSubmit" ||
                        vs.currentStatus === "rejected") && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleNotify(vs)}
                        >
                          Notify
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TabsContent>

        {/* All Tab */}
        <TabsContent value="all" className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            {filteredVisaStatuses.length} employees (sorted by last name)
          </p>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by employee name..."
          />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Work Auth</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Days Left</TableHead>
                <TableHead>Documents</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVisaStatuses.map((vs) => {
                const emp = vs.employeeId as Employee;
                const daysLeft = getDaysLeft(emp.visaEndDate);
                return (
                  <TableRow key={vs.id}>
                    <TableCell>
                      {(emp.firstName || "") + " " + (emp.lastName || "")}
                    </TableCell>
                    <TableCell>{emp.visaType || ""}</TableCell>
                    <TableCell>{emp.visaStartDate || ""}</TableCell>
                    <TableCell>{emp.visaEndDate || ""}</TableCell>
                    <TableCell>{daysLeft}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedDocVisa(vs);
                          setDocOpen(true);
                        }}
                      >
                        View Documents
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default VisaStatusManagementPage;
