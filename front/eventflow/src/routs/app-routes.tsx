import  { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "../pages/login/login";
import Home from "../pages/home/home";
import Register from "../pages/register/register";
import DashbordEvent from "../pages/dashboard/dashadmevent";


function ProtectedRoute({ children, roleRequired }: { children: JSX.Element; roleRequired: string }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // Se não tiver token ou o cargo não bate, redireciona
  if (!token || userRole !== roleRequired) {
    return <Navigate to="/login" replace />;
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
                <Route path="/dashbordEvent" element={<ProtectedRoute roleRequired="admin"><DashbordEvent /></ProtectedRoute>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes;

