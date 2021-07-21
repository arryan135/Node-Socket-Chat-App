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

// connection is going to fire whenever it gets a new connection, built-in event
io.on("connection", (socket) => {
    console.log("New Websocket connection");

    // emit to a particular connection 
    socket.emit("message", "Welcome!");
    // emit to everyone but that particular connection
    socket.broadcast.emit("message", "A new user has joined");

    socket.on("sendMessage", (message) => {
        // send it to everyone
        io.emit("message", message);
    });

    // emit message when a user leaves, built-in event
    socket.on("disconnect", () => {
        io.emit("message", "A user has left");
    });

});

server.listen(port, (req, res) => {
    console.log(`Server is up on port ${port}`);
});