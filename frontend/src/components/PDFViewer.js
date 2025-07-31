import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// set worker src
pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.js`;

function PDFViewer({ fileUrl, currentPage }) {
  const [numPages, setNumPages] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    console.log("✔ Loaded PDF, numPages:", numPages);
    setNumPages(numPages);
  }

  return (
    <div style={{ textAlign: "center", marginTop: "10px", maxHeight: "80vh", overflowY: "auto" }}>
      <Document
        file={fileUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading="Loading PDF..."
        renderMode="canvas"
      >
        <Page
          key={`page_${currentPage}`} 
          pageNumber={currentPage}
          width={600}
        />
      </Document>
      {numPages && <p>Page {currentPage} of {numPages}</p>}
    </div>
  );
}

export default PDFViewer;
