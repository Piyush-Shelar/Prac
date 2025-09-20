import React,{useState} from "react"
import {useNavigate} from "react-router-dom"
import "./All.css"

function New()
{
    const navigate=useNavigate()
    const[data,setData]=useState(
        {
             username:"",
             pswrd:"",
             cpswrd:""
        }
    )

    function handleChange(e)
    {
          const {name,value}=e.target
          
            setData((prev)=>({...prev,[name]:value}))
          
    }
    function handleSubmit(e)
    {
        e.preventDefault()
        if(data.username.length<6)
          {
           
                alert("Username should have atleast 6 characters")
                setData((prev) => ({ ...prev, username:"" }));
                
            
          }
         
            else if(!/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%&]).{6,}$/.test(data.cpswrd)) {
              alert("Password must have at least 6 characters, including uppercase, lowercase, number, and special character");
              setData((prev) => ({ ...prev, pswrd: "", cpswrd: "" }));
             }

          
          else{
        navigate("/details")}
    }

return(

    <form onSubmit={handleSubmit} className="new">
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
        type="password"
        name="pswrd"
        value={data.pswrd}
        placeholder="enter password"
        onChange={handleChange}
        />
        <label>Confirm Password</label>
        <input
        type="password"
        name="cpswrd"
        value={data.cpswrd}
        placeholder="enter confirm password"
        onChange={handleChange}
        />
        <button type="submit" style={{backgroundColor:"lightgreen"}}>Submit</button>
    </form>



)


}
export default New;