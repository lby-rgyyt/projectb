interface DocumentsSectionProps {
  documents: { name: string; url: string }[];
}

const DocumentsSection = ({
  documents
}: DocumentsSectionProps) => {
  return (
    <div>
      <h3>Documents</h3>
      {documents.map((doc) => (
        <div key={doc.name}>
          <span>{doc.name}</span>
          <a href={doc.url} target="_blank">
            Preview
          </a>
          <a href={doc.url} download>
            Download
          </a>
        </div>
      ))}
    </div>
  );
};

export default DocumentsSection;