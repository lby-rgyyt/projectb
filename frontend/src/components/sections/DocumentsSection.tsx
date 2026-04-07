import { handlePreview, handleDownload } from "../../utils/document";

interface DocumentsSectionProps {
  documents: Record<string, string>;
}

const DocumentsSection = ({ documents }: DocumentsSectionProps) => {
  return (
    <div>
      <h3>Documents</h3>
      {Object.keys(documents).length === 0 && <p>No documents uploaded.</p>}
      {Object.entries(documents).map(([type, docId]) => (
        <div key={type}>
          <span>{type}</span>
          <button type="button" onClick={() => handlePreview(docId)}>
            Preview
          </button>
          <button type="button" onClick={() => handleDownload(docId)}>
            Download
          </button>
        </div>
      ))}
    </div>
  );
};

export default DocumentsSection;
