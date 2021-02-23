let socket;

let messageToSend = "";

// p5.SpeechRec - Basic
var robot = new p5.SpeechRec(); // speech recognition object
robot.continuous = false; // allow continuous recognition
robot.interimResults = true; // allow partial recognition (faster, less accurate)
robot.onResult = showResult; // callback function that triggers when speech is recognized
robot.onError = showError; // callback function that triggers when an error occurs
robot.onEnd = onVoiceRecognitionEnd; // callback function that triggers voice recognition ends

//p5.Speech
var robotVoice = new p5.Speech(); // speech synthesis object

function setup() {
  listen();
  socket = io.connect();
  socket.on("messageFromServer", onReceiveMessageFromServer);
}

function draw() {
  let textBox = document.getElementById("speech-text");
  if (robot.resultString != undefined) {
    textBox.innerText = robot.resultString;
  }
}

function listen() {
  robot.start(); // start listening
  console.log("I'm listening...");
}

function showResult() {
  console.log("Transcript: " + robot.resultString); // log the transcript
  console.log("Confidence: " + robot.resultConfidence); // log the confidence
}

function showError() {
  console.log("An error occurred!");
}

function restartListening() {
  console.log("restart listening...");
  robot.start(); // start listening
}

function onVoiceRecognitionEnd() {
  console.log(
    "Voice recognition ended!!!, The message is " + robot.resultString
  );

  sendTheMessageToTheServer();
}

function sendTheMessageToTheServer() {
  socket.emit("messageFromUser", robot.resultString);
}

function onReceiveMessageFromServer(msg) {
  console.log("Message from server is... " + msg);
  // TODO get the computer to speak this message when it comes in
  console.log("daniel was here 2021");
  robotVoice.setVoice(Math.floor(random(robotVoice.voices.length)));
  robotVoice.speak(msg);
}
