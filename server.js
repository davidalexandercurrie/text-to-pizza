const express = require('express');
const app = express();
const http = require('http').createServer(app);

const options = {
  /* ... */
};
const io = require('socket.io')(http, options);

app.use('/', express.static('public'));

const listener = http.listen(process.env.PORT || 3000, process.env.IP, () => {
  console.log('listening on *:3000');
});

io.on('connection', socket => {
  console.log('User connected! Their ID is ' + socket.id);

  socket.on('messageFromUser', msg => {
    console.log('The message from User is ' + msg);

    socket.broadcast.emit('messageFromServer', msg);
  });
});
