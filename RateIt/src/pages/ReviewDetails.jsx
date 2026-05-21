import "./ReviewDetails.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MoveLeft,
  Smile,
  Frown,
  ArrowBigUp,
  ArrowBigDown,
  MessageCircle
} from "lucide-react";
import { API_URL } from "../config";

export default function ReviewDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [review, setReview] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("uk-UA");
  };

  // 🔥 LOAD ALL DATA
  useEffect(() => {
    refreshData();
  }, [id]);

  // 🔥 REFRESH
  const refreshData = async () => {

    const reviewRes = await fetch(
      `${API_URL}/reviews/${id}`
    );

    const reviewData = await reviewRes.json();

    setReview(reviewData);
    console.log("REVIEW DETAILS:", reviewData);

    const commentsRes = await fetch(
      `${API_URL}/comments?reviewId=${id}`
    );

    const commentsData = await commentsRes.json();

    setComments(commentsData);
  };

  // 👍 LIKE REVIEW
  const likeReview = async () => {
    const res = await fetch(
      `${API_URL}/reviews/${id}/like`,
      {
        method: "POST"
      }
    );

    const data = await res.json();

    setReview(data);
  };

  // 👎 DISLIKE REVIEW
  const dislikeReview = async () => {
    const res = await fetch(
      `${API_URL}/reviews/${id}/dislike`,
      {
        method: "POST"
      }
    );

    const data = await res.json();

    setReview(data);
  };

  // 💬 ADD COMMENT
  const addComment = async () => {

    if (!newComment.trim()) return;

    await fetch(
      `${API_URL}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          reviewId: Number(id),
          user: "Ivan",
          text: newComment
        })
      }
    );

    setNewComment("");

    refreshData();
  };

  if (!review) return <div>Loading...</div>;
  // console.log("REVIEW:", review);

  return (
    <div className="reviewPage">

      {/* BACK */}
      <div
        className="backBtn"
        onClick={() => navigate(-1)}
      >
        <MoveLeft size={28} />
      </div>

      {/* HEADER */}
      <div className="header">

        <div className="avatar" />

        <div className="meta">
          <div className="user">
            {review.user}
          </div>

          <div className="date">
            {formatDate(review.date)}
          </div>
        </div>

        <div className="ratingBlock">
          <span className="star">★</span>

          <span className="rating">
            {review.rating}
          </span>
        </div>

      </div>

      {/* TITLE */}
      <div className="titleRow">

        <div className="title">
          {review.title}
        </div>

        <div className="emoji">
          {review.sentiment === "positive"
            ? <Smile size={32} color="#1a7f37" />
            : <Frown size={32} color="#b54708" />
          }
        </div>

      </div>

      {/* LINK */}
      <a
        className="link"
        href={review.link}
        target="_blank"
      >
        Перейти
      </a>

      {/* TEXT */}
      <div className="text">
        {review.text}
      </div>

      <div className="tagsWrapper">

        {review.summary && (
          <div className="summary">
            {review.summary}
          </div>
        )}

        <div className="tagsRow">

          {review.pros?.map((p, i) => (
            <span key={i} className="tag positive">
              {p}
            </span>
          ))}

          {review.cons?.map((c, i) => (
            <span key={i} className="tag negative">
              {c}
            </span>
          ))}

        </div>

      </div>

      {/* ACTIONS */}
      <div className="actionsRow">

        <div className="voteBox">

          <button onClick={likeReview}>
            <ArrowBigUp /> {review.upvotes}
          </button>

          <button onClick={dislikeReview}>
            <ArrowBigDown /> {review.downvotes}
          </button>

        </div>

        <div className="commentBox">
          <MessageCircle /> {review.commentsCount}
        </div>

      </div>

      <div className="divider" />

      {/* ADD COMMENT */}
      <div className="addComment">

        <textarea
          className="commentInput"
          placeholder="Написати коментар..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />

        <button
          className="commentBtn"
          onClick={addComment}
        >
          Надіслати
        </button>

      </div>

      {/* COMMENTS */}
      <div className="comments">

        {comments.map((c) => (
          <div key={c.id} className="comment">

            <div className="commentHeader">

              <div className="avatar small" />

              <div className="meta">

                <div className="user">
                  {c.user}
                </div>

                <div className="date">
                  {formatDate(c.date)}
                </div>

              </div>

            </div>

            <div className="commentText">
              {c.text}
            </div>

            <div className="commentActions">

              <span>
                <ArrowBigUp /> {c.up}
              </span>

              <span>
                <ArrowBigDown /> {c.down}
              </span>

              <span>
                <MessageCircle /> {c.replies}
              </span>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}