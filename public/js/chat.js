const socket = io();

socket.on("message", (message) => {
    console.log(message);
});

document.querySelector("#message-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const message = e.target.elements.message.value;

    // the last fucntional arugment is used for acknowleding events
    socket.emit("sendMessage", message, (error) => {
        if (error){
            return console.log(error);
        }

        console.log("Message delivered!");
    });
});

document.querySelector("#send-location").addEventListener("click", () => {
    if (!navigator.geolocation){
        return alert("Geolocation is not supported by your browser");
    }

    navigator.geolocation.getCurrentPosition((location) => {
        const {latitude, longitude} = location.coords;
        socket.emit("sendLocation", {latitude, longitude}, (message) => {
            console.log(message);
        });
    });
})