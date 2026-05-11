import {jwtDecode} from "jwt-decode";
export default function getAuthToken(){
    const token=localStorage.getItem("token");
    return token;
}

export const setToken=(token)=>{
    localStorage.setItem("token",token);
}
export const removeToken=()=>{
    localStorage.removeItem("token");
}
export const isTokenValid = ()=>{
    const token=getAuthToken();
    if(!token){
        return false;
    }
    try{
        const decodedToken=jwtDecode(token);
        const currentTime=Date.now()/1000;

        if(decodedToken.exp < currentTime){
            console.log("Session expired");
            removeToken();
            return false;
        }
        return true;
    }
    catch(error){
        console.error("Failed to decode token:", error);
        removeToken();
        return false;
    }
}

export const isTokenExpiringSoon=()=>{
    const token=getAuthToken();

    if(!token){
        return false;
    }
    try{
        const decodedToken=jwtDecode(token);
        const currentTime=Date.now()/1000;
        const timeUntilExpiry=decodedToken.exp-currentTime;
        return timeUntilExpiry < 300 && timeUntilExpiry > 0;
    }
    catch(error){
        console.error("Error during checking token expiry: ",error);
        return false;
    }
}