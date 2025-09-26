import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';

function PdfComp({ pdfFile }) {
    const [numPages, setNumPages] = useState(0);

    function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  
  return (
    <div>
      <div>
        {pdfFile ? (
          <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
            {numPages > 0 &&
              Array.from({ length: numPages }, (_, i) => (
                <Page
                  key={`page_${i + 1}`}
                  pageNumber={i + 1}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              ))}
          </Document>
        ) : (
          <p>PDF file not available</p>
        )}
      </div>
      <p>Page 1 of {numPages || 0}</p>
    </div>
  );
}

export default PdfComp;
