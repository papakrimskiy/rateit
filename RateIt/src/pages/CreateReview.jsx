import "./CreateReview.css";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { MoveLeft, Paperclip, Star } from "lucide-react";
import { API_URL } from "../config";

export default function CreateReview() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const productNameFromState = location.state?.productName || "";
  const [productName, setProductName] = useState(productNameFromState);

  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);

  const clampRating = (value) => {
    const num = Number(value);

    if (num < 1) return 1;
    if (num > 5) return 5;

    return num;
  };

  const handleSubmit = async () => {
    const res = await fetch(`${API_URL}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        productId: id ? Number(id) : null,
        productName,
        user: "abcdef",
        text,
        rating: clampRating(rating),
        title,
        link
      })
    });

    await res.json();


    if (id) {
      navigate(`/product/${id}`, { replace: true });
    } else {
      navigate("/home", { replace: true });
    }
  };

  return (
    <div className="createPage">

      <div className="topBar">

        <div
          className="backButton"
          onClick={() => {
            if (id) {
              navigate(`/product/${id}`, { replace: true });
            } else {
              navigate("/home", { replace: true });
            }
          }}
        >
          <MoveLeft size={28} />
        </div>

        <div className="attach">
          <Paperclip />
        </div>

      </div>

      <h1 className="title">
        Створити відгук
      </h1>

      {productNameFromState ? (
        <div className="productHint">
          Продукт: {productName}
        </div>
      ) : (
        <input
          className="input"
          placeholder="Назва продукту"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
      )}

      {/* REVIEW TITLE */}
      <input
        className="input"
        placeholder="Введіть назву відгуку"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* LINK */}
      <input
        className="input"
        placeholder="Введіть посилання"
        value={link}
        onChange={(e) => setLink(e.target.value)}
      />

      {/* STARS */}
      <div className="starsPicker">

        {[1, 2, 3, 4, 5].map((star) => (

          <div
            key={star}
            className="starWrapper"
          >

            <div
              className="half left"
              onClick={() => {
                const value = Math.max(1, star - 0.5);
                setRating(clampRating(value));
              }}
            />

            <div
              className="half right"
              onClick={() => setRating(clampRating(star))}
            />

            <Star
              size={26}
              className={
                rating >= star
                  ? "star filled"
                  : rating >= star - 0.5
                    ? "star halfFilled"
                    : "star"
              }
            />

          </div>

        ))}

        <span className="ratingText">
          {rating.toFixed(1)}
        </span>

      </div>

      {/* TEXT */}
      <textarea
        className="textarea"
        placeholder="Введіть текст відгуку"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {/* BUTTON */}
      <button
        className="primaryButton"
        onClick={handleSubmit}
      >
        Створити
      </button>

    </div>
  );
}