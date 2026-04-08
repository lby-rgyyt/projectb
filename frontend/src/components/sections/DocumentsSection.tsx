import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { handlePreview, handleDownload } from "@/utils/document";

interface DocumentsSectionProps {
  documents: Record<string, string>;
}

const DocumentsSection = ({ documents }: DocumentsSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents</CardTitle>
      </CardHeader>
      <CardContent>
        {Object.keys(documents).length === 0 ? (
          <p className="text-sm text-muted-foreground">No documents uploaded.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(documents).map(([type, docId]) => (
                <TableRow key={type}>
                  <TableCell className="font-medium">{type}</TableCell>
                  <TableCell className="text-right">
                    <nav className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => handlePreview(docId)}>
                        Preview
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDownload(docId)}>
                        Download
                      </Button>
                    </nav>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentsSection;
