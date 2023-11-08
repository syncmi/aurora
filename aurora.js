
// initializing firebase app
const app = firebase.initializeApp(firebaseConfig);

// database firestore
const db = firebase.firestore();


// Whole Data Set
var aiData = JSON.parse(data);  // Whole Data
var lenAiData = aiData.length; // Length of Whole Data

var keys = [];


for (let i = 0; i < lenAiData; i++) {

  var nestedData = aiData[i]; // Iterated Topic (or) Data

  var nestedDataKeys = Object.keys(nestedData); // Keys of Dictionary

  var lenNestedData = Object.keys(nestedData).length; // Length of Keys in a Topic

  for (let j = 0; j < lenNestedData; j++) {
    var dataKey = nestedDataKeys[j];
    var dataValue = nestedData[nestedDataKeys[j]];
    keys.push(dataKey);
  }
}


// SpeechRecognition

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();


recognition.onstart = function () {
  console.log("Started...");
  document.getElementById("mic").style.animation = "wave 0.5s infinite linear";
};

recognition.onend = () => {
  console.log("Ended...");
  document.getElementById("mic").style.animation = "none";
};

recognition.onresult = function (e) {
  const resultIndex = e.resultIndex;
  const { transcript } = e.results[resultIndex][0];
  console.log(transcript);
  speakOutLoud(transcript.toLowerCase());
};

function speakNow() {
  recognition.start();
}

var i = 0;
if (i == 0) {
  i += 1;
  speakOutLoud("...");
}

function speakOutLoud(transcript) {

  let spoken = transcript;

  // The action of saying or expressing something aloud..
  const SpeechSynthesisUtterance =
    window.SpeechSynthesisUtterance || window.webkitSpeechSynthesisUtterance;

  const utterance = new SpeechSynthesisUtterance();

  // Artificial production of human speech
  const speechSynthesis =
    window.speechSynthesis || window.webkitspeechSynthesis;

  var voices = window.speechSynthesis.getVoices();
  utterance.voice = voices[2]; // Note: some voices don't support altering params

  utterance.voiceURI = 'native';
  utterance.volume = 1; // 0 to 1
  utterance.rate = 1; // 0.1 to 10
  utterance.pitch = 0.5; //0 to 2
  utterance.lang = 'en-US';


  var send = true;

  for (key of keys) {
    if (spoken.includes(key)) {
      send = false;
      break;
    }
  }
  //console.log(send);

  // Time
  const dt = new Date();
  var sysDate = dt.getDate() + "-" + (dt.getMonth() + 1) + "-" + dt.getFullYear();
  /*
  if (send === true || send===false) {
    db.collection("UsersData").doc(sysDate).update({
      [dt] : {
        "a" : !send
      }
    })
      .then(() => {
        console.log("Document successfully written!");
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  }
  */


  if (send === true) {
    db.collection("Questions").doc("Unknown").update({
      [spoken]: 0
    })
      .then(() => {
        console.log("Document successfully written!");
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });

      utterance.text = "Sorry, I can't understand you...";
      speechSynthesis.speak(utterance);
  }

  // For Loop to iterate - Topics (or) Dictionary in the Whole Data  
  for (let i = 0; i < lenAiData; i++) {
    //if (i === 0) { continue; }
    var nestedData = aiData[i]; // Iterated Topic (or) Data
    //console.log(nestedData);  // Logging Iterated Topic (or) Data

    var nestedDataKeys = Object.keys(nestedData); // Keys of Dictionary

    var lenNestedData = Object.keys(nestedData).length; // Length of Keys in a Topic
    //console.log(lenNestedData);

    for (let j = 0; j < lenNestedData; j++) {
      var dataValues = nestedData[nestedDataKeys[j]];
      //console.log(dataValues);
      if (spoken.includes(nestedDataKeys[j])) {
        utterance.text = dataValues;
        speechSynthesis.speak(utterance);
        break;
      }
    }
  }


  /*
  var greeting1 = ["hi", "hello", "hai"];
  for (item of greeting1) {
    if (spoken.includes(item)) {
      utterance.text = "Hello...";
      speechSynthesis.speak(utterance);
      break;
    }
  }

  // Arunachalam - 23/01/23 
  // Greetings2
  var greeting2 = ["how are you", "how about you", "how are you doing", "is all well"];
  for (item of greeting2) {
    if (spoken.includes(item)) {
      utterance.text = "Thanks For Asking, I'm Fine...";
      speechSynthesis.speak(utterance);
      break;
    }
  }

  // Thalha - 24/01/23
  // service
  var service = ["what are the services provided"];
  for (item of service) {
    if (spoken.includes(item)) {
      utterance.text = "We Provide all Web related services from Web Designing to Development...";
      speechSynthesis.speak(utterance);
      break;
    }
  }

  // Thalha - 19/02/23
  // pricing plans
  var service = ["pricing plans"];
  for (item of service) {
    if (spoken.includes(item)) {
      utterance.text = "We Provide 3 plans...";
      speechSynthesis.speak(utterance);
      break;
    }
  }
  */


}
