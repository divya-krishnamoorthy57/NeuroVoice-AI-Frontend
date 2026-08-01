import React, { useEffect, useState } from "react";
import "./CoachingCard.css";
import { getCoachingTip } from "../services/api";


function CoachingCard(){

  const [tip,setTip] = useState("");
  const [loading,setLoading] = useState(true);


  useEffect(()=>{


    const loadCoach = async()=>{

      try{


        const response = await getCoachingTip(14);


        console.log(
          "AI COACH RESPONSE:",
          response
        );


        setTip(
          response.tip ||
          "Keep practicing daily!"
        );


      }
      catch(error){

        console.log(
          "Coach Error:",
          error
        );


        setTip(
          "Practice daily to improve communication."
        );

      }


      setLoading(false);

    };


    loadCoach();


  },[]);



  const speakCoach=()=>{

    const speech =
      new SpeechSynthesisUtterance(tip);

    speech.lang="en-US";
    speech.rate=0.8;

    window.speechSynthesis.cancel();

    window.speechSynthesis.speak(speech);

  };



  return(

    <div className="coaching-card">

      <h2>🤖 AI Speech Coach</h2>


      {
      loading ?

      <p>Generating coaching...</p>

      :

      <>

      <p className="coach-text">
        {tip}
      </p>


      <button
      className="coach-btn"
      onClick={speakCoach}
      >
      🔊 Listen to Coach
      </button>

      </>

      }


    </div>

  );

}


export default CoachingCard;