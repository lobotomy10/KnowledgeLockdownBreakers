import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface PdfViewerProps {
  taskId: string;
}

export const PdfViewer = ({ taskId }: PdfViewerProps) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPdfUrl = async () => {
      try {
        const response = await axios.get<{ url: string }>(`${API_BASE_URL}/tasks/${taskId}/pdf`);
        setPdfUrl(response.data.url);
      } catch (err) {
        console.error("Error fetching PDF URL:", err);
        setError("PDFの読み込みに失敗しました。");
      }
    };

    fetchPdfUrl();
  }, [taskId]);

  if (error) {
    return (
      <Card className="h-full flex items-center justify-center bg-muted">
        <p className="text-destructive">{error}</p>
      </Card>
    );
  }

  if (!pdfUrl) {
    return (
      <Card className="h-full flex items-center justify-center bg-muted">
        <p className="text-muted-foreground">PDFを読み込み中...</p>
      </Card>
    );
  }

  return (
    <Card className="h-full flex items-center justify-center bg-muted">
      <iframe src={pdfUrl} className="w-full h-full rounded-lg" />
    </Card>
  );
};
