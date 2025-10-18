import { createContext, useState } from "react";

// Create the context
export const SalesContext = createContext();
export const StockContext=createContext();
export const ShopContext=createContext();
export const UserContext=createContext();

function AppProvider({children}){

// Create provider

  const [sales, setSales] = useState([]);
  const [initstock,setInitstock]=useState([]);
  const [details,setDetails]=useState([])
  const [user,setUser]=useState([])

  return (
    <SalesContext.Provider value={{ sales, setSales }}>
      <StockContext.Provider value={{initstock,setInitstock}}>
        <ShopContext.Provider value={{details,setDetails}}>
          <UserContext.Provider value={{user,setUser}}>
      {children}
           </UserContext.Provider>
         </ShopContext.Provider>
      </StockContext.Provider>
    </SalesContext.Provider>
  );
};

export default AppProvider;

