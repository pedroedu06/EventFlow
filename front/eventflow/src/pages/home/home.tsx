import "./home.css";
import { IoIosSearch } from "react-icons/io";
import showteste from "../../assets/showteste.jpeg";
import convesaoteste from "../../assets/convesaoteste.jpeg"
import feiracienciasteste from "../../assets/feiracienciasteste.jpg"

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
                    <p>Eventos em destaque, para mais eventos na aba eventos</p>
                    </div>
                        <div className="event-list">
                            <div className="event-item">
                                <img src={showteste} alt="imagem para mostrar um pouco sobre o evento"/>
                                <div className="event-info">
                                <h2>Show do fulano de tal</h2>
                                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magnam ipsa rerum optio unde iusto nemo eaque corrupti nam quaerat velit placeat asperiores, pariatur, quod non harum atque inventore impedit sint.</p>
                                <button>Participar</button>
                                </div>
                            </div>
                            <div className="event-item">
                                <img src={convesaoteste} alt="imagem para mostrar um pouco sobre o evento"/>
                                <div className="event-info">
                                <h2>Convensao de tecnologia</h2>
                                <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Obcaecati architecto numquam qui omnis. Rem deserunt fugiat nihil quam! Officia saepe rerum debitis suscipit tempore ratione quasi provident ducimus culpa doloremque.</p>
                                <button>Participar</button>
                                </div>
                            </div>
                            <div className="event-item">
                                <img src={feiracienciasteste} alt="imagem para mostrar um pouco sobre o evento"/>
                                <div className="event-info">
                                <h2>Feira de Ciencias Aleatoria</h2>
                                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Atque saepe quidem vero. Voluptates, laboriosam accusantium omnis dolores ut sint eveniet maxime dolore minus dignissimos fuga, illo facilis natus odio quis!</p>
                                <button>Participar</button>
                                </div>
                            </div>
                        </div>    
                </section>

                <div className="footer">
                <footer>
                   
                </footer>  
                </div>     
       </div>
    )
}

export default Home;
