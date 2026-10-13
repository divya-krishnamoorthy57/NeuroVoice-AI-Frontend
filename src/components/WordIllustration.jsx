import React from "react";

// Import real-life local image assets
import appleImg from "../assets/images/apple.png";
import bananaImg from "../assets/images/banana.png";
import orangeImg from "../assets/images/orange.png";
import mangoImg from "../assets/images/mango.png";
import grapesImg from "../assets/images/grapes.png";
import catImg from "../assets/images/cat.png";
import dogImg from "../assets/images/dog.png";
import cowImg from "../assets/images/cow.png";
import lionImg from "../assets/images/lion.png";
import elephantImg from "../assets/images/elephant.png";
import fanImg from "../assets/images/fan.png";
import chairImg from "../assets/images/chair.png";
import tableImg from "../assets/images/table.png";
import doorImg from "../assets/images/door.png";
import windowImg from "../assets/images/window.png";

const localImageMap = {
  apple: appleImg,
  "ஆப்பிள்": appleImg,
  banana: bananaImg,
  "வாழைப்பழம்": bananaImg,
  orange: orangeImg,
  mango: mangoImg,
  grapes: grapesImg,
  cat: catImg,
  dog: dogImg,
  cow: cowImg,
  lion: lionImg,
  elephant: elephantImg,
  fan: fanImg,
  chair: chairImg,
  "நாற்காலி": chairImg,
  table: tableImg,
  "மேசை": tableImg,
  door: doorImg,
  "கதவு": doorImg,
  window: windowImg,
  "ஜன்னல்": windowImg,
};

// Friendly emojis/illustrations for words without local PNGs
const visualIconMap = {
  // English words
  water: "💧",
  milk: "🥛",
  rice: "🍚",
  bread: "🍞",
  tea: "🍵",
  coffee: "☕",
  food: "🍲",
  breakfast: "🍳",
  home: "🏡",
  bed: "🛏️",
  light: "💡",
  phone: "📱",
  key: "🔑",
  bathroom: "🚿",
  kitchen: "🍳",
  mother: "👩‍👧",
  father: "👨‍👧",
  sister: "👧",
  brother: "👦",
  friend: "🤝",
  doctor: "🩺",
  nurse: "👩‍⚕️",
  child: "🧒",
  help: "🆘",
  hungry: "🍽️",
  thirsty: "🥤",
  tired: "🥱",
  pain: "🩹",
  rest: "🧘",
  toilet: "🚻",
  medicine: "💊",
  eat: "🥄",
  drink: "🥤",
  sit: "🪑",
  stand: "🧍",
  walk: "🚶",
  sleep: "😴",
  open: "🚪",
  close: "🔒",
  come: "👋",
  go: "🚶",
  shop: "🛒",
  money: "💵",
  price: "🏷️",
  buy: "🛍️",
  bag: "👜",
  bill: "🧾",
  card: "💳",
  cash: "💵",
  bus: "🚌",
  car: "🚗",
  road: "🛣️",
  ticket: "🎫",
  stop: "🛑",
  left: "⬅️",
  right: "➡️",
  yes: "✅",
  no: "❌",
  please: "🙏",
  "thank you": "💐",
  sorry: "🙇",
  "help me": "🆘",
  "call my family": "📞",
  "call a doctor": "🚑",
  school: "🏫",
  hospital: "🏥",
  market: "🏪",
  office: "🏢",
  park: "🌳",
  cooking: "🍳",
  washing: "🧼",
  cleaning: "🧹",
  "good morning": "🌅",
  "how are you": "😊",
  toothbrush: "🪥",
  "i need water.": "💧",
  "i am hungry.": "🍽️",
  "please help me.": "🆘",
  "i want to sit.": "🪑",
  "thank you.": "💐",
  "where is my phone?": "📱",

  // Tamil words
  "தண்ணீர்": "💧",
  "பால்": "🥛",
  "சாதம்": "🍚",
  "இட்லி": "🍲",
  "தோசை": "🥞",
  "தேநீர்": "🍵",
  "காபி": "☕",
  "உணவு": "🍲",
  "வீடு": "🏡",
  "படுக்கை": "🛏️",
  "கைபேசி": "📱",
  "சாவி": "🔑",
  "சமையலறை": "🍳",
  "குளியலறை": "🚿",
  "விளக்கு": "💡",
  "அம்மா": "👩‍👧",
  "அப்பா": "👨‍👧",
  "அக்கா": "👧",
  "அண்ணன்": "👦",
  "தம்பி": "👦",
  "தங்கை": "👧",
  "நண்பர்": "🤝",
  "மருத்துவர்": "🩺",
  "செவிலியர்": "👩‍⚕️",
  "குழந்தை": "🧒",
  "உதவி": "🆘",
  "வலி": "🩹",
  "ஓய்வு": "🧘",
  "பசி": "🍽️",
  "தாகம்": "🥤",
  "கழிப்பறை": "🚻",
  "மருந்து": "💊",
  "பை": "👜",
  "பல் துலக்கி": "🪥",
  "ஆம்": "✅",
  "இல்லை": "❌",
  "நன்றி": "💐",
  "நன்றி.": "💐",
  "சாப்பிடு": "🥄",
  "குடி": "🥤",
  "உட்கார்": "🪑",
  "எழுந்திரு": "🧍",
  "நட": "🚶",
  "தூங்கு": "😴",
  "வா": "👋",
  "போ": "🚶",
  "திற": "🚪",
  "மூடு": "🔒",

  // Tamil phrases
  "எனக்குத் தண்ணீர் வேண்டும்.": "💧",
  "எனக்குப் பசிக்கிறது.": "🍽️",
  "எனக்குத் தாகமாக இருக்கிறது.": "🥤",
  "எனக்கு உதவி செய்யுங்கள்.": "🆘",
  "தயவுசெய்து உதவுங்கள்.": "🆘",
  "நான் உட்கார வேண்டும்.": "🪑",
  "நான் ஓய்வெடுக்க வேண்டும்.": "🛏️",
  "நான் வீட்டிற்குப் போக வேண்டும்.": "🏡",
  "கதவைத் திறக்கவும்.": "🚪",
  "என் குடும்பத்தினரை அழைக்கவும்.": "📞",
  "என் கைப்பேசி எங்கே?": "📱",
  "எனக்கு மருத்துவர் வேண்டும்.": "🚑",
};

