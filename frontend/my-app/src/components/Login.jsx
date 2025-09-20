import React,{useState} from "react"
import {useNavigate} from "react-router-dom"
import "./All.css"

function Login()
{

    const navigate=useNavigate()

    
    

    return(

        <form className="login">
            <button type="button" onClick={()=>navigate("/new")} style={{backgroundColor:"yellow"}}>New User</button>
            <button type="button" onClick={()=>navigate("/existing")} style={{backgroundColor:"lightgreen"}}>Existing User</button>
        </form>
    )


}


export default Login;