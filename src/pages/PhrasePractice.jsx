import React, { useState } from "react";
import "./PhrasePractice.css";

import {
  checkSpeech,
  saveProgress,
  getStoredAuth,
} from "../services/api";


function PhrasePractice() {

  const phrases = [
    "Good morning",
    "How are you",
    "I am fine",
    "Thank you",
    "Please help me",
    "I need water",
    "I want food",
    "I am hungry",
    "I am thirsty",
    "My name is Divya",
    "Nice to meet you",
    "Can you help me",
    "Please say it again"
  ];


  const [index, setIndex] = useState(0);
  const [spokenText, setSpokenText] = useState("");
  const [result, setResult] = useState(null);
  const [listening, setListening] = useState(false);


  const currentPhrase = phrases[index];


  // AI reads phrase
  const listenPhrase = () => {

    const speech =
      new SpeechSynthesisUtterance(
        currentPhrase
      );

    speech.lang = "en-US";
    speech.rate = 0.8;

    window.speechSynthesis.cancel();

    window.speechSynthesis.speak(
      speech
    );
  };



  // AI feedback voice
  const speakFeedback = (message) => {

    const speech =
      new SpeechSynthesisUtterance(
        message
      );

    speech.lang = "en-US";
    speech.rate = 0.9;
    speech.pitch = 1;

    window.speechSynthesis.cancel();

    window.speechSynthesis.speak(
      speech
    );
  };



  const startListening = () => {


    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;



    if (!SpeechRecognition) {

      alert(
        "Speech recognition is not supported"
      );

      return;
    }



    const recognition =
      new SpeechRecognition();



    recognition.lang = "en-US";

    recognition.continuous = false;

    recognition.interimResults = false;



    recognition.onstart = () => {

      setListening(true);

      setSpokenText("");

      setResult(null);

    };



    recognition.onresult = async(event)=>{


      const speech =
        event.results[0][0].transcript;



      setSpokenText(
        speech
      );



      try {


        const response =
          await checkSpeech(
            currentPhrase,
            speech
          );



        console.log(
          "Speech Result:",
          response
        );


        setResult(
          response
        );



        // Voice feedback

        if(response.accuracy >= 90){

          speakFeedback(
            "Excellent pronunciation! Keep practicing."
          );

        }

        else if(response.accuracy >= 70){

          speakFeedback(
            "Good job! You are improving."
          );

        }

        else{

          speakFeedback(
            "Keep practicing. Try again."
          );

        }




        // Save progress

        const auth =
          getStoredAuth();



        if(auth?.user?.id){


          await saveProgress({

            user_id:
              auth.user.id,

            practice_type:
              "phrase",

            accuracy:
              response.accuracy

          });


        }



      }

      catch(error){

        console.log(
          error
        );

      }


    };



    recognition.onerror = () => {

      setListening(false);

    };



    recognition.onend = () => {

      setListening(false);

    };



    recognition.start();

  };





  const nextPhrase = () => {


    setIndex(
      (index + 1) % phrases.length
    );


    setSpokenText("");

    setResult(null);

  };




  return (

    <div className="phrase-container">


      <h1>
        Phrase Practice
      </h1>


      <p className="subtitle">
        Listen and repeat the sentence with AI feedback
      </p>



      <div className="phrase-card">


        <h2>
          Say this:
        </h2>



        <h3>
          "{currentPhrase}"
        </h3>



        <button
          className="listen-btn"
          onClick={listenPhrase}
        >
          🔊 Listen
        </button>




        <button
          className="speak-btn"
          onClick={startListening}
          disabled={listening}
        >

          {
            listening
            ?
            "🎤 Listening..."
            :
            "🎤 Repeat"
          }

        </button>




        <button
          className="next-btn"
          onClick={nextPhrase}
        >
          ➡ Next Phrase
        </button>


      </div>





      {
        spokenText &&

        <div className="result-card">


          <h3>
            Your Speech:
          </h3>


          <p>
            {spokenText}
          </p>




          {
            result &&

            <>

              <h3>
                Accuracy:
                {" "}
                {result.accuracy}%
              </h3>


              <p>
                {result.message}
              </p>


            </>

          }


        </div>

      }



    </div>

  );

}


export default PhrasePractice;