import React, { useEffect, useState } from "react";
import "./CoachingCard.css";

import {
  getCoachingTip,
  getStoredAuth
} from "../services/api";


function CoachingCard(){

  const [tip,setTip] = useState("");
  const [accuracy,setAccuracy] = useState(0);
  const [loading,setLoading] = useState(true);



  useEffect(()=>{


    const loadCoach = async()=>{

      try{


        const auth = getStoredAuth();


        if(!auth){

          setTip(
            "Please login to view your AI coaching feedback."
          );

          setLoading(false);
          return;

        }



        const response = await getCoachingTip(
          auth.id
        );


        console.log(
          "🤖 AI COACH RESPONSE:",
          response
        );



        setAccuracy(
          response.accuracy || 0
        );


        setTip(
          response.tip ||
          "Keep practicing daily to improve your communication."
        );



      }

      catch(error){


        console.log(
          "Coach Error:",
          error
        );


        setTip(
          "Keep practicing every day. Small steps create big improvements!"
        );


      }


      setLoading(false);


    };



    loadCoach();


  },[]);





  const speakCoach = ()=>{


    if(!("speechSynthesis" in window)){

      return;

    }


    const speech =
      new SpeechSynthesisUtterance(tip);


    speech.lang="en-US";
    speech.rate=0.85;
    speech.pitch=1;


    window.speechSynthesis.cancel();

    window.speechSynthesis.speak(
      speech
    );


  };






  return (

    <div className="coaching-card">


      <h2>
        🤖 AI Speech Coach
      </h2>



      {
        loading ?


        <p>
          Generating coaching...
        </p>


        :


        <>


          <div className="coach-score">

            🎯 Accuracy :

            <strong>
              {accuracy}%
            </strong>

          </div>




          <div className="coach-section">

            <h3>
              ✅ Strength
            </h3>

            <p>
              Your pronunciation accuracy is improving.
              You are developing better speech confidence
              through regular practice.
            </p>

          </div>





          <div className="coach-section">

            <h3>
              📈 Focus
            </h3>

            <p>
              Continue focusing on clear pronunciation,
              correct pacing, and confident speaking.
            </p>

          </div>





          <div className="coach-section">

            <h3>
              🏆 Goal
            </h3>

            <p>
              Improve daily communication skills and
              achieve smoother, more natural speech.
            </p>

          </div>





          <div className="coach-advice">

            <h3>
              💡 Coach's Advice
            </h3>


            <p className="coach-text">
              {tip}
            </p>


          </div>





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