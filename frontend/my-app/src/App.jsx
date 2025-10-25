import { useState } from 'react'
import Dashboard from "./components/Dashboard"
import Details from "./components/Details"
import Existing from "./components/Existing"
import Analysis from './components/Analysis'
import Inits from './components/Inits'
import Login from "./components/Login"
import New from './components/New'
import Rems from "./components/Rems"
import Sales from "./components/Sales"
import Trends from "./components/Trends" 
import Pdf from "./components/Pdf"
import "./App.css"

import {BrowserRouter,Routes,Router,Route} from "react-router-dom"
import AppProvider  from "./components/AppContext";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/new" element={<New/>}/>
          <Route path="/details" element={<Details/>}/>
          <Route path="/existing" element={<Existing/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/inits" element={<Inits/>}/>
          <Route path="/sales" element={<Sales/>}/>
          <Route path="/trends" element={<Trends/>}/>
          <Route path="/analysis" element={<Analysis/>}/>
          <Route path="/rems" element={<Rems/>}/>
          <Route path="/pdf" element={<Pdf/>}/>
        </Routes>

      </BrowserRouter>

      </AppProvider>
    </>
  )
}

export default App
