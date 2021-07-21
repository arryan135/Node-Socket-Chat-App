const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
// this makes our server support websocket
const io = socketio(server);  

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

// connection is going to fire whenever it gets a new connection
io.on("connection", (socket) => {
    console.log("New Websocket connection");

    socket.emit("message", "Welcome!");

    socket.on("sendMessage", (message) => {
        io.emit("message", message);
    });
});

server.listen(port, (req, res) => {
    console.log(`Server is up on port ${port}`);
});