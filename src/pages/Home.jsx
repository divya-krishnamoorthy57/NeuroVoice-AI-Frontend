import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { clearAuthSession, getStoredAuth } from "../services/api";

function Home() {

  const navigate = useNavigate();

  useEffect(() => {

    const auth = getStoredAuth();

    if (!auth) {
      navigate("/login", { replace: true });
    }

  }, [navigate]);


  const handleLogout = () => {

    clearAuthSession();

    navigate("/login", {
      replace: true,
    });

  };


  return (
    <div className="home-page">

      <header className="hero-panel">

        <div>

          <p className="eyebrow">
            NeuroVoice AI
          </p>


          <h1>
            Welcome to NeuroVoice AI 👋
          </h1>


          <p className="hero-copy">
            Practice every day to improve your speech,
            pronunciation, and confidence.
          </p>

        </div>


        <button
          className="ghost-btn"
          onClick={handleLogout}
        >
          Logout
        </button>


      </header>



      <div className="cards">


        <div className="card">

          <h2>
            🗣 Speech Training
          </h2>

          <p>
            Practice words, images and phrases with
            instant AI feedback.
          </p>

          <button onClick={() => navigate("/training")}>
            Start Training
          </button>

        </div>



        <div className="card">

          <h2>
            📊 Progress Dashboard
          </h2>

          <p>
            View your completed exercises,
            accuracy and recovery progress.
          </p>

          <button onClick={() => navigate("/dashboard")}>
            View Progress
          </button>

        </div>



        <div className="card">

          <h2>
            🧠 About Aphasia
          </h2>

          <p>
            Learn about aphasia,
            symptoms, treatment and recovery.
          </p>

          <button onClick={() => navigate("/about")}>
            Learn More
          </button>

        </div>


      </div>


    </div>
  );
}


export default Home;