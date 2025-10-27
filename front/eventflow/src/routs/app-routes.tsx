import  { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "../pages/auth/login/login";
import Home from "../pages/home/home";
import Register from "../pages/auth/register/register";
import DashbordEvent from "../pages/app/dashboard/dashadmevent";
import RecuperarSenha from "../pages/auth/recuperarSenha/recuperarSenha";
import Resetsenha from "../pages/app/resetpass/Resetsenha";
import type { JSX } from "react";


function ProtectedRoute({ children, roleRequired }: { children: JSX.Element; roleRequired: string }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token || userRole !== roleRequired) {
    return <Navigate to="/Login" replace />;
  }

  return children;
}

function ProtectRout({children}: {children: JSX.Element;}){
    const token = localStorage.getItem("tokenReset")

    if (!token) {
      return <Navigate to="/recuperarSenha" replace />
    }

    return children
}

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />}/>
                <Route path="/Login" element={<Login />}/>
                <Route path="/Register" element={<Register />}/>
                <Route path="/recuperarSenha" element={<RecuperarSenha />}/>
                <Route path="/dashbordEvent" element={<ProtectedRoute roleRequired="admin"><DashbordEvent /></ProtectedRoute>}/>
                <Route path="/Resetsenha" element={<ProtectRout><Resetsenha /></ProtectRout>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes;

