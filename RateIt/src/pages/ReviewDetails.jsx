import "./ReviewDetails.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MoveLeft,
  Smile,
  Meh,
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
  const [replyTo, setReplyTo] = useState(null);
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("uk-UA");
  };

  // 🔥 LOAD ALL DATA
  useEffect(() => {
    refreshData();
  }, [id]);

  const buildTree = (comments) => {
    const map = {};
    const roots = [];

    comments.forEach(c => {
      map[c.id] = {
        ...c,
        children: []
      };
    });

    comments.forEach(c => {

      if (c.parentId) {
        map[c.parentId]?.children.push(map[c.id]);
      } else {
        roots.push(map[c.id]);
      }

    });

    return roots;
  };

  const treeComments = buildTree(comments);

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
          text: newComment,
          parentId: replyTo?.id
        })
      }
    );

    setNewComment("");
    refreshData();
    setReplyTo(null);
  };

  if (!review) return <div>Loading...</div>;
  // console.log("REVIEW:", review);

  const renderComment = (c, level = 0) => (

    <div
      key={c.id}
      className="comment"
      style={{
        marginLeft: level * 20
      }}
    >

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

        <button
          type="button"
          onClick={() => likeComment(c.id)}
        >
          <ArrowBigUp size={18} /> {c.up}
        </button>

        <button
          type="button"
          onClick={() => dislikeComment(c.id)}
        >
          <ArrowBigDown size={18} /> {c.down}
        </button>

        <button
          type="button"
          onClick={() => setReplyTo(c)}
        >
          <MessageCircle size={18} /> Reply
        </button>

      </div>

      {c.children?.map(child =>
        renderComment(child, level + 1)
      )}

    </div>
  );

  const likeComment = async (id) => {

    await fetch(
      `${API_URL}/comments/${id}/like`,
      {
        method: "POST"
      }
    );

    await refreshData();
  };

  const dislikeComment = async (id) => {

    await fetch(
      `${API_URL}/comments/${id}/dislike`,
      {
        method: "POST"
      }
    );

    await refreshData();
  };



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

        {review.rating != null && (<div className="ratingBlock">
          <span className="star">★</span>

          <span className="rating">
            {review.rating}
          </span>
        </div>
        )} 
        
      </div>      

      {/* TITLE */}
      <div className="titleRow">

        <div className="title">
          {review.title}
        </div>

        <div className="emoji">

          {review.sentiment === "positive" ? (
            <Smile size={32} color="#1a7f37" />
          ) : review.sentiment === "neutral" ? (
            <Meh size={32} color="#45577e" />
          ) : (
            <Frown size={32} color="#b54708" />
          )}

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

          {review.downvotes != null && (<button onClick={dislikeReview}>
            <ArrowBigDown /> {review.downvotes}
          </button>         
                
          )}

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

        {replyTo && (
          <div className="replyInfo">
            Відповідь до {replyTo.user}

            <button onClick={() => setReplyTo(null)}>
              скасувати
            </button>
          </div>
        )}

        <button
          className="commentBtn"
          onClick={addComment}
        >
          Надіслати
        </button>

      </div>

      {/* COMMENTS */}
      <div className="comments">

        {treeComments.map(c => renderComment(c))}

      </div>

    </div>
  );
}