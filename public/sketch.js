let socket;

let messageToSend = '';
let displayText = '';
let length = 0;

// p5.SpeechRec - Basic
var robot = new p5.SpeechRec(); // speech recognition object
robot.continuous = false; // allow continuous recognition
robot.interimResults = true; // allow partial recognition (faster, less accurate)
robot.onResult = showResult; // callback function that triggers when speech is recognized
robot.onError = showError; // callback function that triggers when an error occurs
robot.onEnd = onVoiceRecognitionEnd; // callback function that triggers voice recognition ends

function setup() {
  listen();
  socket = io.connect();
  socket.on('messageFromServer', onReceiveMessageFromServer);
}

function draw() {
  let textBox = document.getElementById('speech-text');
  if (frameCount % 10 === 0 && length < displayText.length) {
    textBox.innerText = displayText.substring(0, length + 1);
    length++;
  }
}

function listen() {
  robot.start(); // start listening
  console.log("I'm listening...");
}

function showResult() {
  console.log('Transcript: ' + robot.resultString); // log the transcript
  console.log('Confidence: ' + robot.resultConfidence); // log the confidence
}

function showError() {
  console.log('An error occurred!');
}

function restartListening() {
  console.log('restart listening...');
  robot.start(); // start listening
}

function onVoiceRecognitionEnd() {
  console.log(
    'Voice recognition ended!!!, The message is ' + robot.resultString
  );
  if (robot.resultString != undefined) {
    displayText = robot.resultString;
    length = 0;
  }
  sendTheMessageToTheServer();
}

function sendTheMessageToTheServer() {
  console.log('sending message to server');
  socket.emit('messageFromUser', robot.resultString);
}

function onReceiveMessageFromServer(words, emojis) {
  console.log('Message from server is... ' + words);
  console.log(emojis);
  document.getElementById('received-text').innerHTML = emojis;
  // TODO get the computer to speak this message when it comes in
}
