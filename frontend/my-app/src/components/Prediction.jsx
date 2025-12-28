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
      setPrediction(res.data);   // ✅ correct way
      console.log(res.data);
      console.log(user)
    })
      .catch((err)=>{console.log(err)})

   }
   
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


    </div>
)


}


export default Prediction;