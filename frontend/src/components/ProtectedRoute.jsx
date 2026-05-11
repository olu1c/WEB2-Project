import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isTokenExpiringSoon, isTokenValid } from "../util/auth";
export default function ProtectedRoute({children}){

    const navigate=useNavigate();

    useEffect(()=>{
        if(!isTokenValid()){
            console.log("Redirect to login page.");
            navigate('/');
            return;
        }
        if(isTokenExpiringSoon()){
            console.warn("Your session will expire soon");
        }
        const tokenCheckInterval=setInterval(()=>{
            if(!isTokenValid()){
                console.log("Session expired.Redirecting to login page");
                navigate('/');
                clearInterval(tokenCheckInterval);
            }
            else if(isTokenExpiringSoon()){
                console.warn("Your session will expire soon");

            }
        },60000);
        return () => clearInterval(tokenCheckInterval);
    },[navigate]);
    return isTokenValid() ? children : null;
}