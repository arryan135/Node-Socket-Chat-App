const socket = io();

socket.on("countUpdated", (count) => {
    console.log(`The count has been updated. ${count}`);
});

document.querySelector("#increment").addEventListener("click", () => {
    console.log("clicked");
    // establish connection between client and server
    socket.emit("increment");
})