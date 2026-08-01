import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Splash.css";

function Splash() {

  const navigate = useNavigate();


  useEffect(() => {

    const timer = setTimeout(() => {

      navigate("/login");

    }, 5000);


    return () => clearTimeout(timer);

  }, [navigate]);



  return (

    <div className="splash-container">


      <div className="background-circle circle1"></div>
      <div className="background-circle circle2"></div>


      <div className="logo-box">

        <h2 className="logo">
          🧠
        </h2>

      </div>


      <h1>
        NeuroVoice AI
      </h1>


      <p className="tagline">
        Empowering Communication Through Practice
      </p>



      <div className="loader">

        <span></span>
        <span></span>
        <span></span>

      </div>


      <p className="loading-text">
        Loading...
      </p>


    </div>

  );

}


export default Splash;