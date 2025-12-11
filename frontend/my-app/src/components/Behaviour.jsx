import React, { useState, useEffect, useContext } from "react";
import Navbar from "./Navbar";
import { UserContext } from "./AppContext";
import axios from "axios";

function Behaviour() {
  const [sales, setSales] = useState([]);
  const [initstock, setInitstock] = useState([]);
  const [days, setDays] = useState("");

  const { user } = useContext(UserContext);

  // ------------------------ LOAD DATA ------------------------------------
  useEffect(() => {
    axios
      .get(`http://localhost:9000/sales?user=${user}`)
      .then((res) => setSales(res.data))
      .catch((err) => console.log(err));

    axios
      .get(`http://localhost:9000/initstock?user=${user}`)
      .then((res) => setInitstock(res.data))
      .catch((err) => console.log(err));
  }, [user]);

  // ------------------------ FILTER BY DATE -------------------------------
  function filterByDate(saleDate) {
    if (!days) return true;

    const today = new Date();
    const d = new Date(saleDate);

    const pastDate = new Date();
    pastDate.setDate(today.getDate() - Number(days));

    return d >= pastDate && d <= today;
  }

  const filteredSales = sales.filter((s) => filterByDate(s.time));

  // ------------------------ GROUP SALES ----------------------------------
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
        costPerUnit: Number(item.costPerUnit),
      });
    }
    return acc;
  }, []);

  // ------------------------ CALCULATE GROSS PROFIT FOR THESE DAYS --------
  const invested = initstock.reduce((acc, item) => acc + item.total, 0);
  const salesDone = groupedSales.reduce((acc, item) => acc + item.totalCost, 0);
  const gross = salesDone - invested;

  // ------------------------ PRODUCT WISE PROFIT --------------------------
  const productProfits = groupedSales.map((item) => {
    const initial = initstock.find((s) => s.product === item.product);

    if (!initial) {
      return {
        product: item.product,
        profit: 0,
      };
    }

    const profit =
      (item.costPerUnit - Number(initial.costPerUnit)) * item.quantity;

    return {
      product: item.product,
      profit,
    };
  });

  // ------------------------ CONTRIBUTION --------------------------------
  const contributions = productProfits.map((p) => {
    const contri = gross ? (p.profit / gross) * 100 : 0;

    return {
      product: p.product,
      profit: p.profit.toFixed(2),
      contribution: contri.toFixed(2),
    };
  });

  contributions.sort((a, b) => b.contribution - a.contribution);

  // ----------------------------- UI --------------------------------------
  return (
    <div style={{ padding: "20px" }}>
      <Navbar />

      <h1 style={{ marginTop: "20px" }}>Product Behaviour & Contribution</h1>

      <form style={{ marginTop: "20px" }}>
        <label><b>Enter number of days:</b></label>
        <input
          type="number"
          value={days}
          placeholder="Enter days"
          onChange={(e) => setDays(e.target.value)}
          style={{ marginLeft: "10px", padding: "6px" }}
        />
      </form>

      <p style={{ marginTop: "20px" }}>
        <b>Total Gross Profit (for last {days || "all"} days): </b> ₹{gross}
      </p>

      <table
        style={{
          width: "80%",
          marginTop: "30px",
          borderCollapse: "collapse",
          margin: "auto",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f0f0f0" }}>
            <th style={cell}>Product</th>
            <th style={cell}>Profit (₹)</th>
            <th style={cell}>Contribution %</th>
          </tr>
        </thead>

        <tbody>
          {contributions.map((c, index) => (
            <tr key={index}>
              <td style={cell}>{c.product}</td>
              <td style={cell}>₹{c.profit}</td>
              <td style={cell}>{c.contribution}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const cell = {
  border: "1px solid #ccc",
  padding: "12px",
  textAlign: "center",
};

export default Behaviour;
