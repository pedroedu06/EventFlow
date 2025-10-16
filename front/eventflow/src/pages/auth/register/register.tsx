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
    const [errorEmailAddress, setErrorEmailAddress] = useState("");
    const [erroAge, setErrorAge] = useState("");
    const [errorRegister, setErrorRegister] = useState("");

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
            setErrorEmailAddress("Insira um email valido");
            return;
        }
        setErrorEmailAddress("");

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

        //listar usuarios

        axios.get("http://localhost:5000/usuarios")
            .then(response => {
                const usuarios = response.data;
                const usernameExists = usuarios.some((user: any) => user.username === username);
                const emailExists = usuarios.some((user: any) => user.email === email);

                if (usernameExists || emailExists) {
                    setErrorRegister("Email ou Username ja exixtem")
                    return;
                } else {
                    axios.post("http://localhost:5000/register",{
                        email,
                        username,
                        birthdate,
                        password
                    })
                    .then(response => {
                        console.log("Usuario criado com sucesso", response.data);
                        })
                    .catch(error =>{
                        console.error("Erro ao registrar o usuario", error);
                    })    
                }
            })
            .catch(error => {
                console.error("Erro ao listar usuários:", error);
            });
    }

    const backToHome = () => {
        window.location.href = "/";
    }

   return (
    <div>
        <nav className="navbar-register">
        <span className="back-button" onClick={backToHome}><SlArrowLeft /> VOLTAR </span>
        <img src="" alt="logo do site" className="logo-register"/>
        <a href="/login" className="login-button">Login</a>
        </nav>
    <div className="register-container">
            <form className="register-form" onSubmit={handleSubmit}>
                <h2>Registrar</h2>
                {errorRegister && <span style={{color: 'red'}}>{errorRegister}</span>}
                <input type="email" placeholder="Insira um Email" required onChange={(e) => setEmail(e.target.value)}/>
                {errorEmailAddress && <span style={{color: 'red'}}>{errorEmailAddress}</span>}
                <input type="text" placeholder="Insira um nome de usuário" required onChange={(e) => setUsername(e.target.value)}/>
                <label htmlFor="date">Data de nascimento</label>
                <input type="date" placeholder="Insira sua data de nascimento" className="input-data" required onChange={(e) => setBirthdate(e.target.value)}/>
                {erroAge && <span style={{color: 'red'}}>{erroAge}</span>}
                <input type="password" placeholder="Insira sua senha" required onChange={(e) => setPassword(e.target.value)}/>
                <input type="password" placeholder="Confirme a senha" required onChange={(e) => setConfirmPassword(e.target.value)}/>
                {error && <span style={{ color: 'red' }}>{error}</span>}
                
                <button type="submit">Criar usuario</button>
            </form>
    </div>
    </div>
   ) 
}

export default Register;