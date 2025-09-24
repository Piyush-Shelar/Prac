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
    const[filter,setFilter]=useState("all")

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


function filterByDate(saleDate) {
  const today = new Date();
  const d = new Date(saleDate);

  if (filter === "weekly") {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);
    return d >= oneWeekAgo && d <= today;
  }

  if (filter === "monthly") {
      const oneMonthAgo = new Date(today);
      oneMonthAgo.setDate(today.getDate() - 31); 
      return d >= oneMonthAgo && d <= today;
    }

   if (filter === "yearly") {
      const oneYearAgo = new Date(today);
      oneYearAgo.setDate(today.getDate() - 365); 
      return d >= oneYearAgo && d <= today;
    }
  return true; 
}



const filteredSales = sales.filter(s => filterByDate(s.time));

const groupedSales = filteredSales.reduce((acc, item) => {
    const existing = acc.find((s) => s.product === item.product);
    if (existing) {
      existing.quantity += Number(item.quantity);
     
    } else {
      acc.push({
        product: item.product,
        quantity: Number(item.quantity),
        costPerUnit: Number(item.costPerUnit),
      });
    }
    return acc;
  }, []);

  


   



   const marginprofit=groupedSales.reduce((acc,item)=>{


      const item2=initstock.find((s)=>s.product===item.product)
      if (!item2) return acc

      const item1=(item.costPerUnit-item2.costPerUnit)*item.quantity

      return acc+item1


},0)

  

  const groupedSales1 = filteredSales.reduce((acc, item) => {
    const existing = acc.find((s) => s.product === item.product);
    if (existing) {
      existing.quantity += Number(item.quantity);
      existing.totalCost += Number(item.totalCost);
    } else {
      acc.push({
        product: item.product,
        quantity: Number(item.quantity),
        totalCost: Number(item.totalCost),
      });
    }
    return acc;
  }, []);

  
   const invested=initstock.reduce((acc,item)=>acc+item.total,0)
   const totalsales=groupedSales1.reduce((acc,item)=>acc+item.totalCost,0)
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

   <div>
      <button onClick={()=>setFilter("weekly")}>Weekly</button>
      <button onClick={()=>setFilter("monthly")}>Monthly</button>
      <button onClick={()=>setFilter("yearly")}>Yearly</button>
    </div>
    </div>
   )
}

export default Analysis;