import "./CreateReview.css";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { MoveLeft, Paperclip } from "lucide-react";
import { API_URL } from "../config";

export default function CreateReview() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);

  const handleSubmit = async () => {
    const res = await fetch(`${API_URL}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        productId: Number(id),
        user: "abcdef",
        text,
        rating: Number(rating),
        title,
        link
      })
    });

    const data = await res.json();
    console.log("CREATE RESPONSE:", data);

    navigate(`/product/${id}`);
  };

  return (
    <div className="createPage">

      <div className="topBar">

        <div
          className="backButton"
          onClick={() => navigate(-1)}
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

      <input
        className="input"
        placeholder="Введіть назву"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        className="input"
        placeholder="Введіть посилання"
        value={link}
        onChange={(e) => setLink(e.target.value)}
      />

      <input
        className="input"
        type="number"
        min="1"
        max="5"
        step="0.1"
        placeholder="Оцінка (1-5)"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
      />

      <textarea
        className="textarea"
        placeholder="Введіть текст відгуку"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        className="primaryButton"
        onClick={handleSubmit}
      >
        Створити
      </button>

    </div>
  );
}