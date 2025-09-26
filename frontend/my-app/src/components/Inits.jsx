 import React,{useState,useEffect,useContext} from "react" 
import Navbar from "./Navbar"
import {StockContext} from "./AppContext"
import axios from "axios"
import "./All.css";   // ✅ Import CSS file

function Inits(){

    const {initstock,setInitstock}=useContext(StockContext)

    const [init,setInit]=useState({
        product:"",
        quantity:"",
        cost:""
    })

    function handleChange(e) {
        setInit({...init,[e.target.name]:e.target.value})
    }

    function handleSubmit(e) {
  e.preventDefault();
  if (!init.product || !init.quantity || !init.cost) return;

  const quantity = Number(init.quantity);
  const cost = Number(init.cost);
  const total = Number(init.quantity) * cost;

  const newData = {
    product: init.product.trim().toLowerCase(), // normalize product name
    quantity,
    total,
    costPerUnit: cost,
  };

  // ✅ Check if product already exists
  const existingIndex = initstock.findIndex(
    (item) => item.product.toLowerCase() === newData.product
  );

  let updatedStock;
  if (existingIndex !== -1) {
    // Product already exists → update it
    updatedStock = [...initstock];
    updatedStock[existingIndex].quantity =
      Number(updatedStock[existingIndex].quantity) + quantity;
    updatedStock[existingIndex].total =
      Number(updatedStock[existingIndex].total) + total;
  } else {
    // New product → add to stock
    updatedStock = [newData, ...initstock];
  }

  // ✅ Save to DB (optional: update instead of insert for existing)
  axios
    .post("http://localhost:9000/initstock", newData)
    .then((res) => console.log(res))
    .catch((err) => console.log(err));

  // ✅ Update local state
  setInitstock(updatedStock);

  // ✅ Reset form
  setInit({ product: "", quantity: "", cost: "" });
}


    return(
       
    <div className="flex h-screen">
      <Navbar />
      <main className="main">
        <h1 className="text-2xl font-bold mb-4">Initial Stock Entry</h1>

        <div className="entry-container">
          <div className="entry-left">
            <form onSubmit={handleSubmit}>
              <label>Product Name</label>
              <input type="text" name="product" value={init.product} onChange={handleChange} placeholder="Enter product name" />

              <label>Quantity</label>
              <input type="text" name="quantity" value={init.quantity} onChange={handleChange} placeholder="Enter quantity" />

              <label>Cost</label>
              <input type="number" name="cost" value={init.cost} onChange={handleChange} placeholder="Enter cost" />

              <button type="submit">Add Product</button>
            </form>
          </div>

          <div className="entry-right">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Cost</th>
                </tr>
              </thead>
              <tbody>
                {initstock.length === 0 ? (
                  <tr><td colSpan="3" className="text-center p-3 text-gray-500">No stock added yet</td></tr>
                ) : (
                  initstock.map((item, index) => (
                    <tr key={index}>
                      <td>{item.product}</td>
                      <td>{item.quantity}</td>
                      <td>{item.total}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );


}

export default Inits;
