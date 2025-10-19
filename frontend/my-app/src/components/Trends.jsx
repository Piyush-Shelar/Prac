import React,{useState,useEffect} from "react"
import {useContext} from "react"
import Navbar from "./Navbar"
import { UserContext,TrendsContext } from "./AppContext";
import axios from "axios"
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import "./All.css"


function Trends()

{
  const {user}=useContext(UserContext)
  const {trends,setTrends}=useContext(TrendsContext)
   const[sales,setSales]=useState([])
   const[filter,setFilter]=useState("all")
   const[days,setDays]=useState("")
   const [view,setView]=useState("list")
   
  
   //const { sales} = useContext(SalesContext)
   useEffect(()=>{
      axios.get(`http://localhost:9000/sales?user=${user}`)
   .then((res)=>{
      console.log(res)
      setSales(res.data)
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


 useEffect(()=>{

   const filteredSales = sales.filter(s => filterByDate(s.time));


   const groupedSales = filteredSales.reduce((acc, item) => {
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

   const trend =[...groupedSales].sort((a,b)=>b.quantity - a.quantity)
   setTrends(trend)


   },[sales,days])

 return (
  <div className="flex flex-col h-screen">
    <Navbar />

    {/* Header area stays fixed */}
    <div className="p-4 border-b bg-white">
      <h2 className="text-xl font-bold mb-4">Sales Trends</h2>

      {/* Fixed buttons row */}
      <div className="flex gap-2 mb-2">
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
    </div>

    {/* Scrollable content */}
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
     {view === "list" && ( 
  <div className="flex flex-col gap-4">
    {trends.map((value, index) => (
      <div
        key={index}
        className="card"
        
      >
        <p className="text-center">
          <strong>Name: </strong> {value.product} &nbsp; | &nbsp;
          <strong>   Quantity: </strong> {value.quantity} &nbsp; | &nbsp;
          <strong>   Cost:</strong> {value.totalCost}
        </p>
      </div>
    ))}
  </div>
)}


      {view === "chart" && (
        <div className="flex justify-center">
          <PieChart width={400} height={400}>
            <Pie
              data={trends}
              dataKey="quantity"
              nameKey="product"
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#8884d8"
              label
            >
              {trends.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#a4de6c"][
                      index % 5
                    ]
                  }
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      )}

      {/* Filter form is also scrollable part */}
      <div className="mt-4">
        <form>
          <label>Enter number of days</label>
          <input
            type="number"
            name="days"
            value={days}
            placeholder="enter number of days"
            onChange={(e) => setDays(e.target.value)}
            className="ml-2 border p-1 rounded"
          />
        </form>
        <button
          onClick={() => setDays("")}
          className="mt-2 px-4 py-2 bg-red-400 text-white rounded-lg"
        >
          Clear
        </button>
      </div>
    </div>
    </div>
    )

}
export default Trends;