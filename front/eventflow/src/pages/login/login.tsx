import type React from "react";
import { SlArrowLeft } from "react-icons/sl";
import { useState } from 'react';
import "./login.css";


const Login: React.FC = () => {
    
    const backToHome = () => {
        window.location.href = "/";
    }

    return (
        <div>
            <nav className="navbar-register">
                    <img src="" alt="logo do site" className="logo-register"/>
                    <span onClick={backToHome} className="back-button"><SlArrowLeft /> VOLTAR </span>
            </nav>
        <div className="login-container">
            <div className="loginConteiner-Form">
            <form>
                <input type="text" placeholder="Email ou Username" required/>
                <input type="password" placeholder="Senha" required />
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
