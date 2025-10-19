import React from "react"
import {useState,useEffect,useContext} from "react"
import {InvestContext,SalesdContext,GrossContext,MarginContext,TrendsContext,RemContext} from "./AppContext"
import jsPDF from "jspdf"



function Pdf()
{
    const {invest}=useContext(InvestContext)
    const {salesd}=useContext(SalesdContext)
    const {gross}=useContext(GrossContext)
    const {margin}=useContext(MarginContext)
    const {trends}=useContext(TrendsContext)
    const {rem}=useContext(RemContext)



    function generate()
    {

        const doc=new jsPDF()
        doc.text(`Amount Invested : ${invest}`,14,10)
        doc.text(`Sales done :${salesd}`,14,20)
        doc.text(`Gross profit: ${gross}`,14,30)
        doc.text(`Margin Profit :${margin}`,14,40)
       

        
         doc.setFontSize(13);
    doc.text("Top Selling Trends:", 14, 65);

    let y = 75;
    if (Array.isArray(trends) && trends.length > 0) {
      trends.forEach((t, index) => {
        doc.text(
          `${index + 1}. ${t.product} — Qty: ${t.quantity} | Sales: ₹${t.totalCost}`,
          14,
          y
        );
        y += 10;
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      });
    } else {
      doc.text("No trend data available", 14, y);
      y += 10;
    }

    // --- Remaining Stock Section ---
    doc.text("Remaining Stock:", 14, y + 10);
    y += 20;

    if (Array.isArray(rem) && rem.length > 0) {
      rem.forEach((r, index) => {
        doc.text(
          `${index + 1}. ${r.product} — Qty: ${r.quantity} | Value: ₹${r.total}`,
          14,
          y
        );
        y += 10;
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      });
    } else {
      doc.text("No remaining stock data available", 14, y);
    }

    // --- Save File ---
    doc.save("report.pdf");
  }

  return (
    <div className="p-4">
      <button
        onClick={generate}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Download PDF Report
      </button>
    </div>
  );
}

export default Pdf;
        
        
        
        
        
        
        
        
        
        
        
        
        