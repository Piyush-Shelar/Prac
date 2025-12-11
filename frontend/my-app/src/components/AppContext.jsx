import { createContext, useState } from "react";

// Create the context
export const SalesContext = createContext();
export const StockContext=createContext();
export const ShopContext=createContext();
export const UserContext=createContext();
export const InvestContext=createContext();
export const SalesdContext=createContext();
export const GrossContext=createContext()
export const MarginContext=createContext();
export const TrendsContext=createContext();
export const RemContext=createContext();
export const DaysContext=createContext()


function AppProvider({children}){

// Create provider

  const [sales, setSales] = useState([]);
  const [initstock,setInitstock]=useState([]);
  const [details,setDetails]=useState([])
  const [user,setUser]=useState([])
  const [invest,setInvest]=useState([])
  const [salesd,setSalesd]=useState([])
  const [gross,setGross]=useState([])
  const [margin,setMargin]=useState([])
  const [trends,setTrends]=useState([])
  const [rems,setRems]=useState([])

  return (
    <SalesContext.Provider value={{ sales, setSales }}>
      <StockContext.Provider value={{initstock,setInitstock}}>
        <ShopContext.Provider value={{details,setDetails}}>
          <UserContext.Provider value={{user,setUser}}>
            <InvestContext.Provider value={{invest,setInvest}}>
              <SalesdContext.Provider value={{salesd,setSalesd}}>
                <GrossContext.Provider value={{gross,setGross}}>
                  <MarginContext.Provider value={{margin,setMargin}}>
                    <TrendsContext.Provider value={{trends,setTrends}}>
                      <RemContext.Provider value={{rems,setRems}}>
                  
      {children}
                             </RemContext.Provider>
                          </TrendsContext.Provider>

                       </MarginContext.Provider>
                    </GrossContext.Provider>
                 </SalesdContext.Provider>
              </InvestContext.Provider>
           </UserContext.Provider>
         </ShopContext.Provider>
      </StockContext.Provider>
    </SalesContext.Provider>
  );
};

export default AppProvider;

