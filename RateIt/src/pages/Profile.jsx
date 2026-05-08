import "./Profile.css"
import { useNavigate } from "react-router-dom";
import { MoveLeft } from "lucide-react";


export default function Profile() {
  const navigate = useNavigate();

  return (
    <div className="profilePage">

      <div className="backButton" onClick={() => navigate(-1)}>
        <MoveLeft size={28} />
      </div>

      {/* Header */}
      <h1 className="title">Профіль</h1>

      {/* Profile card */}
      <div className="profileCard">

        <div className="profileTop">
          <div className="avatar"></div>

          <div className="nameBlock">
            <div className="name">abcdef</div>
          </div>
        </div>

        <div className="profileBottom">

        <div className="statsRow">
            <div className="statBox">
            <div className="statNumber">2</div>
            <div className="statLabel">відгуки</div>
            </div>

            <div className="statBox">
            <div className="statNumber">31</div>
            <div className="statLabel">корисний</div>
            </div>
        </div>

        <div className="joined">
            Приєднався у листопаді 2025
        </div>

        </div>

      </div>

      {/* Reviews section */}
      <div className="sectionTitle">
        Ваші останні відгуки
      </div>

      <div className="reviewCard">

        <div className="reviewTop">
          <div className="reviewTitle">CMF Phone 2 Pro</div>

          <div className="rating">
            <span className="star">★</span> 4.4
          </div>
        </div>

        <div className="reviewBottom">
          <div>9 користувачів вважають цей відгук корисним</div>
          <div>Коментарі: 2</div>
        </div>

      </div>

      <div className="reviewCard">

        <div className="reviewTop">
          <div className="reviewTitle">Піцерія Pizza Day</div>

          <div className="rating">
            <span className="star">★</span> 4.6
          </div>
        </div>

        <div className="reviewBottom">
          <div>22 користувача вважають цей відгук корисним</div>
          <div>Коментарі: 3</div>
        </div>

      </div>

    </div>
  )
}