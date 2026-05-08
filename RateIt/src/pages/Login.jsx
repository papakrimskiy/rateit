import "./Login.css"
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <div className="container">
        <h1 className="title">Вітаємо</h1>

        <div className="inputWrapper">
          <span className="icon">📧</span>
          <input type="email" placeholder="Пошта" />
        </div>

        <div className="inputWrapper">
          <span className="icon">🔒</span>
          <input type="password" placeholder="Пароль" />
        </div>

        <button className="primaryButton" onClick={() => navigate("/home")}>
          Увійти
        </button>

        <div className="or">або</div>

        <button className="googleButton">
          🌐 Увійти через Google
        </button>
      </div>

      <div className="footer">
        RateIt налічує вже 17,023 відгуки
      </div>
    </div>
  )
}