import React, { useEffect, useState } from "react";
import "./Dashboard.css";

import {
  getStoredAuth,
  fetchProgress,
  getCoachingTip
} from "../services/api";

import CoachingCard from "../components/CoachingCard";


function Dashboard() {


  const [progress, setProgress] = useState({

    words:0,
    images:0,
    phrases:0,
    correct:0,
    attempts:0

  });


  const [coachTip,setCoachTip] = useState("");



  useEffect(()=>{


    loadProgress();


  },[]);




  const loadProgress = async()=>{


    try{


      const auth = getStoredAuth();


      if(!auth){
        return;
      }



      const result = await fetchProgress(auth.id);



      setProgress(
        result.data
      );



     const tipResponse = await getCoachingTip(auth.id);

console.log("Coach Response:", tipResponse);

setCoachTip(
  tipResponse.tip || 
  "Keep practicing daily for better communication."
);



    }

    catch(error){


      console.log(
        "Dashboard Error:",
        error
      );


    }


  };





  const accuracy =
    progress.attempts > 0

    ?

    Math.round(
      (progress.correct /
      progress.attempts) * 100
    )

    :

    0;





  return (

    <div className="dashboard-page">


      <h1>
        📊 Progress Dashboard
      </h1>


      <p>
        Track your speech practice improvement.
      </p>




      <div className="stats">


        <div className="stat-card">

          <h2>
            {progress.words}
          </h2>

          <p>
            Words Practiced
          </p>

        </div>




        <div className="stat-card">

          <h2>
            {progress.images}
          </h2>

          <p>
            Images Practiced
          </p>

        </div>




        <div className="stat-card">

          <h2>
            {progress.phrases}
          </h2>

          <p>
            Phrases Practiced
          </p>

        </div>




        <div className="stat-card">

          <h2>
            {accuracy}%
          </h2>

          <p>
            Accuracy
          </p>

        </div>



      </div>





      <div className="progress-box">


        <h2>
          🧠 AI Recovery Progress
        </h2>


        <p>
          Keep practicing daily to improve your communication skills.
        </p>


      </div>




      {
        coachTip &&

        <CoachingCard
          tip={coachTip}
        />

      }




    </div>

  );

}



export default Dashboard;