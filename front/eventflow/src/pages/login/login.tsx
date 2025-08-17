import type React from "react";
import { SlArrowLeft } from "react-icons/sl";
import { useState } from 'react';
import "./login.css";
import axios from "axios";


const Login: React.FC = () => {
    const [loginForm, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    
    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
        axios.post("http://localhost:5000/login", {
            loginForm,
            password
        })
        .then(response =>{
            if (response.data.error){
                setError(response.data.error)
            }else {
                console.log("login confirmado");
                setError("")
            }
        })
        .catch(error => {
            console.log("erro ao logar", error)
            setError("Usuario ou Email nao encontrado, Crie uma conta")
        })       
    }
    
    const backToHome = () => {
        window.location.href = "/";
    }

    return (
        <div>
            <nav className="navbar-register">
                    <img src="" alt="logo do site" className="logo-register"/>
                    <span onClick={backToHome} className="back-button"><SlArrowLeft /> VOLTAR </span>
                    <a href="/register" className="register-button">Registrar</a>
            </nav>
        <div className="login-container">
            <div className="loginConteiner-Form">
            <form onSubmit={handleSubmit}>
                {error && <span className="errormensage" style={{color: 'red'}}>{error}</span>}

                <label htmlFor="Email">Email ou Senha</label>
                <input type="text" placeholder="Email ou Username" required onChange={(e) => setLogin(e.target.value)}/>
                <label htmlFor="passwo">Senha</label>
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
