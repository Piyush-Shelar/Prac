import React,{useState,useEffect} from "react"
import {useContext} from "react"
import Navbar from "./Navbar"
import { SalesContext } from "./AppContext";
import axios from "axios"

function Trends()

{
   const[sales,setSales]=useState([])
  
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

   const trends =[...sales].sort((a,b)=>b.quantity - a.quantity)

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

  </div>
   
   
   
   )}


 



export default Trends