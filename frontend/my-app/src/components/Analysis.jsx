import React,{useState,useEffect,useContext} from "react"
import Navbar from "./Navbar"
import {StockContext,SalesContext} from "./AppContext"
import axios from "axios"

function Analysis()
{
   //const {sales}=useContext(SalesContext)
   //const {initstock}=useContext(StockContext)

   const [sales,setSales]=useState([])
   const [initstock,setInitstock]=useState([])

   useEffect(()=>{axios.get("http://localhost:9000/sales")
   .then((res)=>{
      console.log(res)
      setSales(res.data)
   })
   .catch((err)=>{
      console.log(err)
   })

   axios.get("http://localhost:9000/initstock")
   .then((res)=>{
      console.log(res)
      setInitstock(res.data)
   })
   .catch((err)=>{
      console.log(err)
   })
},[])


   



   const marginprofit=sales.reduce((acc,item)=>{


      const item2=initstock.find((s)=>s.product===item.product)
      if (!item2) return acc

      const item1=(item.costPerUnit-item2.costPerUnit)*item.quantity

      return acc+item1


},0)

  

  

  
   const invested=initstock.reduce((acc,item)=>acc+item.total,0)
   const totalsales=sales.reduce((acc,item)=>acc+item.totalCost,0)
   const grossprofit=totalsales-invested

   

   return(
      <div>
      <Navbar/>
     <label>Amount Invested</label>
    <div><p><strong>Rs.</strong>{invested}</p></div>
    <label>Sales done</label>
    <div><p><strong>Rs.</strong>{totalsales}</p></div>
    <label>Margin Profit </label>
    <div><p><strong>Rs.</strong>{marginprofit}</p></div>
    <label>Gross Profit</label>
    <div><p><strong>Rs.</strong>{grossprofit}</p></div>
    </div>
   )
}

export default Analysis;