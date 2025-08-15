import  { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../pages/login/login";
import Home from "../pages/home/home";
import Register from "../pages/register/register";
import DashbordEvent from "../pages/dashboard/dashadmevent";


const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />}/>
                <Route path="/Login" element={<Login />}/>
                <Route path="/Register" element={<Register />}/>
                <Route path="/dashbordEvent" element={<DashbordEvent />}/>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes;

