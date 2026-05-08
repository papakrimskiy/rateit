import "./ReviewDetails.css";
import { useNavigate } from "react-router-dom";
import { MoveLeft } from "lucide-react";
import { Smile, Frown, ArrowBigUp, ArrowBigDown, MessageCircle } from "lucide-react";


export default function ReviewDetails() {
  const navigate = useNavigate();
  const review = {
    title: "CMF Phone 2 Pro by Nothing",
    user: "Ivan",
    date: "5 mon ago",
    rating: 4.5,
    sentiment: "positive",
    link: "https://example.com",
    text: "Дуже хороший телефон за свою ціну. Є питання до звуку, але загалом враження позитивні.",
    summary: "Хороший баланс ціни та якості, але слабкий звук.",
    pros: ["дизайн", "екран"],
    cons: ["звук"],
    upvotes: 12,
    downvotes: 3,
    commentsCount: 2,
  };

  const comments = [
    {
      id: 1,
      user: "Oleh",
      date: "2 mon ago",
      text: "Погоджуюсь, звук реально слабкий",
      up: 3,
      down: 0,
      replies: 1,
    },
    {
      id: 2,
      user: "Anna",
      date: "1 mon ago",
      text: "Для мене нормальний звук як за ці гроші",
      up: 2,
      down: 1,
      replies: 0,
    },
  ];

  return (
    <div className="reviewPage">

      {/* BACK */}
      <div className="backBtn" onClick={() => navigate(-1)}>
        <MoveLeft size={28} />
      </div>

      {/* HEADER */}
      <div className="header">
        <div className="avatar" />

        <div className="meta">
          <div className="user">{review.user}</div>
          <div className="date">{review.date}</div>
        </div>

        <div className="ratingBlock">
          <span className="star">★</span>
          <span className="rating">{review.rating}</span>
        </div>
      </div>

      {/* TITLE + EMOJI */}
      <div className="titleRow">
        <div className="title">{review.title}</div>
        <div className="emoji">
          {review.sentiment === "positive" ?
            <Smile size={32} color="#1a7f37" />
            :
            <Frown size={32} color="#b54708" />}
        </div>
      </div>

      {/* LINK */}
      <div className="link">Link</div>

      {/* TEXT */}
      <div className="text">{review.text}</div>

      {/* SUMMARY */}
      <div className="summary">
        <span className="summaryLabel">AI summary:</span> {review.summary}
      </div>

      {/* FEATURES */}
      <div className="tagsWrapper">
        <div className="tagsRow">
          {review.pros.map((p, i) => (
            <span key={i} className="tag positive">{p}</span>
          ))}
        </div>

        <div className="tagsRow">
          {review.cons.map((c, i) => (
            <span key={i} className="tag negative">{c}</span>
          ))}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="actionsRow">

        <div className="voteBox">
          <span><ArrowBigUp /> {review.upvotes}</span>
          <span><ArrowBigDown /> {review.downvotes}</span>
        </div>

        <div className="commentBox">
          <span><MessageCircle /> {review.commentsCount}</span>
        </div>

      </div>

      {/* DIVIDER */}
      <div className="divider" />

      {/* COMMENTS */}
      <div className="comments">

        {comments.map((c) => (
          <div key={c.id} className="comment">

            <div className="commentHeader">
              <div className="avatar small" />

              <div className="meta">
                <div className="user">{c.user}</div>
                <div className="date">{c.date}</div>
              </div>
            </div>

            <div className="commentText">{c.text}</div>

            <div className="commentActions">
              <span><ArrowBigUp /> {c.up}</span>
              <span><ArrowBigDown /> {c.down}</span>
              <span><MessageCircle /> {c.replies}</span>
              <span className="reply">Відповісти</span>
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}