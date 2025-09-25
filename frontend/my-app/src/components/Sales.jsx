import { useState,useContext } from "react";
import Navbar from "./Navbar";
import Context from "./Context"
import Rems from "./Rems";
import Trends from "./Trends";
import { SalesContext } from "./AppContext";
import axios from "axios"

const Sales = () => {
  const {sales,setSales}=useContext(SalesContext)
  const [formData, setFormData] = useState({
    product: "",
    time: "",
    quantity: "",
    costPerUnit: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { product, time, quantity, costPerUnit } = formData;

    if (!product || !time || !quantity || !costPerUnit) return;

    const totalCost = Number(quantity) * Number(costPerUnit);

    const newSale = {
      product,
      time:new Date(formData.time),      
      quantity: Number(quantity),
      costPerUnit: Number(costPerUnit),
      totalCost,
    };

    axios.post("http://localhost:9000/sales",newSale)
    .then((res)=>{

      console.log(res)
    })
    .catch((err)=>{

      console.log(err)
    })

    // Prepend new entry so latest appears first
    setSales([newSale, ...sales]);

    // Reset form
    setFormData({ product: "", time: "", quantity: "", costPerUnit: "" });

    console.log(sales)
  };

  const sortedSales = [...sales].sort(
  (a, b) => new Date(b.time) - new Date(a.time)
);


 return (
    <div className="flex h-screen">
      <Navbar />
      <main className="main">
        <h1 className="text-2xl font-bold mb-4">Daily Sales Entry</h1>

        <div className="entry-container">
          <div className="entry-left">
            <form onSubmit={handleSubmit}>
              <input type="text" name="product" value={formData.product} onChange={handleChange} placeholder="Product" />
              <input type="date" name="time" value={formData.time} onChange={handleChange} />
              <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} placeholder="Quantity" />
              <input type="number" name="costPerUnit" value={formData.costPerUnit} onChange={handleChange} placeholder="Cost per Unit" />
              <button type="submit">Add Sale</button>
            </form>
          </div>

          <div className="entry-right">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Date</th>
                  <th>Quantity</th>
                  <th>Cost/Unit</th>
                  <th>Total Cost</th>
                </tr>
              </thead>
              <tbody>
                {sortedSales.length === 0 ? (
                  <tr><td colSpan="5" className="text-center p-3 text-gray-500">No sales recorded yet</td></tr>
                ) : (
                  sortedSales.map((s, i) => (
                    <tr key={i}>
                      <td>{s.product}</td>
                      <td>{new Date(s.time).toLocaleDateString()}</td>
                      <td>{s.quantity}</td>
                      <td>{s.costPerUnit}</td>
                      <td>{s.totalCost}</td>
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
};

export default Sales;
