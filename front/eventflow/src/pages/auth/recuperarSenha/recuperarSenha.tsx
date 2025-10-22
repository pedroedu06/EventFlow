import { SlArrowLeft } from "react-icons/sl";
import "./recuperarSenha.css"
import { useState } from "react";
import axios from "axios";


const RecuperarSenha: React.FC = () => {

    const [email, setEmail] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        axios.post("http://localhost:5000/reset_pass/send_Reset", { email }
        ).then(response => {
            console.log("Response:", response.data);
        }).catch(error => { 
            console.error("There was an error!", error); 
        }
    )}
    
    const backtoLogin = () => {
        window.location.href = "/login"
    }


    return (
        <div>
            <div className="navbar">
                <span className="backlogin" onClick={backtoLogin}><SlArrowLeft /> Voltar</span>
                <img src="" alt="logo" />               
            </div>
            
            <div className="main-container">
                <div className="container-resetpassword">
                    <h2>Recuperação de senha</h2>
                    <label htmlFor="email">Email: </label>
                    <input type="email" className="email" placeholder="Insira um email" onChange={(e) => setEmail(e.target.value)} />
                    <button type="submit" className="submitValidateBTN" onClick={handleSubmit}>Validar</button>
                </div>
            </div>

            

        </div>
    )

}

export default RecuperarSenha;