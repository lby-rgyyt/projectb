import { useState } from "react";
import type { OnboardingApplication } from "../types";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { CircleCheck, Clock, CircleX } from "lucide-react";
import { toast } from "sonner";

interface OnboardingStatusBannerProps {
  applicationData: OnboardingApplication | null;
  isOwner: boolean;
  onApprove?: () => Promise<void>;
  onReject?: (feedback: string) => Promise<void>;
}

const OnboardingStatusBanner = ({
  applicationData,
  isOwner,
  onApprove,
  onReject,
}: OnboardingStatusBannerProps) => {
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [feedback, setFeedback] = useState("");

  if (!applicationData) return null;
  const { status } = applicationData;

  return (
    <section className="flex flex-col gap-4">
      {/* Employee view */}
      {isOwner && (
        <>
          {status === "approved" && (
            <Alert>
              <CircleCheck className="h-4 w-4" />
              <AlertTitle>Application Approved!</AlertTitle>
              <AlertDescription>
                Your onboarding application has been approved. Use the sidebar
                to access Personal Information and Visa Status Management.
              </AlertDescription>
            </Alert>
          )}
          {status === "pending" && (
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertTitle>Application Pending Review</AlertTitle>
              <AlertDescription>
                Please wait for HR to review your application. You will be
                notified once a decision is made.
              </AlertDescription>
            </Alert>
          )}
          {status === "rejected" && (
            <Alert variant="destructive">
              <CircleX className="h-4 w-4" />
              <AlertTitle>Application Rejected</AlertTitle>
              <AlertDescription>
                Please review the feedback below, make the necessary changes,
                and resubmit your application.
              </AlertDescription>
              <p className="mt-2 text-sm font-medium">
                HR Feedback: {applicationData.feedback}
              </p>
            </Alert>
          )}
        </>
      )}

      {/* HR view */}
      {!isOwner && (
        <>
          {status === "pending" && (
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertTitle>Review Decision</AlertTitle>
              <AlertDescription>
                After reviewing the application, approve or reject it below.
              </AlertDescription>
              <nav className="mt-4 flex gap-2">
                {/* Approve Dialog */}
                <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
                  <DialogTrigger asChild>
                    <Button>Approve</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Approval</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to approve this application?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setApproveOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={async () => {
                          if (onApprove) await onApprove();
                          setApproveOpen(false);
                        }}
                      >
                        Confirm Approve
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Reject Dialog */}
                <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive">Reject</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Reject Application</DialogTitle>
                      <DialogDescription>
                        Provide feedback so the employee can fix and resubmit.
                      </DialogDescription>
                    </DialogHeader>
                    <fieldset className="flex flex-col gap-2">
                      <Label>Rejection Feedback *</Label>
                      <Input
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Explain what needs to be corrected"
                      />
                    </fieldset>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setRejectOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={async () => {
                          if (!feedback.trim()) {
                            toast.error(
                              "Please provide feedback before rejecting.",
                            );
                            return;
                          }
                          if (onReject) await onReject(feedback);
                          setRejectOpen(false);
                        }}
                      >
                        Confirm Rejection
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </nav>
            </Alert>
          )}

          {status === "rejected" && (
            <Alert variant="destructive">
              <CircleX className="h-4 w-4" />
              <AlertTitle>Application Rejected</AlertTitle>
              <AlertDescription>
                Feedback: {applicationData.feedback}
              </AlertDescription>
            </Alert>
          )}

          {status === "approved" && (
            <Alert>
              <CircleCheck className="h-4 w-4" />
              <AlertTitle>Application Approved</AlertTitle>
            </Alert>
          )}
        </>
      )}
    </section>
  );
};

export default OnboardingStatusBanner;
