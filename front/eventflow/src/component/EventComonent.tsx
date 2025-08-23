import { FaTrash } from "react-icons/fa";
import { BsPencilSquare } from "react-icons/bs";
import { FaStar } from "react-icons/fa";
import { FaInfoCircle } from "react-icons/fa";
import type React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import "../pages/dashboard/dashadmevent.css"

interface Evento {
    id: number;
    nome: string;
    onDelete: (id: number) => void
}

const EventComponent: React.FC<Evento> = ({id, nome, onDelete}) => {
    const [event, setEvent] = useState<Evento[]>([]);

    useEffect(() => {
        axios.get("http://localhost:5000/getEvent_MIN")
            .then(response => {
                setEvent(response.data)
            })
            .catch(error => {
                console.log('falha ao ter os eventos', error)
            })
    }, []);

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
        return (
            <div>
                {event.map(event => (
                    <div key={event.id} className="EventComponent">
                        <h2>{event.nome}</h2>
                        <div className="detalsBtns">
                            <button className="Detalhes"><FaInfoCircle /></button>
                            <button className="EditEvent"><BsPencilSquare /></button>
                            <button className="DeleteEvent" onClick={deletElement}><FaTrash /></button>
                            <button className="DestaqueEvent" onClick={destaqueEventEfect}><FaStar /></button>
                        </div>
                    </div>

                ))}
            </div>
        )
    }



    export default EventComponent;