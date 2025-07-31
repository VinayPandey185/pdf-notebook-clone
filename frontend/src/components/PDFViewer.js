import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// Use the correct workerSrc from public folder
pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.js`;

function PDFViewer({ fileUrl, currentPage }) {
  const [numPages, setNumPages] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    console.log("✔ Loaded PDF, numPages:", numPages);
    setNumPages(numPages);
  };

  return (
    <div style={{ 
      textAlign: "center", 
      marginTop: "10px", 
      maxHeight: "80vh", 
      overflowY: "auto" 
    }}>
      <Document
        file={fileUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading="Loading PDF..."
        renderMode="canvas"
      >
        {/* Always keep pageNumber safe: fallback to page 1 if currentPage invalid */}
        <Page
          key={`page_${currentPage}`}
          pageNumber={Math.min(currentPage, numPages || 1)}
          width={600}
        />
      </Document>
      {numPages && <p>Page {currentPage} of {numPages}</p>}
    </div>
  );
}

export default PDFViewer;
