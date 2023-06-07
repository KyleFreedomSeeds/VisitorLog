
import {createContext} from "react";

export const VisitorContext = createContext();

export function VisitorProvider({children, value}){
  

  return (
    <VisitorContext.Provider value={value}>
      {children}
    </VisitorContext.Provider>
  );
}