import React from "react"
import {Link} from "react-router-dom"
import "./All.css"

function Navbar()
{

  return(

    <nav  className="navbar">
     
      <Link to="/dashboard">Dashboard</Link>
     
      <Link to="/inits" >Initial Stock</Link>
      <Link to="/rems">Remaining Stock</Link>
      <Link to="/sales">Sales</Link>
      <Link to="/trends">Trends</Link>
      <Link to="/analysis">Analysis</Link>
    </nav>


  )
}

export default Navbar;