import {useState,useEffect} from "react"
import Navbar from "./Navbar";
import {useContext} from "react"

import {ShopContext,UserContext} from "./AppContext"
import axios from "axios"


const Dashboard = () => {

  const [details,setDetails]=useState([])
  const {user}=useContext(UserContext)
  console.log(user)

  //const {details}=useContext(ShopContext)

  useEffect(()=>
  {axios.get(`http://localhost:9000/details?user=${user}`)
  .then((res)=>{

    console.log(res)
    setDetails(res.data)
  })
  .catch((err)=>{

    console.log(err)
  })
},[])
  
  console.log(details)
  
  
  
  return (
    <div className="flex h-screen">
      {/* Navbar on left */}
      <Navbar />

      {/* Main content */}
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p className="text-gray-600">
          Welcome Vendor!
        </p>
        {details.map((item,index)=>(
          <div key={index}>
          <p>Shop:{item.shop}</p>
          <p>{item.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;