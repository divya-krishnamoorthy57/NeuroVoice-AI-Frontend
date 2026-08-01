import React from "react";
import "./Profile.css";
import { getStoredAuth, getLocalProgress } from "../services/api";

function Profile() {

  const user = getStoredAuth();

  const progress = getLocalProgress();


  const accuracy =
    progress.attempts > 0
      ? Math.round(
          (progress.correct / progress.attempts) * 100
        )
      : 0;


  return (
    <div className="profile-page">

      <div className="profile-card">

        <div className="profile-icon">
          👤
        </div>


        <h1>
          My Profile
        </h1>


        <h2>
          {user?.name || "Friend"}
        </h2>


        <p>
          {user?.email || "No email available"}
        </p>


        <div className="profile-stats">


          <div>
            <h3>{progress.words}</h3>
            <p>Words</p>
          </div>


          <div>
            <h3>{progress.images}</h3>
            <p>Images</p>
          </div>


          <div>
            <h3>{progress.phrases}</h3>
            <p>Phrases</p>
          </div>


          <div>
            <h3>{accuracy}%</h3>
            <p>Accuracy</p>
          </div>


        </div>


        <p className="message">

          Keep practicing every day to improve
          your communication skills 🧠✨

        </p>


      </div>

    </div>
  );
}


export default Profile;