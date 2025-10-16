import  { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "../pages/auth/login/login";
import Home from "../pages/home/home";
import Register from "../pages/auth/register/register";
import DashbordEvent from "../pages/app/dashboard/dashadmevent";
import RecuperarSenha from "../pages/auth/recuperarSenha/recuperarSenha";


function ProtectedRoute({ children, roleRequired }: { children: JSX.Element; roleRequired: string }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token || userRole !== roleRequired) {
    return <Navigate to="/Login" replace />;
  }

  return children;
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
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes;

