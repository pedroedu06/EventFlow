import axios from "axios";
import "./reset-senha.css"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Resetsenha: React.FC = () => {
    const [newPass, setNewpass] = useState("")
    const [confirmNewpass, setConfirmnewpass] = useState("")
    const [error, setError] = useState("")
    const Navigate = useNavigate()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (newPass !== confirmNewpass) {
            setError("as senhas nao se considem")
            return
        } setError("")

        const email = localStorage.getItem('email');
        axios.post("http://localhost:5000/reset_pass/changePass", { email, newPass })
        .then(res => {
            console.log("sucesso")
            localStorage.removeItem('email');
            Navigate('/login')
        })
        .catch(error => {
            console.error("nao foi possivel enviar", error)
        })


    }

    return (
        <div>
            <div className="navbar">
                <p>Reiniciar a senha</p>
                <img src="" alt="logo" />
            </div>
            <div className="changepassConteiner">
                <form className="changepassMain" onSubmit={handleSubmit}>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <label htmlFor="newPassword">Insira a nova senha: </label>
                    <input type="password" name="newPassword" className="newPassword" placeholder="Nova senha" onChange={(e) => setNewpass(e.target.value)} />
                    <label htmlFor="">Confirme a nova senha: </label>
                    <input type="password" name="newPassword" className="newPassword" placeholder="Confirme a nova senha" onChange={(e) => setConfirmnewpass(e.target.value)} />
                    <button type="submit" className="submitValidateBTN" >Validar</button>
                </form>
            </div>

        </div>
    )

}

export default Resetsenha
