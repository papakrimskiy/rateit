import { useState } from "react";
import "./ProductReviews.css";
import { useNavigate } from "react-router-dom";
import { MoveLeft, Plus, ArrowDownNarrowWide, Smile, Frown } from "lucide-react";


export default function ProductReviews() {
  const navigate = useNavigate();
  const [sort, setSort] = useState("new_desc");
  const [openSort, setOpenSort] = useState(false);

  const product = {
    name: "CMF Phone 2 Pro by Nothing",
    rating: 4.4,
    trend: "up",
    pros: ["Дизайн", "Автономність", "Якість"],
    cons: ["Динамік", "Мікрофон"],
  };

  const reviews = [
    {
      id: 1,
      user: "Ivan",
      date: "5 mon ago",
      rating: 4.5,
      sentiment: "positive",
      text: "Гарний телефон, але звук слабкий і інколи просідає батарея.",
      pros: ["екран", "дизайн"],
      cons: ["звук"],
      scraped: false,
    },
    {
      id: 2,
      user: "Oleh",
      date: "1 year ago",
      rating: 4.2,
      sentiment: "negative",
      text: "Очікував кращу камеру.",
      pros: ["ціна"],
      cons: ["камера"],
      scraped: true,
    },
  ];

  const setSortMode = (mode) => {
    setSort(mode);
    setOpenSort(false);
  };

  return (
    <div className="productPage">

      {/* TOP */}
      <div className="topBar">
        <div className="backBtn" onClick={() => navigate(-1)}>
          <MoveLeft size={28} />
        </div>

        <div className="sortWrapper">
          <div
            className="sortBtn"
            onClick={() => setOpenSort(!openSort)}
          >
            <ArrowDownNarrowWide />
          </div>

          {openSort && (
            <div className="sortDropdown">
              <div onClick={() => setSortMode("new_desc")}>
                New ↓
              </div>
              <div onClick={() => setSortMode("new_asc")}>
                New ↑
              </div>
              <div onClick={() => setSortMode("likes_desc")}>
                Likes ↓
              </div>
              <div onClick={() => setSortMode("likes_asc")}>
                Likes ↑
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PRODUCT */}
      <div className="productCard">
        <div className="productTop">
          <div className="productName">{product.name}</div>

          <div className="rightBlock">
            <div className={`trend ${product.trend}`}>↑</div>

            <div className="ratingBlock">
              <span className="star">★</span>
              <span className="ratingValueBlack">{product.rating}</span>
            </div>
          </div>
        </div>

        <div className="tagsWrapper">
          <div className="tagsRow">
            {product.pros.map((p, i) => (
              <span key={i} className="tag positive">{p}</span>
            ))}
          </div>

          <div className="tagsRow tighter">
            {product.cons.map((c, i) => (
              <span key={i} className="tag negative">{c}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="divider" />

      {/* REVIEWS */}
      <div className="reviewsList">

        {reviews.map((r) => (
          <div key={r.id} className="reviewCard" onClick={() => navigate("/review")}>

            <div className="reviewHeader">

              <div className="avatar" />

              <div className="metaBlock">
                <div className="userName">{r.user}</div>
                <div className="date">{r.date}</div>
              </div>

              <div className="rightMeta">
                <div className="emoji">
                  {r.sentiment === "positive" ?
                    <Smile size={32} color="#1a7f37" />
                    :
                    <Frown size={32} color="#b54708" />}
                </div>

                <div className="ratingBlock">
                  <span className="star">★</span>
                  <span className="ratingValueBlack">{r.rating}</span>
                </div>
              </div>

              {r.scraped && (
                <div className="scrapedBadge">
                  web-scraped
                </div>
              )}

            </div>

            <div className="text">{r.text}</div>

            <div className="tagsWrapper">
              <div className="tagsRow">
                {r.pros.map((p, i) => (
                  <span key={i} className="tag positive">{p}</span>
                ))}
              </div>

              <div className="tagsRow tighter">
                {r.cons.map((c, i) => (
                  <span key={i} className="tag negative">{c}</span>
                ))}
              </div>
            </div>

          </div>
        ))}

      </div>

      <div className="fab" onClick={() => navigate("/create")}>
        <Plus size={30} />
      </div>

    </div>
  );
}