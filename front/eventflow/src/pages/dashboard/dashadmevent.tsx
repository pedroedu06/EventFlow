import React, { useState, useEffect } from "react"
import "./dashadmevent.css"
import { MdOutlineArrowBackIos } from "react-icons/md";
import axios from 'axios'
import EventComponent from "../../component/EventComonent";

type Evento = {
    id: number;
    nome: string;
    dataInicio: string;
    dataFinal: string;
    horarioEvent: string;
    local: string;
    description: string;
    role: string;
    onDelete: (id: number) => void
}



const DashbordEvent: React.FC<Evento> = () => {
    const [evento, setEvento] = useState<Evento[]>([]);

    const [name, setName] = useState("");
    const [dataInicio, setdataInicio] = useState("");
    const [dataFim, setdataFim] = useState("");
    const [horarioEvent, setDatatime] = useState("");
    const [local, setLocal] = useState("");
    const [description, setDescription] = useState("");
    const [optionValue, setOptionValue] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [modal, setOpenModal] = useState(false)

    useEffect(() => {
        axios.get("http://localhost:5000/getEvent_MIN")
            .then(res => setEvento(res.data))
            .catch(error => console.log("error: ", error))
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setOptionValue(e.target.value)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleDelete = (id: number) => {
        setEvento(prev => prev.filter(e => e.id !== id))
    }

    // abertura e fechamento de modal
    const openModal = () => setOpenModal(true)
    const closeModal = () => setOpenModal(false)



    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
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

                setEvento((prev) => [...prev, response.data])

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

        closeModal();    
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
                    {evento.map((Evento => (
                        <EventComponent key={Evento.id} {...Evento} onDelete={handleDelete} />
                    )))}
                </div>
            </div>
        {modal && (           
            <div className="janelaModal">
                <div className="modalContainer">
                    <button className="fechar" onClick={closeModal}>X</button>
                    <form className="AdicionarEvento" onSubmit={handleSubmit}>
                        <input type="text" placeholder="Nome do Evento" onChange={(e: any) => setName(e.target.value)} required />
                        <div className="date">
                            <label htmlFor="date">Data Inicio: </label>
                            <input type="date" className="dataEvent" onChange={(e: any) => setdataInicio(e.target.value)} required />
                            <label htmlFor="date">Data Fim: </label>
                            <input type="date" className="dataEvent" onChange={(e: any) => setdataFim(e.target.value)} required />
                        </div>
                        <div className="dateTime">
                            <label htmlFor="time">Horario: </label>
                            <input type="time" className="horarioEvent" placeholder="Horario de Inicio" onChange={(e: any) => setDatatime(e.target.value)} />
                        </div>
                        <input type="text" placeholder="Local do Evento" onChange={(e: any) => setLocal(e.target.value)} required />
                        <textarea maxLength={1000} placeholder="Descrição do Evento" className="descricaoEvento" onChange={(e: any) => setDescription(e.target.value)} required></textarea>
                        <select value={optionValue} onChange={handleChange} required>
                            <option value="">Selecione uma opção</option>
                            <option value="Show">Show</option>
                            <option value="Feira">Feira</option>
                            <option value="Workshop">Workshop</option>
                            <option value="Congresso">Congresso</option>
                        </select>
                        <input type="file" placeholder="foto destaque" onChange={handleFileChange} />
                        <button type="submit" className="submitBtn" >Adicionar</button>
                    </form>
                </div>
            </div>
        )}
        </div>
    )
}

export default DashbordEvent;