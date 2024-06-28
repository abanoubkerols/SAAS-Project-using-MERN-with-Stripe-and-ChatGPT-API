import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";
import { checkAuth } from "../apis/users/userApi";

export const AuthContext = createContext()

export const AuthProvider = ({children})=>{
    const [isAuthenticated , setIsAuthenticated] = useState(false)
    const {isError ,isLoading ,data, isSuccess} =  useQuery({queryFn : checkAuth , queryKey :['checkAuth']})


    useEffect(()=>{
      if(data){
        setIsAuthenticated(data)
      }
    } ,[data , isSuccess ])


    const login = ()=>{
        setIsAuthenticated(true)
    }


    const logout = ()=>{
        setIsAuthenticated(false)
    }

    return (
        <AuthContext.Provider value={{isAuthenticated , isError , isSuccess , isLoading  , login , logout}}>
            {children}
        </AuthContext.Provider>

    )
}

export const useAuth = ()=>{
    return useContext(AuthContext)
}