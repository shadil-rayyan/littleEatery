"use client";

import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Loader, FileText } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFDocumentLoadSuccess {
  numPages: number;
}

const Menu = () => {
  const [pdfPath, setPdfPath] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Fetch data.json and extract the menu PDF path
  useEffect(() => {
    const fetchPath = async () => {
      try {
        const response = await fetch("/data.json");
        const json = await response.json();
        setPdfPath(json.documents.menu);
      } catch (err) {
        setError("Failed to load configuration");
        setLoading(false);
      }
    };

    fetchPath();
  }, []);

  useEffect(() => {
    const updateWidth = () => setContainerWidth(window.innerWidth);
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const onDocumentLoadSuccess = ({ numPages }: PDFDocumentLoadSuccess) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    setLoading(false);
    setError(error.message);
  };

  return (
    <div className="w-screen min-h-screen bg-gray-100 overflow-x-hidden">
      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-blue-500 mb-4" />
          <p className="text-gray-600">Loading PDF...</p>
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center py-12">
          <FileText className="w-16 h-16 text-red-500 mb-4" />
          <p className="text-gray-600 mb-4">{error}</p>
          {pdfPath && (
            <a
              href={pdfPath}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Open PDF in New Tab
            </a>
          )}
        </div>
      )}

      {!error && pdfPath && (
        <Document
          file={pdfPath}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={null}
        >
          <div className="flex flex-col items-center gap-4">
            {numPages &&
              Array.from(new Array(numPages), (_, index) => (
                <Page
                  key={index}
                  pageNumber={index + 1}
                  width={containerWidth}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="bg-white"
                />
              ))}
          </div>
        </Document>
      )}
    </div>
  );
};

export default Menu;
