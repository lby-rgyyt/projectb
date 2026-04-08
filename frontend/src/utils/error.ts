import axios from "axios";

export const getErrorMessage = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    if (!err.response) return "Network error. Please check your connection.";
    return (
      err.response.data?.message ||
      err.response.data?.error ||
      "Server error. Please try again."
    );
  }
  return "An unexpected error occurred.";
};
