import { useEffect, useState } from "react";
import "./ProductReviews.css";
import { useNavigate, useParams } from "react-router-dom";
import {
  MoveLeft,
  Plus,
  ArrowDownNarrowWide,
  ArrowBigUp,
  ArrowBigDown,
  Smile,
  Meh,
  Frown
} from "lucide-react";
import { API_URL } from "../config";

export default function ProductReviews() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [sort, setSort] = useState("new_desc");
  const [openSort, setOpenSort] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [product, setProduct] = useState(null);
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("uk-UA");
  };

  // 🔥 LOAD DATA
  useEffect(() => {
    refreshReviews();
  }, [id]);

  // 🔥 REFRESH
  const refreshReviews = async () => {
    const res = await fetch(
      `${API_URL}/reviews?productId=${id}`
    );

    const data = await res.json();

    setReviews(data);

    const prod = await fetch(
      `${API_URL}/products/${id}`
    );

    const prodData = await prod.json();

    setProduct(prodData);
  };

  // 🔥 SORTING
  const allPros = reviews.flatMap(r => r.pros || []);
  const allCons = reviews.flatMap(r => r.cons || []);

  const topTags = (arr, limit = 4) => {
    const count = {};

    arr.forEach(t => {
      count[t] = (count[t] || 0) + 1;
    });

    return Object.entries(count)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([tag]) => tag);
  };

  const topPros = topTags(allPros);
  const topCons = topTags(allCons);

  const sortedReviews = [...reviews].sort((a, b) => {

    if (sort === "likes_desc") return b.upvotes - a.upvotes;
    if (sort === "likes_asc") return a.upvotes - b.upvotes;
    if (sort === "new_asc") return a.id - b.id;

    return b.id - a.id;
  });

  const setSortMode = (mode) => {
    setSort(mode);
    setOpenSort(false);
  };

  // 👍 LIKE
  const likeReview = async (reviewId) => {
    await fetch(
      `${API_URL}/reviews/${reviewId}/like`,
      {
        method: "POST"
      }
    );

    refreshReviews();
  };

  // 👎 DISLIKE
  const dislikeReview = async (reviewId) => {
    await fetch(
      `${API_URL}/reviews/${reviewId}/dislike`,
      {
        method: "POST"
      }
    );

    refreshReviews();
  };

  const importReddit = async () => {

    await fetch(
      `${API_URL}/reviews/import-reddit`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          productId: Number(id),
          query: product.name
        })
      }
    );

    refreshReviews();
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="productPage">

      {/* TOP */}
      <div className="topBar">

        <div
          className="backBtn"
          onClick={() => navigate(`/home`)}
        >
          <MoveLeft size={28} />
        </div>

        <button
          onClick={importReddit}
        >
          Import Reddit
        </button>

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

          <div className="productName">
            {product.name}
          </div>

          <div className="rightBlock">

            <div className={`trend ${product.trend}`}>
              {product.trend === "up" ? "↑" : "↓"}
            </div>

            {product.rating != null && (<div className="ratingBlock">
              <span className="star">★</span>

              <span className="ratingValueBlack">
                {product.rating}
              </span>
            </div>
            )}

          </div>

        </div>

        <div className="tagsWrapper">

          {topPros.length > 0 && (
            <div className="tagsRow">
              {topPros.map((t, i) => (
                <span key={i} className="tag positive">
                  {t}
                </span>
              ))}
            </div>
          )}

          {topCons.length > 0 && (
            <div className="tagsRow">
              {topCons.map((t, i) => (
                <span key={i} className="tag negative">
                  {t}
                </span>
              ))}
            </div>
          )}

        </div>


      </div>

      <div className="divider" />

      {/* REVIEWS */}
      <div className="reviewsList">

        {sortedReviews.map((r) => (
          <div
            key={r.id}
            className="reviewCard"
            onClick={() => navigate(`/review/${r.id}`)}
          >

            <div className="reviewHeader">

              <div className="avatar" />

              <div className="metaBlock">
                <div className="userName">{r.user}</div>
                <div className="date">{formatDate(r.date)}</div>
              </div>

              {r.source === "web-scraped" && (
                <div className="scrapedBadge">
                  web-scraped
                </div>
              )}

              <div className="rightMeta">

                <div className="emoji">

                  {r.sentiment === "positive" ? (
                    <Smile size={32} color="#1a7f37" />
                  ) : r.sentiment === "neutral" ? (
                    <Meh size={32} color="#45577e" />
                  ) : (
                    <Frown size={32} color="#b54708" />
                  )}

                </div>

                {r.rating != null && (<div className="ratingBlock">
                    <span className="star">★</span>

                    <span className="ratingValueBlack">
                      {r.rating}
                    </span>
                  </div>
                )}

              </div>

            </div>

            {/* 🔥 LIKE / DISLIKE */}
            <div
              className="actionsRow"
              onClick={(e) => e.stopPropagation()}
            >

              <button onClick={() => likeReview(r.id)}>
                <ArrowBigUp size={20} /> {r.upvotes}
              </button>

              {r.downvotes != null && (
                <button onClick={() => dislikeReview(r.id)}>
                  <ArrowBigDown size={20} /> {r.downvotes}
                </button>
              )}

            </div>

            <div className="text">
              {r.text}
            </div>

            {(r.pros?.length > 0 || r.cons?.length > 0) && (
              <div className="tagsWrapper">

                {r.pros?.length > 0 && (
                  <div className="tagsRow">

                    {r.pros.map((p, i) => (
                      <span key={i} className="tag positive">
                        {p}
                      </span>
                    ))}

                  </div>
                )}

                {r.cons?.length > 0 && (
                  <div className="tagsRow">

                    {r.cons.map((c, i) => (
                      <span key={i} className="tag negative">
                        {c}
                      </span>
                    ))}

                  </div>
                )}

              </div>
            )}

          </div>
        ))}

      </div>

      {/* FAB */}
      <div
        className="fab"
        onClick={() =>
          navigate(`/product/${id}/create`, {
            state: {
              productName: product?.name || ""
            }
          })}
      >
        <Plus size={30} />
      </div>

    </div>
  );
}