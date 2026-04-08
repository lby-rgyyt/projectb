import axios from "axios";
import { toast } from "sonner";

export const handleError = (err: unknown) => {
  if (axios.isAxiosError(err)) {
    if (!err.response) {
      toast.error("Network error. Please check your connection.");
      return;
    }
    toast.error(
      err.response.data?.message ||
        err.response.data?.error ||
        "Server error. Please try again.",
    );
    return;
  }
  toast.error("An unexpected error occurred.");
};
