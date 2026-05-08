import "./CreateReview.css"
import { useNavigate } from "react-router-dom";
import { MoveLeft } from "lucide-react";
import { Paperclip } from "lucide-react";


export default function CreateReview() {
  const navigate = useNavigate();

  return (
    <div className="createPage">

      {/* Top bar */}
      <div className="topBar">
        <div className="backButton" onClick={() => navigate(-1)}>
          <MoveLeft size={28} />
        </div>
        <div className="attach">
          <Paperclip />
        </div>
      </div>

      {/* Title */}
      <h1 className="title">Створити відгук</h1>

      {/* Inputs */}
      <input
        className="input"
        placeholder="Введіть назву"
      />

      <input
        className="input"
        placeholder="Введіть посилання"
      />

      <textarea
        className="textarea"
        placeholder="Введіть текст відгуку"
      />

    </div>
  )
}