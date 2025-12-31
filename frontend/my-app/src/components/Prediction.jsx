import React,{useState,useEffect,useContext} from "react"
import { UserContext } from "./AppContext"
import axios from "axios"
import Navbar from "./Navbar"




function Prediction()
{

   const [days,setDays]=useState("")
   const [prediction,setPrediction]=useState([])
   const {user}=useContext(UserContext)

   function handleChange(e)
   {
      setDays(e.target.value)
   }

   function handleSubmit(e)
   {  e.preventDefault()
      axios.post("http://127.0.0.1:5000/predict",{days:days,user:user})
      .then((res) => {
      setPrediction(res.data.prediction);   // ✅ correct way
      console.log(res.data);
      console.log(user)
    })
      .catch((err)=>{console.log(err)})

   }
   useEffect(()=>{
    
    console.log(prediction)

   },[prediction])
return(

    <div>
        <Navbar />
        <form onSubmit={handleSubmit}>
            <label>Enter number of days:</label>
            <input
            type="number"
            placeholder="number of days"
            name="days"
            value={days}
            onChange={handleChange}
           
            />
            <button type="submit">Enter</button>

        </form>
        <div className="entry-container">
  <div className="entry-right">
    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th>Predicted Quantity</th>
          <th>Predicted Total Sales</th>
        </tr>
      </thead>

      <tbody>
        {Object.keys(prediction).length === 0 ? (
          <tr>
            <td colSpan="3" className="text-center p-3 text-gray-500">
              No prediction available
            </td>
          </tr>
        ) : (
          Object.entries(prediction).map(([product, data], i) => (
            <tr key={i}>
              <td>{product}</td>
              <td>{data.total_quantity}</td>
              <td>{data.total_sales}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
</div>



    </div>
)


}


export default Prediction;