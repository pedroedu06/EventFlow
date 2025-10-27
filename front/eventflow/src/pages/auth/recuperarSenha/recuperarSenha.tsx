import { SlArrowLeft } from "react-icons/sl";
import "./recuperarSenha.css"
import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const RecuperarSenha: React.FC = () => {

    const [email, setEmail] = useState("");
    const [number, setNumbers] = useState(Array(6).fill(""));
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
    const [emailsent, setEmailsent] = useState(false)
    const [error, setError] = useState("")
    const navigator = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        axios.post("http://localhost:5000/reset_pass/send_Reset", { email }
        ).then(response => {
            console.log("Response:", response.data);
            setEmailsent(true);
            setError("");
        }).catch(error => {
            console.error("There was an error!", error);
            setError("Nao foi possivel enviar o email")
        }
        )
    }

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();

        const code = number.join('');
        if (code.length < 6){
            alert("tamanho de token invalido")
            return;
        }

        console.log("numeros enviados", code);

        axios.post("http://localhost:5000/reset_pass/verify_token", {
            email,
            code
        }).then(res => {
            localStorage.setItem('email', email)
            localStorage.setItem("tokenReset", code);
            navigator("/Resetsenha")
        }).catch(error => {
            console.log(error)
        })

    }


const backtoLogin = () => {
    window.location.href = "/login"
}

const handleChangeNumbers = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const onlyNumbers = e.target.value.replace(/\D/g, "").slice(0, 1);
    const newValues = [...number]
    newValues[index] = onlyNumbers;
    setNumbers(newValues);
    if (onlyNumbers && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1]?.focus();
    }
}

const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !number[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
    }
};

const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").slice(0, 6).replace(/\D/g, "");
    const pasteArr = paste.split("");
    const newValues = [...number];

    pasteArr.forEach((char, i) => {
        if (i < newValues.length) newValues[i] = char;
    });
    setNumbers(newValues);

    const nextIndex = Math.min(pasteArr.length, 5);
    inputRefs.current[nextIndex]?.focus();
};


return (
    <div>
        <div className="navbar">
            <span className="backlogin" onClick={backtoLogin}><SlArrowLeft /> Voltar</span>
            <img src="" alt="logo" />
        </div>

        <div className="main-container">

            <div className="container-resetpassword">
                <h2>Recuperação de senha</h2>
                {!emailsent ? (
                    <div>
                        {error && <p style={{ color: "red" }}>{error}</p>}
                        <label htmlFor="email">Email: </label>
                        <input type="email" className="email" placeholder="Insira um email" onChange={(e) => setEmail(e.target.value)} />
                        <button type="submit" className="submitValidateBTN" onClick={handleSubmit}>Validar</button>
                    </div>

                ) : (
                    <div className="inputToken">
                        <label htmlFor="token">Insira o código enviado pelo email:</label>
                        <div className="tokenInputs">
                            {number.map((num, i) => (
                                <input
                                    key={i}
                                    id={`token-${i}`}
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={1}
                                    value={num}
                                    onChange={(e) => handleChangeNumbers(e, i)}
                                    onKeyDown={(e) => handleKeyDown(e, i)}
                                    onPaste={handlePaste}
                                    ref={(el) => { inputRefs.current[i] = el }}
                                    className="tokenInput"
                                    autoComplete="one-time-code"
                                />
                            ))}
                        </div>
                        <button type="submit" className="submitValidateBTN" onClick={handleVerify}>Validar</button>
                    </div>
                )}
            </div>

        </div>



    </div>
)}



export default RecuperarSenha;