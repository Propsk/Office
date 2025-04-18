'use client'
import { createContext, useContext, useState } from "react"

// Create context with default values
const GlobalContext = createContext({
    unreadCount: 0,
    setUnreadCount: () => {}
});

// Create a provider
export function GlobalProvider({ children }){
    const [unreadCount, setUnreadCount] = useState(0);
    
    const value = {
        unreadCount,
        setUnreadCount
    };
    
    return(
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    )
}

// create a custom hook to access context
export function useGlobalContext() {
    return useContext(GlobalContext);
}