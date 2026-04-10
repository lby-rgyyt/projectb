import api from "./api";
import { toast } from "sonner";

export const handleUpload = async (file: File, fileType: string) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileType", fileType);
    await api.post("/api/documents/upload", formData);
    toast.success("File uploaded successfully!");
  } catch {
    toast.error("Failed to upload document.");
  }
};

export const handlePreview = async (docId: string) => {
  try {
    const res = await api.get(`/api/documents/preview/${docId}`, {
      responseType: "blob",
    });
    const url = URL.createObjectURL(res.data);
    window.open(url, "_blank");
  } catch {
    toast.error("Failed to preview document.");
  }
};

export const handleDownload = async (docId: string) => {
  try {
    const res = await api.get(`/api/documents/download/${docId}`, {
      responseType: "blob",
    });
    const url = URL.createObjectURL(res.data);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document";
    a.click();
    URL.revokeObjectURL(url);
  } catch {
    toast.error("Failed to download document.");
  }
};
