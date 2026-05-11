import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

export default function MainNavigation(){
    return(
        <>
            <NavBar/>
            <main>
                <Outlet/>
            </main>
        </>
    );
}