import { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { Search, CircleUserRound } from "lucide-react";
import { API_URL } from "../config";

export default function Home() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="homePage">

      <div className="topBar">
        <h1 className="title">Відгуки</h1>

        <div
          className="profileIcon"
          onClick={() => navigate("/profile")}
        >
          <CircleUserRound size={32} />
        </div>
      </div>

      <div className="searchBox">

        <span className="searchIcon">
          <Search size={20} />
        </span>

        <input
          placeholder="Пошук продуктів..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {query && (
          <span className="clearBtn" onClick={() => setQuery("")}>
            ✕
          </span>
        )}
      </div>

      <div className="feed">

        {query.length === 0 && (
          <>
            <div className="sectionTitle">
              Популярні продукти
            </div>

            {products.map(p => (
              <div
                key={p.id}
                className="productCard"
                onClick={() => navigate(`/product/${p.id}`)}
              >

                <div className="productTop">

                  <div className="productName">
                    {p.name}
                  </div>

                  <div className="rightBlock">

                    <div className={`trend ${p.trend}`}>
                      {p.trend === "up" ? "↑" : "↓"}
                    </div>

                    <div className="rating">
                      ★ {p.rating}
                    </div>

                  </div>

                </div>

              </div>
            ))}
          </>
        )}

        {query.length > 0 && (
          <>
            <div className="sectionTitle">
              Результати пошуку
            </div>

            {filtered.length > 0 ? (
              filtered.map(p => (
                <div
                  key={p.id}
                  className="productCard"
                  onClick={() => navigate(`/product/${p.id}`)}
                >

                  <div className="productTop">

                    <div className="productName">
                      {p.name}
                    </div>

                    <div className="rightBlock">

                      <div className={`trend ${p.trend}`}>
                        {p.trend === "up" ? "↑" : "↓"}
                      </div>

                      <div className="rating">
                        ★ {p.rating}
                      </div>

                    </div>

                  </div>

                </div>
              ))
            ) : (
              <div className="empty">
                Нічого не знайдено
              </div>
            )}
          </>
        )}

      </div>

    </div>
  );
}