import React,{useState} from "react"
import {useNavigate} from "react-router-dom"
import "./All.css"

function Existing()
{

    const navigate=useNavigate()

    const[data,setData]=useState(
        {
            username:"",
            pswrd:""
        }
    )

    function handleChange(e)
    {
          const {name,value}=e.target 
          setData ((prev)=>({...prev,[name]:value}))
    }

    function handleSubmit(e)
    {    e.preventDefault()
        navigate("/dashboard")
    }

   return(

    <form onSubmit={handleSubmit} className="exist">
        <label>Username</label>
        <input
        type="text"
        name="username"
        value={data.username}
        placeholder="enter username"
        onChange={handleChange}
        />
        <label>Password</label>
        <input
        type="text"
        name="pswrd"
        value={data.pswrd}
        placeholder="enter password"
        onChange={handleChange}
        />

        <button  type="submit">Submit</button>
    </form>




   )

}
export default Existing;