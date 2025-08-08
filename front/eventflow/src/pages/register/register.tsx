import "./register.css";
import { SlArrowLeft } from "react-icons/sl";

const Register: React.FC = () => {
   return (
    <div>
        <nav className="navbar-register">
        <img src="" alt="logo do site" className="logo-register"/>
        <span role="button"
        className="back-button"
        tabIndex={0}
        onClick={() => {
            addEventListener("click", () =>{
                window.location.href = "/";
            })
        }}
        ><SlArrowLeft /> VOLTAR </span>
        </nav>
    <div className="register-container">
            <form className="register-form">
                <label htmlFor="email">Email</label>
                <input type="email" placeholder="Insira um Email" required/>
                <label htmlFor="username">Nome de usuário</label>
                <input type="text" placeholder="Insira um nome de usuário" required/>
                <label htmlFor="birthdate">Data de nascimento</label>
                <input type="date" placeholder="Insira sua data de nascimento" className="input-data" required/>
                <label htmlFor="password">Senha</label>
                <input type="password" placeholder="Insira sua senha" required/>
                <label htmlFor="confirm-password">Confirme a senha</label>
                <input type="password" placeholder="Confirme a senha" required/>
                <button type="submit">Criar usuario</button>
            </form>
    </div>
    </div>
   ) 
}

export default Register;