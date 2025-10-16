import type React from "react";
import { SlArrowLeft } from "react-icons/sl";
import { useState } from 'react';
import "./login.css";
import userLogin from "../../../hooks/loginFunc";


const Login: React.FC = () => {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    
    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
        await userLogin(login, password)
    } catch (err: any) {
        setError(err.message)
    }
}
    const backToHome = () => {
        window.location.href = "/";
    }

    return (
        <div>
            <nav className="navbar-register">
                    <span onClick={backToHome} className="back-button"><SlArrowLeft /> VOLTAR </span>
                    <img src="" alt="logo do site" className="logo-register"/>
                    <a href="/register" className="register-button">Registrar</a>
            </nav>
        <div className="login-container">
            <div className="loginConteiner-Form">
            <form onSubmit={handleSubmit}>
                {error && <span className="errormensage" style={{color: 'red'}}>{error}</span>}
                <h2>Login</h2>
                <input type="text" placeholder="Email ou Username" required onChange={(e) => setLogin(e.target.value)}/>
                <input type="password" placeholder="Senha" required onChange={(e) => setPassword(e.target.value)}/>
                <div className="abasdeesqueceuecriar">
                    <a href="">Esqueceu a senha?</a>
                    <a href="/register ">Criar uma conta</a>
                </div>
                <button type="submit">Entrar</button>
            </form>
            </div>
        </div>
        </div>
    )
}

export default Login;
