import React, { useContext, useState } from "react";
import {
  InvestContext,
  SalesdContext,
  GrossContext,
  MarginContext,
  TrendsContext,
  RemContext,
} from "./AppContext";
import jsPDF from "jspdf";
import Navbar from "./Navbar";

function Pdf() {
  const { invest } = useContext(InvestContext);
  const { salesd } = useContext(SalesdContext);
  const { gross } = useContext(GrossContext);
  const { margin } = useContext(MarginContext);
  const { trends } = useContext(TrendsContext);
  const { rems } = useContext(RemContext);

  const [pdfUrl, setPdfUrl] = useState(null);

  function addWrappedText(doc, text, x, y, maxWidth, lineHeight) {
    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach((line, i) => {
      if (y > 280) { // near bottom of page
        doc.addPage();
        y = 20; // reset to top
      }
      doc.text(line, x, y);
      y += lineHeight;
    });
    return y;
  }

  function generatePDF(preview = false) {
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Financial Report", 80, 15);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    let y = 30;
    const lineHeight = 8;
    const maxWidth = 180;

    y = addWrappedText(doc, `Amount Invested: ₹${invest}`, 14, y, maxWidth, lineHeight);
    y = addWrappedText(doc, `Sales Done: ₹${salesd}`, 14, y, maxWidth, lineHeight);
    y = addWrappedText(doc, `Gross Profit: ₹${gross}`, 14, y, maxWidth, lineHeight);
    y = addWrappedText(doc, `Margin Profit: ₹${margin}`, 14, y, maxWidth, lineHeight);

    const trendsText =
      typeof trends === "object" ? JSON.stringify(trends, null, 2) : trends;
    y = addWrappedText(doc, `\nTrends:\n${trendsText}`, 14, y + 5, maxWidth, lineHeight);

    const remText =
      Array.isArray(rems)
        ? rems.map((r) => `${r.product}: ${r.quantity}`).join(", ")
        : JSON.stringify(rems, null, 2);
    y = addWrappedText(doc, `\nRemaining Stock:\n${remText}`, 14, y + 5, maxWidth, lineHeight);

    if (preview) {
      const pdfBlob = doc.output("blob");
      const pdfBlobUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(pdfBlobUrl);
    } else {
      doc.save("Financial_Report.pdf");
    }
  }

  return (
    <div style={{ textAlign: "center", padding: "30px" }}>
      <Navbar />

      <h1 style={{ marginBottom: "20px" }}>Generate Financial Report</h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <button
          onClick={() => generatePDF(true)}
          style={{
            padding: "10px 20px",
            backgroundColor: "lightblue",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Preview PDF
        </button>
        <button
          onClick={() => generatePDF(false)}
          style={{
            padding: "10px 20px",
            backgroundColor: "lightgreen",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Download PDF
        </button>
      </div>

      {pdfUrl && (
        <div
          style={{
            border: "2px solid #ccc",
            borderRadius: "10px",
            width: "80%",
            height: "600px",
            margin: "0 auto",
          }}
        >
          <iframe
            src={pdfUrl}
            title="PDF Preview"
            width="100%"
            height="100%"
            style={{ border: "none", borderRadius: "10px" }}
          ></iframe>
        </div>
      )}
    </div>
  );
}

export default Pdf;
