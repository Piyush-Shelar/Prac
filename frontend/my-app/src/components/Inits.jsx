import React,{useState,useEffect,useContext} from "react"
import Navbar from "./Navbar"
import Rems from "./Rems"
import {StockContext} from "./AppContext"
import axios from "axios"


function Inits(){

    const {initstock,setInitstock}=useContext(StockContext)

   
    const [init,setInit]=useState(
        {
            product:"",
            quantity:"",
            cost:""
        }
    )


    function handleChange(e)
    {
         setInit({...init,[e.target.name]:e.target.value})
    }

    function handleSubmit(e)
    {
        
        e.preventDefault();
    if (!init.product || !init.quantity || !init.cost) return;

    const total=Number(init.quantity)*Number(init.cost)

    const newData={

        product:init.product,
        quantity:init.quantity,
        total:total,
        costPerUnit:init.cost,

    }
    axios.post("http://localhost:9000/initstock",newData)
    .then((res)=>{

      console.log(res)
    })
    .catch((err)=>{
      console.log(err)
    })

    setInitstock([newData,...initstock])
    setInit({product:"",quantity:"",cost:""})



    }


return(
 
    <div className="flex h-screen">
      <Navbar />
      <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Initial Stock Entry</h1>

        <section className="grid grid-rows-2 gap-6 h-[85vh]"></section>
    <table className="w-full bg-white shadow-md rounded-lg border border-gray-300 overflow-y-auto">
        <thead className="bg-gray-200">
            <tr>
                <th className="border p-2">Product</th>
                <th className="border p-2">Quantity</th>
                <th className="border p-2">Cost</th>
            </tr>
        </thead>
        <tbody>
           
            {initstock.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center p-3 text-gray-500">
                  No stock added yet
                </td>
              </tr>
            ) : (
              initstock.map((item, index) => (
                <tr key={index} className="text-center">
                  <td className="border p-2">{item.product}</td>
                  <td className="border p-2">{item.quantity}</td>
                  <td className="border p-2">{item.total}</td>
                </tr>
              ))
            )}
          
        </tbody>
    </table>

    <form onSubmit={handleSubmit}  className="bg-white shadow-md rounded-lg p-4 grid grid-cols-3 gap-4">

        <label>Product name</label>
        <input
        type="text"
        name="product"
        value={init.product}
        placeholder="enter product name"
        onChange={handleChange}
        />
        <label>Quantity</label>
        <input
        type="text"
        name="quantity"
        value={init.quantity}
        placeholder="enter quantity"
        onChange={handleChange}
        />

        <label>Cost</label>
        <input
        type="number"
        name="cost"
        value={init.cost}
        placeholder="enter cost"
        onChange={handleChange}
        />

        <button type="submit">Add product</button>


   </form>
       </main>

       
    </div>

   
)


}

export default Inits