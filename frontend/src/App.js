import React, { useState } from "react";
import PDFViewer from "./components/PDFViewer";
import Chat from "./components/Chat";

function App() {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('https://pdf-notebook-clone.onrender.com/api/upload', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();

        console.log('✅ PDF URL from backend:', `https://pdf-notebook-clone.onrender.com${data.filePath}`);
        setPdfUrl(`https://pdf-notebook-clone.onrender.com${data.filePath}`);
        setCurrentPage(1); // always reset to first page
      } catch (error) {
        console.error('Upload error:', error);
      }
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* LEFT: Chat */}
      <div style={{ flex: 1, borderRight: "1px solid #ccc", display: "flex", flexDirection: "column" }}>
        {pdfUrl && <Chat setCurrentPage={setCurrentPage} />}
      </div>

      {/* RIGHT: Upload + PDF */}
      <div style={{ flex: 1, padding: "10px", overflowY: "auto" }}>
        <h1>📒 NotebookLM Clone</h1>
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        <p>You can ask anything about the document.</p>
        {pdfUrl && <PDFViewer fileUrl={pdfUrl} currentPage={currentPage} />}
      </div>
    </div>
  );
}

export default App;
