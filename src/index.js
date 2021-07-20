const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
// configure socketio to use it on our server
const io = socketio(server);  // this makes our server support websocket

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

// connection is going to fire whenever it gets a new connection
io.on("connection", () => {
    console.log("New Websocket connection");
});

server.listen(port, (req, res) => {
    console.log(`Server is up on port ${port}`);
});