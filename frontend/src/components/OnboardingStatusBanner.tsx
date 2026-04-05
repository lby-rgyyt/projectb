import { useState } from "react";
import type { OnboardingApplication } from "../types";

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
  const [approve, setApprove] = useState("");
  const [feedback, setFeedback] = useState("");

  return (
    <>
      {isOwner && applicationData !== null && (
        <div>
          {applicationData?.status === "approved" && (
            <div>
              <h3>Application Approved!</h3>
              <p>
                Your onboarding application has been approved. You now have full
                access to the portal.
              </p>
              <p>
                Use the side bar to access Personal Information and Visa Status
                Management.
              </p>
            </div>
          )}
          {applicationData?.status === "pending" && (
            <div>
              <h3>Application Pending Review</h3>
              <p>
                Please wait for HR to review your application. You will be
                notified once a decision is made.
              </p>
            </div>
          )}
          {applicationData?.status === "rejected" && (
            <div>
              <h3>Application Rejected</h3>
              <p>
                Please review the feedback below, make the necessary changes,
                and resubmit your application.
              </p>
              <p>HR Feedbacks:</p>
              <p>{applicationData.feedback}</p>
            </div>
          )}
        </div>
      )}

      {!isOwner && applicationData?.status === "pending" && (
        <div>
          <h3>Review Decision</h3>
          <p>After reviewing the application, approve or reject it below.</p>
          <button
            type="button"
            onClick={() => {
              setApprove("yes");
            }}
          >
            Approve Application
          </button>
          <button
            type="button"
            onClick={() => {
              setApprove("no");
            }}
          >
            Reject Application
          </button>
          {approve === "no" && (
            <div>
              <label>Rejection Feedback *</label>
              <input
                value={feedback}
                onChange={(e) => {
                  setFeedback(e.target.value);
                }}
                placeholder="Explain what needs to be corrected so the employee can fix and resubmit"
              />
              <button
                type="button"
                onClick={() => {
                  if (onReject) onReject(feedback);
                }}
              >
                Confirm Rejection & Send Feedback
              </button>
              <button
                type="button"
                onClick={() => {
                  setApprove("");
                }}
              >
                Cancel
              </button>
            </div>
          )}
          {approve === "yes" && (
            <div>
              <label>Reconfirm to approve the application.</label>
              <button
                type="button"
                onClick={() => {
                  if (onApprove) onApprove();
                }}
              >
                Confirm Approve
              </button>
              <button
                type="button"
                onClick={() => {
                  setApprove("");
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {!isOwner && applicationData?.status === "rejected" && (
        <div>
          <p>This application is rejected.</p>
          <p>Feedback: {applicationData.feedback}</p>
        </div>
      )}

      {!isOwner && applicationData?.status === "approved" && (
        <div>
          <p>This application is approved.</p>
        </div>
      )}
    </>
  );
};

export default OnboardingStatusBanner;
