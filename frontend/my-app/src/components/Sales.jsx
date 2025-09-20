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
      time,      quantity: Number(quantity),
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

  return (
    <div className="flex h-screen">
      <Navbar />
      <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Daily Sales Entry</h1>

        <section className="grid grid-rows-2 gap-6 h-[85vh]">
          {/* Table */}
          <table className="w-full bg-white shadow-md rounded-lg border border-gray-300 overflow-y-auto">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">Product</th>
                <th className="border p-2">Time</th>
                <th className="border p-2">Quantity</th>
                <th className="border p-2">Cost/Unit</th>
                <th className="border p-2">Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {sales.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-3 text-gray-500">
                    No sales recorded yet
                  </td>
                </tr>
              ) : (
                sales.map((s, i) => (
                  <tr key={i} className="text-center">
                    <td className="border p-2">{s.product}</td>
                    <td className="border p-2">{s.time}</td>
                    <td className="border p-2">{s.quantity}</td>
                    <td className="border p-2">{s.costPerUnit}</td>
                    <td className="border p-2 font-semibold">{s.totalCost}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded-lg p-4 grid grid-cols-4 gap-4"
          >
            <input
              type="text"
              name="product"
              placeholder="Product"
              value={formData.product}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              type="number"
              name="costPerUnit"
              placeholder="Cost per Unit"
              value={formData.costPerUnit}
              onChange={handleChange}
              className="border p-2 rounded"
            />

            <button
              type="submit"
              className="col-span-4 bg-green-600 text-white p-2 rounded hover:bg-green-700"
            >
              Add Sale
            </button>
          </form>
        </section>
      </main>

      
    </div>
  );
};

export default Sales;
