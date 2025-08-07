import "./home.css";
import { IoIosSearch } from "react-icons/io";
import showteste from "../../assets/showteste.jpeg";

const Home: React.FC = () => {
    return (
        <div>
            <nav className="navbar">
                <div className="logo">
                    <img src="" alt="EventFlow logo" />
                    <span>EventFlow</span>
                </div>
                <div className="search-bar">
                    <span className="search-icon"><IoIosSearch /></span>
                    <input type="text" placeholder="Buscar eventos..." />
                </div>
                <ul className="nav-buttons">
                    <li><a href="/">Home</a></li>
                    <li><a href="/eventos">Eventos</a></li>
                </ul>
                <ul className="login-buttons">
                    <li><a href="/login" className="login-button">Login</a></li>
                    <li><a href="/register" className="register-button">Registrar</a></li>
                </ul>
            </nav>
                <section className="highlight-section">
                    <div className="description-area">
                    <h1>Eventos em Destaque</h1>
                    <p>Descubra os eventos mais populares e participe da diversão!</p>
                    </div>
                        <div className="event-list">
                            <div className="event-item">
                                <img src={showteste} alt="imagem para mostrar um pouco sobre o evento"/>
                                <h2>Evento 1</h2>
                                <p>Descrição do Evento 1</p>
                                <button>Participar</button>
                            </div>
                            <div className="event-item">
                                <img src="" alt="imagem para mostrar um pouco sobre o evento"/>
                                <h2>Evento 2</h2>
                                <p>Descrição do Evento 2</p>
                                <button>Participar</button>
                            </div>
                            <div className="event-item">
                                <img src="" alt="imagem para mostrar um pouco sobre o evento"/>
                                <h2>Evento 3</h2>
                                <p>Descrição do Evento 3</p>
                                <button>Participar</button>
                            </div>
                        </div>    
                </section>             
                <footer>
                    <p>&copy; 2023 EventFlow. Todos os direitos reservados.</p>
                </footer>       
       </div>
    )
}

export default Home;
