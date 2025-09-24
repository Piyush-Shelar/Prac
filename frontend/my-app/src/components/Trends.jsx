import React,{useState,useEffect} from "react"
import {useContext} from "react"
import Navbar from "./Navbar"
import { SalesContext } from "./AppContext";
import axios from "axios"

function Trends()

{
   const[sales,setSales]=useState([])
   const[filter,setFilter]=useState("all")
   const[days,setDays]=useState("")
   
  
   //const { sales} = useContext(SalesContext)
   useEffect(()=>{
      axios.get("http://localhost:9000/sales")
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

   const trends =[...groupedSales].sort((a,b)=>b.quantity - a.quantity)

 return(

   <div className="p-4">
      <Navbar/>
      <h2 className="text-xl font-bold mb-4">Sales Trends</h2>
      
      <div className="flex flex-col gap-4">

   {trends.map((value,index)=>(

      <div
            key={index}
            className="p-4 rounded-2xl shadow-md bg-white border flex flex-col"
          >

         <p><strong>Product:</strong>{value.product}</p>
         <p><strong>Quantity:</strong>{value.quantity}</p>
         <p><strong>Cost:</strong>{value.totalCost}</p>
      
      
      </div>


     
 ))}

    </div>

    <div>
     <form >
      <label>Enter number of days</label><input
      type="number"
      name="days"
      value={days}
      placeholder="enter number of days"
      onChange={(e)=>{setDays(e.target.value)}}
      />
      
     </form>
     <button onClick={()=>{setDays("")}}>Clear</button>
     

  </div>
  </div>
   
   
   
   )}


 



export default Trends