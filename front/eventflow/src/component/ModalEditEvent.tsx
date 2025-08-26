import { useState } from "react"
import axios from "axios";


type Evento = {
    id: number
    nome: string
    dataInicio: string
    dataFim: string
    local: string
    descricao: string
    role: string
}

const editFormModal: React.FC<Evento> = () => {
    const [eventos, setEvento] = useState<Evento[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [eventoSelecionado, setEventoSelecionado] = useState<Evento | null>(null);


    const getbanco = (id: number) => {
        try {
            axios.get(`http://localhost:5000//getEvents/${id}`)
                .then(res => {
                    const resultado = res.data;
                    setEventoSelecionado(resultado);
                })
                .catch(error => {
                    console.log('erro ao listar: ', error);
                })
        }
        catch {
            console.log("banco de dados nao disponivel!")
        }
    }

    const abriModal = (evento: Evento) => {
        setEventoSelecionado(evento)
        setOpenModal(true)
    }

    const fecharModal = () => {
        setOpenModal(false)
        setEventoSelecionado(null)
    }


    return (
        <div className="janelaModalEdit">
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

export default editFormModal