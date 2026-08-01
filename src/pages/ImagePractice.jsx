import React, { useEffect, useRef, useState } from "react";
import "./ImagePractice.css";

import {
  evaluateSpeech,
  getStoredAuth,
  getLocalProgress,
  saveLocalProgress,
  saveProgress,
  getCoachingTip,
} from "../services/api";


import apple from "../assets/images/apple.png";
import banana from "../assets/images/banana.png";
import orange from "../assets/images/orange.png";
import mango from "../assets/images/mango.png";
import grapes from "../assets/images/grapes.png";

import dog from "../assets/images/dog.png";
import cat from "../assets/images/cat.png";
import cow from "../assets/images/cow.png";
import lion from "../assets/images/lion.png";
import elephant from "../assets/images/elephant.png";

import fan from "../assets/images/fan.png";
import chair from "../assets/images/chair.png";
import table from "../assets/images/table.png";
import door from "../assets/images/door.png";
import windowImg from "../assets/images/window.png";


const items = [
  { word:"Apple", image:apple },
  { word:"Banana", image:banana },
  { word:"Orange", image:orange },
  { word:"Mango", image:mango },
  { word:"Grapes", image:grapes },

  { word:"Dog", image:dog },
  { word:"Cat", image:cat },
  { word:"Cow", image:cow },
  { word:"Lion", image:lion },
  { word:"Elephant", image:elephant },

  { word:"Fan", image:fan },
  { word:"Chair", image:chair },
  { word:"Table", image:table },
  { word:"Door", image:door },
  { word:"Window", image:windowImg },
];


function ImagePractice(){

const [currentIndex,setCurrentIndex]=useState(0);

const [feedback,setFeedback]=useState(
"Look at the image and say the word."
);

const [transcript,setTranscript]=useState("");

const [accuracy,setAccuracy]=useState(null);

const [coachTip,setCoachTip]=useState("");

const [isListening,setIsListening]=useState(false);


const recognitionRef=useRef(null);


const currentImage=items[currentIndex];



useEffect(()=>{


const SpeechRecognition =
window.SpeechRecognition ||
window.webkitSpeechRecognition;


if(!SpeechRecognition) return;


const recognition=new SpeechRecognition();


recognition.lang="en-US";
recognition.continuous=false;
recognition.interimResults=false;


recognition.onresult=(event)=>{

const spoken =
event.results[0][0].transcript;


setTranscript(spoken);

checkAnswer(spoken);

};



recognition.onerror=()=>{

setFeedback(
"Please try again."
);

setIsListening(false);

};



recognition.onend=()=>{

setIsListening(false);

};



recognitionRef.current=recognition;



return()=>recognition.stop();


},[currentIndex]);





// AI says word

const speakWord=()=>{


const speech=
new SpeechSynthesisUtterance(
currentImage.word
);


speech.lang="en-US";
speech.rate=0.8;


window.speechSynthesis.cancel();

window.speechSynthesis.speak(
speech
);


};





// AI feedback voice

const speakFeedback=(message)=>{


const speech=
new SpeechSynthesisUtterance(
message
);


speech.lang="en-US";
speech.rate=0.9;
speech.pitch=1;


window.speechSynthesis.cancel();

window.speechSynthesis.speak(
speech
);


};





const startRecognition=()=>{


if(!recognitionRef.current){

setFeedback(
"Speech recognition not supported."
);

return;

}


setTranscript("");

setAccuracy(null);

setIsListening(true);


recognitionRef.current.start();


};






const checkAnswer=async(spoken)=>{


try{


const result=
await evaluateSpeech(
currentImage.word,
spoken
);



setAccuracy(
result.accuracy
);



const progress=
getLocalProgress();



progress.images +=1;

progress.attempts +=1;



if(result.accuracy>=90){


progress.correct +=1;


setFeedback(
"🌟 Excellent pronunciation!"
);


speakFeedback(
"Excellent pronunciation! Keep up the great work."
);



}

else if(result.accuracy>=70){


setFeedback(
"👍 Good job! Keep improving."
);


speakFeedback(
"Good job! You are improving."
);


}

else{


setFeedback(
"💪 Practice again."
);


speakFeedback(
"Keep practicing. Try again."
);


}



saveLocalProgress(
progress
);





const auth = getStoredAuth();

if (auth?.id) {

  try {

    await saveProgress({

      user_id: auth.id,

      practice_type: "image",

      accuracy: Math.round(result.accuracy),

    });

    console.log("✅ Image progress saved");

    const tip = await getCoachingTip(auth.id);

    setCoachTip(tip.tip);

  } catch (err) {

    console.error(
      "Image Progress Error:",
      err.response?.data || err.message
    );

  }


const tip=
await getCoachingTip(
auth.id
);


setCoachTip(
tip.tip
);


}



}

catch(error){

console.log(
"Speech error",
error
);

}


};






const nextImage=()=>{


setCurrentIndex(
(prev)=>(prev+1)%items.length
);


setTranscript("");

setAccuracy(null);

setCoachTip("");

setFeedback(
"Look at the image and say the word."
);


};





return (

<div className="image-page">

<div className="image-card">


<h1 className="title">
🖼️ Image Practice
</h1>


<p className="subtitle">
Listen and repeat the word with AI feedback.
</p>



<div className="image-box">

<img
src={currentImage.image}
alt={currentImage.word}
className="image-visual"
/>

</div>



<h2 className="image-word">
{currentImage.word}
</h2>




<div className="button-group">


<button
className="listen-btn"
onClick={speakWord}
>
🔊 Listen
</button>



<button
className="speak-btn"
onClick={startRecognition}
disabled={isListening}
>

{
isListening
?
"🎤 Listening..."
:
"🎤 Repeat"
}

</button>



<button
className="next-btn"
onClick={nextImage}
>
➡ Next
</button>


</div>





<div className="result-card">


<h3>
Speech Result
</h3>


<p>
<strong>Expected:</strong> {currentImage.word}
</p>


<p>
<strong>You Said:</strong> {transcript || "-"}
</p>


<p>
<strong>Accuracy:</strong>{" "}
{
accuracy!==null
?
`${accuracy}%`
:
"-"
}
</p>


<p className="feedback">
{feedback}
</p>



{
coachTip &&

<div className="coach-box">

<strong>
AI Coach Tip
</strong>

<p>
{coachTip}
</p>

</div>

}



</div>



</div>

</div>


);


}


export default ImagePractice;