import { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { Search, CircleUserRound, Plus } from "lucide-react";
import { API_URL } from "../config";

export default function Home() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await fetch(`${API_URL}/reviews`);
    const data = await res.json();

    const grouped = {};

    data.forEach(r => {
      if (!grouped[r.productId]) {
        grouped[r.productId] = {
          id: r.productId,
          name: r.productName,
          ratingSum: 0,
          ratingCount: 0,
          count: 0,
          trend: "up",
          reviews: []
        };
      }

      if (r.source !== "web-scraped" && r.rating != null) {
        grouped[r.productId].ratingSum += r.rating;
        grouped[r.productId].ratingCount += 1;
      }
      
      grouped[r.productId].count += 1;
      grouped[r.productId].reviews.push(r);
    });

    const result = Object.values(grouped).map(p => ({
      ...p,
      rating:
        p.ratingCount > 0
          ? (p.ratingSum / p.ratingCount).toFixed(1)
          : null
    }));

    setProducts(result);
  };

  useEffect(() => {
    const handler = () => load();

    window.addEventListener("focus", handler);

    return () => window.removeEventListener("focus", handler);
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

                    {p.rating != null && (
                      <div className="ratingBlock">
                        <span className="star">★</span>
                        <span className="ratingValueBlack">
                          {p.rating}
                        </span>
                      </div>
                    )}

                    <div className="count">
                      {p.count} відгуків
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

                      {p.rating != null && (
                        <div className="ratingBlock">
                          <span className="star">★</span>
                          <span className="ratingValueBlack">
                            {p.rating}
                          </span>
                        </div>
                      )}

                      <div className="count">
                        {p.count} відгуків
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

      {/* FAB */}
        <div
          className="fab"
          onClick={() => navigate("/create-review")}
        >
          <Plus size={30} />
        </div>

    </div>
  );
}