import "./register.css";
import { SlArrowLeft } from "react-icons/sl";
import React, { useState } from 'react';
import { set, useForm } from "react-hook-form"

const Register: React.FC = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("As senhas não coincidem")
            return;
        }
        setError("");

        setEmail("");
        setUsername("");
        setBirthdate("");
        setPassword("");
        setConfirmPassword("");
    }

     const backToHome = () => {
        window.location.href = "/";
    }

   return (
    <div>
        <nav className="navbar-register">
        <img src="" alt="logo do site" className="logo-register"/>
        <span className="back-button" onClick={backToHome}><SlArrowLeft /> VOLTAR </span>
        </nav>
    <div className="register-container">
            <form className="register-form" onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>
                <input type="email" placeholder="Insira um Email" required onChange={(e) => setEmail(e.target.value)}/>
                <label htmlFor="username">Nome de usuário</label>
                <input type="text" placeholder="Insira um nome de usuário" required onChange={(e) => setUsername(e.target.value)}/>
                <label htmlFor="birthdate">Data de nascimento</label>
                <input type="date" placeholder="Insira sua data de nascimento" className="input-data" required onChange={(e) => setBirthdate(e.target.value)}/>
                <label htmlFor="password">Senha</label>
                <input type="password" placeholder="Insira sua senha" required onChange={(e) => setPassword(e.target.value)}/>
                <label htmlFor="confirm-password">Confirme a senha</label>
                <input type="password" placeholder="Confirme a senha" required onChange={(e) => setConfirmPassword(e.target.value)}/>
                {error && <span style={{ color: 'red' }}>{error}</span>}
                
                <button type="submit">Criar usuario</button>
            </form>
    </div>
    </div>
   ) 
}

export default Register;