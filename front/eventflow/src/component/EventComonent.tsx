import { FaTrash } from "react-icons/fa";
import { BsPencilSquare } from "react-icons/bs";
import { FaStar } from "react-icons/fa";
import { FaInfoCircle } from "react-icons/fa";
import type React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import "../pages/dashboard/dashadmevent.css"
//import openModalEdit from '../pages/dashboard/dashadmevent'

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
};


const EventComponent: React.FC<Evento> = ({ id, nome, onDelete }) => {
    const [event, setEvent] = useState<Evento[]>([]);
    const [selectEvent, setSelectEvent] = useState<Evento | null>(null);
    const [name, setNome] = useState('');
    const [dataInicio, setdataInicio] = useState('');
    const [dataFim, setdataFim] = useState('');
    const [dataTime, setDatatime] = useState("");
    const [local, setLocal] = useState('');
    const [description, setDescription] = useState('');
    const [optionValue, setOptionValue] = useState(selectEvent?.role || '');
    const [openModal, setModalOpen] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setOptionValue(e.target.value);
    }
    
    useEffect(() => {
        axios.get("http://localhost:5000/getEvent_MIN")
            .then(response => {
                setEvent(response.data)
                
            })
            .catch(error => {
                console.log('falha ao ter os eventos', error)
            })
    }, []);

    useEffect(() => {
        if (selectEvent?.horarioEvent) {
            setDatatime(convertTimeToNormal(selectEvent?.horarioEvent));
        }
    }, [selectEvent]);

    const getEventbyid = async (id: number) => {
        axios.get(`http://localhost:5000/getEvents/${id}`)
            .then(res => {
                setSelectEvent(res.data)
                console.log(res.data)
            })
            .catch(error => {
                console.log(error);
            })
    }
    

    const destaqueEventEfect = () => {
        const destaqueEfect = document.querySelectorAll(".DestaqueEvent");

        destaqueEfect.forEach((el) => {
            el.addEventListener("click", (e: Event) => {
                (e.target as HTMLElement).classList.toggle("activeClick")
            })
        })
    }

    const deletElement = () => {
        axios.delete(`http://localhost:5000/deleteEvent/${id}`)
            .then(res => {
                onDelete(id);
            })
            .catch(error => {
                console.log(error);
            })
    }

  
    const handleOpenModal = (id: number) => {
        getEventbyid(id);
        setModalOpen(true)
    }
    const closeModal = () => setModalOpen(false)

    const handleSubmitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectEvent) return;

        const dadosUpdate = {
            name: name || selectEvent.nome,
            dataInicio: dataInicio || selectEvent.dataInicio,
            dataFinal: dataFim || selectEvent.dataFinal,
            horarioEvent: dataTime || selectEvent.horarioEvent,
            local: local || selectEvent.local,
            description: description || selectEvent.description,
            optionValue: optionValue || selectEvent.role
        }  


        axios.put(`http://localhost:5000/admEdit/${selectEvent.id}`, dadosUpdate)
            .then(res => {
                console.log("data atualizada", res)
                return res.data;
            })
            .catch(error => {
                console.log("error ao atualizar", error);
            })
    }

    function convertISOToDate(isoStr: string): string {
        if (!isoStr) return "";
        const date = new Date(isoStr);
        const yyyy = date.getUTCFullYear();
        const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
        const dd = String(date.getUTCDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    }

    function convertTimeToNormal(timeStr: string | null): string {
        if (!timeStr) return "";
        const parts = timeStr.split(":");
        if (parts.length >= 2) {
            const hh = parts[0].padStart(2, "0");
            const mm = parts[1].padStart(2, "0");
            return `${hh}:${mm}`;
        }
        const date = new Date(timeStr);
        const hh = String(date.getUTCHours()).padStart(2, "0");
        const mm = String(date.getUTCMinutes()).padStart(2, "0");
        return `${hh}:${mm}`;
    }

    return (
        <div>
            <div>
                {event.map(event => (
                    <div key={event.id} className="EventComponent">
                        <h2>{event.nome}</h2>
                        <div className="detalsBtns">
                            <button className="Detalhes"><FaInfoCircle /></button>
                            <button className="EditEvent" onClick={() => handleOpenModal(event.id)}><BsPencilSquare /></button>
                            <button className="DeleteEvent" onClick={deletElement}><FaTrash /></button>
                            <button className="DestaqueEvent" onClick={destaqueEventEfect}><FaStar /></button>
                        </div>
                    </div>

                ))}
            </div>


            {openModal && (
                <div className="janelaModal">
                    <div className="modalContainer">
                        <button className="fechar" onClick={closeModal}>X</button>
                        <form className="EditarEvento" onSubmit={handleSubmitEdit}>
                            <h2>Editar Evento</h2>
                            <input type="text" value={name || selectEvent?.nome || ""} onChange={(e: any) => setNome(e.target.value)} />
                            <div className="date">
                                <label htmlFor="date">Data Inicio: </label>
                                <input type="date" className="dataEvent" value={dataInicio || convertISOToDate(selectEvent?.dataInicio || "")} onChange={(e: any) => setdataInicio(e.target.value)} />
                                <label htmlFor="date">Data Fim: </label>
                                <input type="date" className="dataEvent" value={dataFim || convertISOToDate(selectEvent?.dataFinal || "")} onChange={(e: any) => setdataFim(e.target.value)} />
                            </div>
                            <div className="dateTime">
                                <label htmlFor="time">Horario: </label>
                                <input type="time" className="horarioEvent" value={''} onChange={(e: any) => setDatatime(e.target.value)} />
                            </div>
                            <input type="text" placeholder="Local do Evento" value={local || selectEvent?.local || ""} onChange={(e: any) => setLocal(e.target.value)} />
                            <textarea placeholder="Descrição do Evento" value={description || selectEvent?.description || ""} className="descricaoEvento" onChange={(e: any) => setDescription(e.target.value)}></textarea>
                            <select value={optionValue} onChange={handleChange}>
                                <option value="">Selecione um tipo</option>
                                <option value="Show">Show</option>
                                <option value="Feira">Feira</option>
                                <option value="Workshop">Workshop</option>
                                <option value="Congresso">Congresso</option>
                            </select>
                            <button type="submit" className="submitBtn">Editar Evento</button>
                        </form>
                    </div>
                </div>
            )}

        </div>
    )
}



export default EventComponent;