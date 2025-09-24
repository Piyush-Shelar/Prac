import React,{useState,useEffect,useContext} from "react"
import Navbar from "./Navbar"
import { StockContext,SalesContext } from "./AppContext"
import axios from "axios"

function Rems()
{
   const [initstock,setInitstock]=useState([])
   const [sales,setSales]=useState([])
   
   //const {sales}=useContext(SalesContext)
   //const {initstock}=useContext(StockContext)
    useEffect(()=>{
    axios.get("http://localhost:9000/initstock")
   .then((res)=>{
    console.log(res)
    setInitstock(res.data)
   })
   .catch((err)=>{

    console.log(err)
   })

   axios.get("http://localhost:9000/sales")
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



return(

    <div className="p-4">
      <Navbar/>
      <h2 className="text-xl font-bold mb-4">Remaining Stock</h2>
      
      <div className="flex flex-col gap-4">


    {sorted.map((value,index)=>(


       <div
            key={index}
            className="p-4 rounded-2xl shadow-md bg-white border flex flex-col"
          >

        <p><strong>Product:</strong>{value.product} <strong>Quantity:</strong>{value.quantity}</p>
        
        </div>
    ))}

     </div>

     <div>
      <button onClick={()=>setFilter("weekly")}>Weekly</button>
      <button onClick={()=>setFilter("monthly")}>Monthly</button>
      <button onClick={()=>setFilter("yearly")}>Yearly</button>
    </div>


  </div>
   

    
)

}

export default Rems;