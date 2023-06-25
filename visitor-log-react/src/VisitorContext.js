
import { useContext } from "react";
import {createContext} from "react";

const VisitorContext = createContext();

export function VisitorProvider({children, value}){
  

  return (
    <VisitorContext.Provider value={value}>
      {children}
    </VisitorContext.Provider>
  );
}

export function useVisitors(){
  return useContext(VisitorContext)
}