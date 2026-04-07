import api from "./api";

export const handleUpload = async (file: File, fileType: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileType", fileType);
    await api.post("/api/documents/upload", formData);
  };

export const handlePreview = async (docId: string) => {
  const res = await api.get(`/api/documents/preview/${docId}`, {
    responseType: "blob",
  });
  const url = URL.createObjectURL(res.data);
  window.open(url, "_blank");
};

export const handleDownload = async (docId: string) => {
  const res = await api.get(`/api/documents/download/${docId}`, {
    responseType: "blob",
  });
  const url = URL.createObjectURL(res.data);
  const a = document.createElement("a");
  a.href = url;
  a.download = "document";
  a.click();
  URL.revokeObjectURL(url);
};
