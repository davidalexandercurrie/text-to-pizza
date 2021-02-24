const express = require('express');
const app = express();
const http = require('http').createServer(app);

const options = {
  /* ... */
};
const io = require('socket.io')(http, options);
const emojiFromWord = require('emoji-from-word');

const { emojify } = require('@twuni/emojify');

const WordPOS = require('wordpos'),
  wordpos = new WordPOS();

const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

app.use('/', express.static('public'));

const listener = http.listen(process.env.PORT || 3000, process.env.IP, () => {
  console.log('listening on *:3000');
});

let nounBank = [];

io.on('connection', socket => {
  console.log('User connected! Their ID is ' + socket.id);

  socket.on('messageFromUser', msg => {
    // console.log('The message from User is ' + msg);
    let arr = tokenizer.tokenize(msg != undefined ? msg : '');
    let counter = 0;
    for (let i = 0; i < arr.length; i++) {
      let isAdverbs = false;
      wordpos.isAdverb(arr[i], function (result) {
        isAdverbs = result;
      });
      if (!isAdverbs) {
        wordpos.isNoun(arr[i], function (result) {
          if (result && !nounBank.includes(arr[i])) {
            nounBank.push(arr[i]);
            if (nounBank.length > 40) {
              nounBank.splice(0, 1);
            }
            arr[i] = 'pizza';
          }
          console.log(nounBank);

          counter++;

          if (counter === arr.length) {
            let words = arr.join(' ');
            let emojis = emojify(
              arr.map(word => emojiFromWord(word).toString()).join(' ')
            );
            let nounEmojis = [];
            for (word of nounBank) {
              let emoji = emojify(emojiFromWord(word).toString());
              if (emoji != ':null:') {
                nounEmojis.push(emoji);
              }
            }
            console.log(nounEmojis);
            socket.broadcast.emit(
              'messageFromServer',
              words,
              emojis,
              nounEmojis
            );
          }
        });
      }
    }
  });
});
