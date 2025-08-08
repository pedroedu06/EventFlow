import  { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../pages/login/login";
import Home from "../pages/home/home";
import Register from "../pages/register/register";


const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />}/>
                <Route path="/Login" element={<Login />}/>
                <Route path="/Register" element={<Register />}/>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes;

