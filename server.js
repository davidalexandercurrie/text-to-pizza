const express = require('express');
const app = express();
const http = require('http').createServer(app);

const options = {
  /* ... */
};
const io = require('socket.io')(http, options);

const WordPOS = require('wordpos'),
  wordpos = new WordPOS();

const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

app.use('/', express.static('public'));

const listener = http.listen(process.env.PORT || 3000, process.env.IP, () => {
  console.log('listening on *:3000');
});

io.on('connection', socket => {
  console.log('User connected! Their ID is ' + socket.id);

  socket.on('messageFromUser', msg => {
    // console.log('The message from User is ' + msg);
    let arr = tokenizer.tokenize(msg);
    let counter = 0;
    for (let i = 0; i < arr.length; i++) {
      wordpos.isNoun(arr[i], function (result) {
        if (result) {
          arr[i] = 'pizza';
        }
        counter++;
        if (counter === arr.length) {
          let words = arr.join(' ');
          console.log(words);
          socket.broadcast.emit('messageFromServer', words);
        }
      });
    }
  });
});
