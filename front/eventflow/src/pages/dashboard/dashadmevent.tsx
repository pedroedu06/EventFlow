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
    const [horarioEvent, setDatatime] = useState("");
    const [local, setLocal] = useState("");
    const [description, setDescription] = useState("");
    const [optionValue, setOptionValue] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) =>{
        setOptionValue(e.target.value)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        setFile(e.target.files[0]);
    }
};

    //axios.get("http://localhost:5000/getEvents")

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

    const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault()
            console.log(optionValue)
            axios.post("http://localhost:5000/registroevento", {
                name,
                dataInicio,
                dataFim,
                horarioEvent,
                local,
                description,
                optionValue
            })
            .then(response => {
                console.log("evento registrado com sucesso", response)
            })
            .catch(error => {
                console.log("evento nao registrado pae", error)
            })

           

            if (!file) {
                console.log("sem arquivo");
                return;
            }

            const formData = new FormData();
            formData.append("file", file)

            
            axios.post("http://localhost:5000/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                    }
                })
                .then(response => {
                    console.log('foi mano', response);
                })
                .catch(error => {
                    console.log("erro ao colocar o arquivo", error)
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

            <div className="janelaModal" onSubmit={handleSubmit}>
            <div className="modalContainer">
                <button className="fechar">X</button>
                    <form className="AdicionarEvento">
                        <input type="text" placeholder="Nome do Evento" onChange={(e:any) => setName(e.target.value)} required/>
                        <div className="date">
                            <label htmlFor="date">Data Inicio: </label>
                            <input type="date" className="dataEvent" onChange={(e:any) => setdataInicio(e.target.value)} required/>
                            <label htmlFor="date">Data Fim: </label>
                            <input type="date" className="dataEvent" onChange={(e:any) => setdataFim(e.target.value)} required/>
                        </div>
                        <div className="dateTime">
                            <label htmlFor="time">Horario: </label>
                            <input type="time" className="horarioEvent" placeholder="Horario de Inicio" onChange={(e:any) => setDatatime(e.target.value)} />
                        </div>
                        <input type="text" placeholder="Local do Evento" onChange={(e:any) => setLocal(e.target.value)} required/>
                        <textarea maxLength={1000} placeholder="Descrição do Evento" className="descricaoEvento" onChange={(e:any) => setDescription(e.target.value)} required></textarea>
                        <select value={optionValue} onChange={handleChange} required>
                            <option value="">Selecione uma opção</option>
                            <option value="Show">Show</option>
                            <option value="Feira">Feira</option>
                            <option value="Workshop">Workshop</option>
                            <option value="Congresso">Congresso</option>
                        </select>
                        <input type="file" placeholder="foto destaque" onChange={handleFileChange}/>
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