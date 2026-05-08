import { useState } from "react"
import "./Home.css"
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { CircleUserRound } from "lucide-react";
import { Plus } from "lucide-react";


export default function Home() {
  const [query, setQuery] = useState("")
  const navigate = useNavigate();

  const products = [
  {
    id: 1,
    name: "CMF Phone 2 Pro by Nothing",
    rating: 4.4,
    trend: "up",
    pros: ["Дизайн", "Автономність", "Якість"],
    cons: ["Динамік", "Мікрофон"]
  },
  {
    id: 2,
    name: "Піцерія Pizza Day",
    rating: 4.6,
    trend: "down",
    pros: ["Смак", "Ціна"],
    cons: ["Очікування", "Сервіс"]
  }
]

  const filtered = products.filter(p =>
  p.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="homePage">

      <div className="topBar">
        <h1 className="title">Відгуки</h1>
        <div className="profileIcon" onClick={() => navigate("/profile")}>
          <CircleUserRound size={32} />
        </div>
      </div>

      {/* Search */}
      <div className="searchBox">
        <span className="searchIcon"><Search size={20}/></span>

        <input
          placeholder="Пошук відгуків"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {query && (
          <span className="clearBtn" onClick={() => setQuery("")}>
            ✕
          </span>
        )}
      </div>

      {/* Results */}
      <div className="feed">
        {query.length === 0 ? null : (
          filtered.length > 0 ? (
            filtered.map(p => (
              <div key={p.id} className="productCard" onClick={() => navigate("/product")}>

                {/* top */}
                <div className="productTop">
                  <div className="productName">{p.name}</div>

                  <div className="rightBlock">
                    <div className={p.trend === "up" ? "trend up" : "trend down"}>
                      {p.trend === "up" ? "↑" : "↓"}
                    </div>

                    <div className="rating">
                      <span className="star">★</span> {p.rating}
                    </div>
                  </div>
                </div>

                {/* pros */}
                <div className="tagsRow">
                  {p.pros.map((tag, i) => (
                    <span key={i} className="tag positive">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* cons */}
                <div className="tagsRow">
                  {p.cons.map((tag, i) => (
                    <span key={i} className="tag negative">
                      {tag}
                    </span>
                  ))}
                </div>

              </div>
            ))
          ) : (
            <div className="empty">Нічого не знайдено</div>
          )
        )}
      </div>
      <div className="fab" onClick={() => navigate("/create")}>
        <Plus size={30} />
      </div>
    </div>
  )
}