import  React,{ useState } from "react"
import "./dashadmevent.css"
import { FaTrash } from "react-icons/fa";
import { BsPencilSquare } from "react-icons/bs";
import { FaStar } from "react-icons/fa";
import { FaInfoCircle } from "react-icons/fa";
import { MdOutlineArrowBackIos } from "react-icons/md";
import axios from 'axios'


const DashbordEvent: React.FC = () => {
    const [name, setName] = useState("");
    const [dataInicio, setdataInicio] = useState("");
    const [dataFim, setdataFim] = useState("");
    const [local, setLocal] = useState("");
    const [description, setDescription] = useState("");
    const [optionValue, setOptionValue] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) =>{
        setOptionValue(e.target.value)
    }

    // abertura e fechamento de modal
    const openModal: any = () =>{
        const modal: any = document.querySelector(".janelaModal");
        modal?.classList.add("active");

        modal.addEventListener("click", (e:any) => {
            if (e.target.classList.contains("janelaModal") || e.target.classList.contains("fechar")) {
                modal.classList.remove("active");
            }
        });
    }

    const destaqueEventEfect = () => {
        const destaqueEfect = document.querySelectorAll(".DestaqueEvent");

        destaqueEfect.forEach((el) => {
            el.addEventListener("click", (e:Event) =>{
                (e.target as HTMLElement).classList.toggle("activeClick")
            })
        })
    }

    const deletElement = () => {
        const deletElement = document.querySelectorAll(".DeleteEvent")

        deletElement.forEach((el) => {
            el.addEventListener("click", (e:Event) => {
                const parent = (e.currentTarget as HTMLElement).closest(".EventComponent");
                parent?.remove();
            })
        })
    }

     return (
        <div className="body">
            
            <nav className="navDashbord">
                <a href="/" className="BacktoHome"><MdOutlineArrowBackIos /> Voltar para Home</a>
                <img src="" alt="Dashboard" />
            </nav>
            <div className="contentDashbord">
                <div className="componentsAddEvent">
                    <h2>Eventos</h2>
                    <input type="text" placeholder="Search" className="SearchEvent" />
                    <button className="AddEvent" onClick={openModal}>Adicionar Evento</button>
                </div>
                <div className="seeEvents">
                    <div className="EventComponent">
                        <h2>"nome do evento"</h2>
                        <div className="detalsBtns">
                            <button className="Detalhes"><FaInfoCircle /></button>
                            <button className="EditEvent"><BsPencilSquare /></button>
                            <button className="DeleteEvent" onClick={deletElement}><FaTrash /></button>
                            <button className="DestaqueEvent" onClick={destaqueEventEfect}><FaStar/></button>
                        </div>
                    </div>
                    <div className="EventComponent">
                        <h2>"nome do evento"</h2>
                        <div className="detalsBtns">
                            <button className="Detalhes"><FaInfoCircle /></button>
                            <button className="EditEvent"><BsPencilSquare /></button>
                            <button className="DeleteEvent" onClick={deletElement}><FaTrash /></button>
                            <button className="DestaqueEvent" onClick={destaqueEventEfect}><FaStar/></button>
                        </div>
                    </div>
                    <div className="EventComponent">
                        <h2>"nome do evento"</h2>
                        <div className="detalsBtns">
                            <button className="Detalhes"><FaInfoCircle /></button>
                            <button className="EditEvent"><BsPencilSquare /></button>
                            <button className="DeleteEvent" onClick={deletElement}><FaTrash /></button>
                            <button className="DestaqueEvent" onClick={destaqueEventEfect}><FaStar/></button>
                        </div>
                    </div>
                    <div className="EventComponent">
                        <h2>"nome do evento"</h2>
                        <div className="detalsBtns">
                            <button className="Detalhes"><FaInfoCircle /></button>
                            <button className="EditEvent"><BsPencilSquare /></button>
                            <button className="DeleteEvent" onClick={deletElement}><FaTrash /></button>
                            <button className="DestaqueEvent" onClick={destaqueEventEfect} ><FaStar/></button>
                        </div>
                    </div>
                    <div className="EventComponent">
                        <h2>"nome do evento"</h2>
                        <div className="detalsBtns">
                            <button className="Detalhes"><FaInfoCircle /></button>
                            <button className="EditEvent"><BsPencilSquare /></button>
                            <button className="DeleteEvent" onClick={deletElement}><FaTrash /></button>
                            <button className="DestaqueEvent" onClick={destaqueEventEfect}><FaStar/></button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="janelaModal">
            <div className="modalContainer">
                <button className="fechar">X</button>
                    <form className="AdicionarEvento">
                        <input type="text" placeholder="Nome do Evento" onChange={(e:any) => setName(e.target.value)}/>
                        <input type="date" className="dataEvent" onChange={(e:any) => setdataInicio(e.target.value)}/>
                        <input type="date" className="dataEvent" onChange={(e:any) => setdataFim(e.target.value)}/>
                        <input type="text" placeholder="Local do Evento" onChange={(e:any) => setLocal(e.target.value)}/>
                        <textarea placeholder="Descrição do Evento" className="descricaoEvento" onChange={(e:any) => setDescription(e.target.value)}></textarea>
                        <select value={optionValue} onChange={handleChange}>
                            <option value="Show">Show</option>
                            <option value="Feira">Feira</option>
                            <option value="Workshop">Workshop</option>
                            <option value="Congresso">Congresso</option>
                        </select>
                        <input type="file" placeholder="foto destaque" />
                        <button type="submit" className="submitBtn">Adicionar</button>
                    </form>
                    </div>
                </div>

                <div className="janelaModal">
                    <div className="modalContainer">
                        <button className="fechar">X</button>
                        <form className="EditarEvento">
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