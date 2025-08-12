import "./register.css";
import { SlArrowLeft } from "react-icons/sl";
import React, { useState } from 'react';
import axios from 'axios';

const Register: React.FC = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("")
    const [errorEmail, setErrorEmail] = useState("");
    const [erroAge, setErrorAge] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("As senhas não coincidem")
            return;
        }
        setError("");

        const dominiosPermitidos: string[] = [
            "gmail.com",
            "yahoo.com",
            "hotmail.com",
            "outlook.com",
            "live.com"
        ];

        if (!dominiosPermitidos.some(dom => email.endsWith(dom))){
            setErrorEmail("Insira um email valido");
            return;
        }
        setErrorEmail("")

        const birthdateveric = (birthdate: string) => {
            const today = new Date();
            const birthdateOBJ = new Date(birthdate);
            let age = today.getFullYear() - birthdateOBJ.getFullYear();
            const mes = today.getMonth() - birthdateOBJ.getMonth();
            if (mes < 0 || (mes === 0 && today.getDate() < birthdateOBJ.getDate())){
                age--;
            }
            return age  
        }

        const age = birthdateveric(birthdate)
        if (age < 18) {
            setErrorAge("Idade invalida");
            return;
        }

        console.log(email, username, password, birthdate);

        axios.post("http://localhost:5000/register", {
            email,
            username,
            birthdate,
            password
        })
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error("Erro ao registrar usuário:", error);
        });
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
                {errorEmail && <span style={{color: 'red'}}>{errorEmail}</span>}
                <label htmlFor="username">Nome de usuário</label>
                <input type="text" placeholder="Insira um nome de usuário" required onChange={(e) => setUsername(e.target.value)}/>
                <label htmlFor="birthdate">Data de nascimento</label>
                <input type="date" placeholder="Insira sua data de nascimento" className="input-data" required onChange={(e) => setBirthdate(e.target.value)}/>
                {erroAge && <span style={{color: 'red'}}>{erroAge}</span>}
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