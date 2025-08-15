import React from "react"
import "./dashadmevent.css"
import { FaTrash } from "react-icons/fa";
import { BsPencilSquare } from "react-icons/bs";
import { FaStar } from "react-icons/fa";
import { FaInfoCircle } from "react-icons/fa";
import axios from 'axios'


const DashbordEvent: React.FC = () => {

    // abertura e fechamento de modal
    const openModal: any = () =>{
        const modal: any = document.querySelector(".janelaModal");
        modal?.classList.add("active");

        modal.addEventListener("click", (e: any) => {
            if (e.target.classList.contains("janelaModal") || e.target.classList.contains("fechar")) {
                modal.classList.remove("active");
            }
        });
    }
    
     return (
        <div className="body">
            
            <nav className="navDashbord">
                <img src="" alt="Dashboard" />
                <a href="/">Voltar para Home</a>
            </nav>
            <div className="contentDashbord">
                <div className="componentsAddEvent">
                    <h2>Eventos</h2>
                    <button className="AddEvent" onClick={openModal}>Adicionar Evento</button>
                </div>
                <div className="seeEvents">
                    <div className="EventComponent">
                        <h2>"nome do evento"</h2>
                        <button className="Detalhes"><FaInfoCircle /></button>
                        <button className="EditEvent"><BsPencilSquare /></button>
                        <button className="DeleteEvent"><FaTrash /></button>
                        <button className="DestaqueEvent"><FaStar/></button>
                    </div>
                </div>
            </div>


            <div className="janelaModal">
            <div className="modalContainer">
                <button className="fechar">X</button>
                    <form className="AdicionarEvento">
                        <input type="text" placeholder="Nome do Evento" />
                        <input type="date" className="dataEvent" />
                        <input type="date" className="dataEvent" />
                        <input type="text" placeholder="Local do Evento" />
                        <textarea placeholder="Descrição do Evento" className="descricaoEvento"></textarea>
                        <select name="">
                            <option value="Show">Show</option>
                            <option value="Feira">Feira</option>
                            <option value="Workshop">Workshop</option>
                            <option value="Congresso">Congresso</option>
                        </select>

                        <button type="submit" className="submitBtn">Adicionar</button>
                    </form>
                    </div>
                </div>

        </div>
     )
}

export default DashbordEvent;