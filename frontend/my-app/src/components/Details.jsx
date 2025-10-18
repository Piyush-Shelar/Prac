import React,{useState,useContext} from "react"
import {useNavigate} from "react-router-dom"
import {UserContext,ShopContext} from "./AppContext"
import axios from "axios"
import "./All.css"

function Details()
{
    const {user}=useContext(UserContext)

    const navigate=useNavigate()
    const[data,setData]=useState(
        {
            shop:"",
            detail:""
        }
    )
    const {details,setDetails}=useContext(ShopContext)
    

    function handleChange(e)
    {
         const {name,value}=e.target 
         setData((prev)=>({...prev,[name]:value}))
    }

    function handleSubmit(e)
    {
        e.preventDefault()
         setDetails([data,...details])
         const payload={...data,user:user}
        
         axios.post("http://localhost:9000/details",payload)
         .then((res)=>{

            console.log(res)
         })
         .catch((err)=>{

            console.log(err)
         })
        navigate("/dashboard")
       
    }


    return(

        <form onSubmit={handleSubmit} className="details">
            <label>Shop name</label>
            <input
            type="text"
            name="shop"
            value={data.shop}
            placeholder="enter name"
            onChange={handleChange}
            />
            <label>Details</label>
            <input
            type="text"
            name="detail"
            value={data.detail}
            placeholder="enter details"
            onChange={handleChange}
            />

            <button type="submit">Submit</button>
        </form>
    )



}
export default Details;