const WordIllustration = ({ word, imageUrl, englishMeaning, altText, size = 200 }) => {
  const normalizedKey = (word || "").trim().toLowerCase();
  const meaningKey = (englishMeaning || "").trim().toLowerCase();
  const imgKey = (imageUrl || "").replace(/\.(png|jpg|jpeg|svg)$/i, "").trim().toLowerCase();

  const localImg =
    localImageMap[normalizedKey] ||
    localImageMap[meaningKey] ||
    localImageMap[imgKey];

  if (localImg) {
    return (
      <div style={{
        width: `${size}px`,
        height: `${size}px`,
        maxWidth: "100%",
        margin: "0 auto 20px",
        borderRadius: "24px",
        overflow: "hidden",
        backgroundColor: "#FFFFFF",
        border: "3px solid #D9F7EE",
        boxShadow: "0 8px 24px rgba(22, 131, 109, 0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "12px",
        transition: "transform 0.2s ease"
      }}>
        <img
          src={localImg}
          alt={altText || word || "Practice illustration"}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            borderRadius: "16px"
          }}
        />
      </div>
    );
  }

  // Fallback to clear, large friendly visual icon
  const iconEmoji = visualIconMap[normalizedKey] || "💬";

  return (
    <div style={{
      width: `${size}px`,
      height: `${size}px`,
      maxWidth: "100%",
      margin: "0 auto 20px",
      borderRadius: "24px",
      backgroundColor: "#D9F7EE",
      border: "3px solid #8ED8C5",
      boxShadow: "0 8px 24px rgba(22, 131, 109, 0.08)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "6px"
    }}>
      <span style={{ fontSize: "72px", lineHeight: "1" }}>{iconEmoji}</span>
      <span style={{ fontSize: "0.85rem", color: "#16836D", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>
        {word}
      </span>
    </div>
  );
};

export default WordIllustration;
