import React,{useState,useEffect,useContext} from "react"
import Navbar from "./Navbar"
import { UserContext,RemContext } from "./AppContext"
import axios from "axios"
import { PieChart, Pie, Cell, Tooltip, Legend ,ResponsiveContainer,} from "recharts";
import "./All.css"


function Rems()
{
  const {user}=useContext(UserContext)
  const {rems,setRems}=useContext(RemContext)
   const [initstock,setInitstock]=useState([])
   const [sales,setSales]=useState([])
   const [view,setView]=useState("")
   
   //const {sales}=useContext(SalesContext)
   //const {initstock}=useContext(StockContext)
    useEffect(()=>{
    axios.get(`http://localhost:9000/initstock?user=${user}`)
   .then((res)=>{
    console.log(res)
    setInitstock(res.data)
   })
   .catch((err)=>{

    console.log(err)
   })

   axios.get(`http://localhost:9000/sales?user=${user}`)
   .then((res)=>{
    console.log(res)
    setSales(res.data)
   })
   .catch((err)=>{

    console.log(err)
   })
  },[])


  





   
   
  
    //const initial=initstock
    //const sales1=sales

      useEffect(() => {

    const groupedSales = sales.reduce((acc, item) => {
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

    const rem=initstock.map(item=>{

        const sp=groupedSales.find((s)=>s.product===item.product)
        const sq=sp?sp.quantity:0

        return{

            product:item.product,
            quantity:item.quantity-sq
        }
    })

    const sorted=rem.sort((a,b)=>a.quantity - b.quantity)
    setRems(sorted)

    }, [initstock, sales, setRems]);



return(

    <div className="p-4">
      <Navbar/>
      <h2 className="text-xl font-bold mb-4">Remaining Stock</h2>

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


    {rems.map((value,index)=>(


       <div
            key={index}
            className="card"
          >

        <p><strong>Product:</strong>{value.product} <strong>Quantity:</strong>{value.quantity}</p>
        
        </div>
    ))}

     </div>)}

      {view === "chart" && (
             <div className="flex justify-center">
               <PieChart width={400} height={400}>
                 <Pie
                   data={rems}
                   dataKey="quantity"
                   nameKey="product"
                   cx="50%"
                   cy="50%"
                   outerRadius={150}
                   fill="#8884d8"
                   label
                 >
                   {rems.map((entry, index) => (
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
               </div>)}

   

  </div>
  
   

    
)

}

export default Rems;