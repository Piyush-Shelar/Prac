import React,{useState,useEffect,useContext} from "react"
import Navbar from "./Navbar"
import {UserContext} from "./AppContext"
import axios from "axios"
import { PieChart, Pie, Cell, Tooltip, Legend ,ResponsiveContainer,} from "recharts";
import "./All.css"

function Analysis()
{
  const {user}=useContext(UserContext)
   //const {sales}=useContext(SalesContext)
   //const {initstock}=useContext(StockContext)

   const [sales,setSales]=useState([])
   const [initstock,setInitstock]=useState([])
    const[filter,setFilter]=useState("all")
    const [days,setDays]=useState("")
    const [view,setView]=useState("")

   useEffect(()=>{axios.get(`http://localhost:9000/sales?user=${user}`)
   .then((res)=>{
      console.log(res)
      setSales(res.data)
   })
   .catch((err)=>{
      console.log(err)
   })

   axios.get(`http://localhost:9000/initstock?user=${user}`)
   .then((res)=>{
      console.log(res)
      setInitstock(res.data)
   })
   .catch((err)=>{
      console.log(err)
   })
},[])


function filterByDate(saleDate) {
   if (!days) return true;
  const today = new Date();
  const d = new Date(saleDate);

  
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - Number(days));
    return d >= pastDate && d <= today;
  
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


   const investedSalesData = [
    { name: "Invested", value: invested },
    { name: "Sales", value: totalsales },
  ];

  const profitData = [
    { name: "Margin Profit", value: marginprofit },
    { name: "Gross Profit", value: grossprofit },
  ];

  const COLORS = ["#0088FE", "#FF8042", "#00C49F", "#FFBB28"];

   

   return(
      <div>
      <Navbar/>
    
     <div className="flex gap-2 mb-4">
        <button
          onClick={() => setView("list")}
          className={`px-4 py-2 rounded-lg ${
            view === "list" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Default View
        </button>
        <button
          onClick={() => setView("chart")}
          className={`px-4 py-2 rounded-lg ${
            view === "chart" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Pie Chart
        </button>
      </div>
     
      {view === "list" && (
        <div className="flex flex-col gap-4">
         <div className="card">
          
       <p><strong>Amount Invested Rs.</strong>{invested}</p></div>
    <div className="card">
          
       <p><strong>Sales done Rs.</strong>{totalsales}</p></div>
    <div className="card">
          
       <p><strong>Margin Profit Rs.</strong>{marginprofit}</p></div>
    <div className="card">
          
       <p><strong>Gross Profit Rs.</strong>{grossprofit}</p></div>

    </div>)}


      {view === "chart" && (
  <div className="charts-container">
    {/* Invested vs Sales */}
    <div className="chart-box">
      <h3>Invested vs Sales</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={investedSalesData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            dataKey="value"
          >
            {investedSalesData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>

    {/* Profit Data */}
    <div className="chart-box">
      <h3>Margin vs Gross Profit</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={profitData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            dataKey="value"
          >
            {profitData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index + 2]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
)}




   <div>
    <form>
     <input
     type="number"
     name="days"
     value={days}
     placeholder="enter no.of days"
     onChange={(e)=>{setDays(e.target.value)}}
     />
     <button onClick={()=>{setDays("")}}>Clear</button>
     </form>  
    </div>
    </div>
   )
}

export default Analysis;