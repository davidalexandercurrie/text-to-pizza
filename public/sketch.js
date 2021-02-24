let socket;

let messageToSend = '';
let displayText = '';
let length = 0;
let advertisementEmojis = [];

let sounds = [];
let dialupSound;
function preload() {
  for (let i = 0; i < 4; i++) {
    sounds[i] = loadSound(`audio/key${i + 1}.mp3`);
    console.log(`audio/key${i + 1}.mp3`);
  }
  dialupSound = loadSound('audio/internet.mp3');
  console.log('audio/internet.mp3');
}

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
  noCanvas();
  // listen();
  socket = io.connect();
  socket.on('messageFromServer', onReceiveMessageFromServer);

  getAudioContext().suspend(); //make sure audio is paused
}

function draw() {
  let textBox = document.getElementById('speech-text');
  if (frameCount % 5 === 0 && length < displayText.length) {
    console.log('typing');
    textBox.innerText = displayText.substring(0, length + 1);
    length++;
    random(sounds).play();
    if (length == displayText.length) {
      document.getElementById('listen-button').innerText = 'Record Message';
      document.getElementById('listen-button').classList.remove('btn-disabled');
    }
  }
  if (length == displayText.length) {
    dialupSound.stop();
  }
  console.log(advertisementEmojis.length);
  if (
    frameCount % (120 - advertisementEmojis.length) === 0 &&
    advertisementEmojis.length > 0
  ) {
    console.log(advertisementEmojis);
    let advertEmoji = random(advertisementEmojis);
    let advert = createDiv(advertEmoji.repeat(random(6)));
    let xButton = createDiv('🆇');
    xButton.mousePressed(() => {
      advert.remove();
    });
    xButton.addClass('pop-ups');
    advert.child(xButton);
    xButton.style(
      'position: absolute; top: 0; right: 0; padding: 0; margin: 0; border: 2px solid black'
    );
    advert.style(
      `border: solid 2px darkgrey; position: fixed; height: 200px; width: 300px; background: rgb(${random(
        255
      )}, ${random(255)}, ${random(255)}); top: ${random(90)}%; left: ${random(
        90
      )}%; font-size: ${random(36, 70)}px; text-align: center;`
    );
  }
}

function listen() {
  robot.start(); // start listening
  console.log("I'm listening...");
  document.getElementById('listen-button').innerText = 'Listening';
  document.getElementById('listen-button').classList.add('btn-disabled');
}

function showResult() {
  // console.log('Transcript: ' + robot.resultString); // log the transcript
  // console.log('Confidence: ' + robot.resultConfidence); // log the confidence
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
    sendTheMessageToTheServer();
  } else {
    document.getElementById('listen-button').innerText = 'Record Message';
    document.getElementById('listen-button').classList.remove('btn-disabled');
  }
}

function sendTheMessageToTheServer() {
  console.log('sending message to server');
  socket.emit('messageFromUser', robot.resultString);
  document.getElementById('listen-button').innerText = 'Sending';
  dialupSound.currentTime(random(dialupSound.duration()));
  dialupSound.loop();
}

function onReceiveMessageFromServer(words, emojis, nounlist) {
  console.log('Message from server is... ' + words);
  document.getElementById('received-text').innerText = emojis;
  // TODO get the computer to speak this message when it comes in
  console.log('daniel was here 2021');

  //speak message from server
  robotVoice.setVoice(Math.floor(random(robotVoice.voices.length)));
  robotVoice.speak(words);
  advertisementEmojis = nounlist;
}

function mousePressed() {
  userStartAudio();
}

function closeWindow() {
  document.getElementById('received-text').innerText = 'FATAL ERROR';
}
