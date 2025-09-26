import React,{useState, useEffect} from 'react';
import Nav from '../Nav/Nav';
import axios from 'axios';
import PdfComp from "./PdfComp";
import { pdfjs } from 'react-pdf';
import './SendPdf.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

function SendPdf() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState("");
  const [allPdf, setAllPdf] = useState(null);
  const [pdfFile, setPDFFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { getpdf(); }, []);

  const getpdf = async () => {
    try {
      const result = await axios.get("http://localhost:5000/getFile");
      setAllPdf(result.data.data);
    } catch (e) {
      console.error(e);
      setAllPdf([]);
    }
  };

  const submitPdf = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);
    try {
      setLoading(true);
      const result = await axios.post("http://localhost:5000/uploadfile", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (result.data.status === 200) {
        alert("Pdf uploaded successfully");
        setTitle("");
        setFile("");
        await getpdf();
      } else {
        alert("Pdf not uploaded");
      }
    } catch (error) {
      console.error("Error uploading PDF:" + error.message);
      alert("Error uploading PDF");
    } finally {
      setLoading(false);
    }
  };

  const showPdf = (pdf) => {
    setPDFFile(`http://localhost:5000/files/${pdf}`);
  };

  return (
    <div className="sp-root">
      <div style={{ height: 12 }} />
      <Nav />
      <div className="sp-container">
        <div className="sp-hero" />
        <h1 className="sp-title">Send PDF</h1>
        <h2 className="sp-subtitle">Upload a PDF and preview it instantly</h2>

        <div className="sp-grid">
          {/* Left: Upload and list */}
          <div className="sp-card">
            <form className="sp-form" onSubmit={submitPdf}>
              <div>
                <label className="sp-label">PDF Title</label>
                <input
                  className="sp-input"
                  type="text"
                  name="pdfTitle"
                  placeholder="e.g., Maintenance Report - Sept"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="sp-label">Select PDF file</label>
                <input
                  className="sp-input"
                  type="file"
                  name="pdfFile"
                  accept="application/pdf"
                  required
                  onChange={(e) => setFile(e.target.files?.[0])}
                />
              </div>

              <div className="sp-actions">
                <button className="sp-btn sp-btn-primary" type="submit" disabled={loading}>
                  {loading ? "Uploading…" : "Send PDF"}
                </button>
                <button
                  type="button"
                  className="sp-btn"
                  onClick={() => { setTitle(""); setFile(""); }}
                >
                  Clear
                </button>
              </div>
            </form>

            <hr className="hr-soft" />

            <h4 style={{margin:"6px 0 6px"}}>All PDF Details</h4>
            {allPdf == null ? (
              <div className="sp-state">Loading list…</div>
            ) : allPdf.length === 0 ? (
              <div className="sp-state">No PDF files available</div>
            ) : (
              <div className="sp-list">
                {allPdf.map((data) => (
                  <div className="sp-item" key={data._id}>
                    <div className="sp-item-title" title={data.title}>
                      Title: {data.title}
                    </div>
                    <div className="sp-item-actions">
                      <button className="sp-link-btn" onClick={() => showPdf(data.pdf)}>
                        View PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Preview */}
          <div className="sp-preview">
            {pdfFile ? (
              <PdfComp pdfFile={pdfFile} />
            ) : (
              <div className="sp-preview-empty">
                <div style={{textAlign:"center"}}>
                  <svg width="90" height="90" viewBox="0 0 24 24" fill="none" stroke="#0A1E54" strokeWidth="1.5">
                    <rect x="4" y="3" width="16" height="18" rx="2" stroke="#C8B39B"/>
                    <path d="M7 7h10M7 11h10M7 15h6" />
                  </svg>
                  <div style={{marginTop:8}}>Select a PDF to preview it here</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SendPdf;
