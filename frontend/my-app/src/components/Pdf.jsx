import React from "react"
import {useState,useEffect,useContext} from "react"
import {InvestContext,SalesdContext,GrossContext,MarginContext,TrendsContext,RemContext} from "./Analysis"
import jsPDF from "jspdf"



function Pdf()
{
    const {invest}=useContext(InvestContext)
    const {salesd}=useContext(SalesdContext)
    const {gross}=useContext(GrossContext)
    const {margin}=useContext(MarginContext)
    const {trend}=useContext(TrendsContext)
    const {rem}=useContext(RemContext)



    function generate()
    {

        const doc=new jsPDF()
        doc.text(`Amount Invested : ${invest}`,14,10)
        doc.text(`Sales done :${salesd}`,14,20)
        doc.text(`Gross profit: ${gross}`,14,30)
        doc.text(`Margin Profit :${margin}`,14,40)
        doc.text(`Trends :${trend}`,14,50)
        doc.text(`Remaining stock :${rem}`,14,60)

        doc.save("report.pdf")
    }


    return(
        <div>
            <button onClick={generate}>Generate report</button>



        </div>



    )
}
export default Pdf