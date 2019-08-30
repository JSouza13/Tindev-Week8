const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const routes = require('./routes');

const connectedUsers = {};

io.on('connection', socket => {
  const { user } = socket.handshake.query;

  // eslint-disable-next-line no-console
  console.log(user, socket.id);

  connectedUsers[user] = socket.id;
});
mongoose.connect(
  'mongodb+srv://omnistack:omnistack@cluster0-htzko.mongodb.net/omnistack8?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
  }
);

app.use((req, res, next) => {
  req.io = io;
  req.connectedUsers = connectedUsers;

  return next();
});

app.use(cors());
app.use(express.json());
// GET, POST, PUT, DELETE
app.use(routes);

server.listen(3333);
