const socket = io();

// Elements
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $sendLocationButton = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");

// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationMessageTemplate = document.querySelector("#location-message-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar__template").innerHTML;

// Options 
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true});

const autoScroll = () => {
    // new message element - lastest new message
    const $newMessage = $messages.lastElementChild;

    // Height of new message
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible Height - messages we can see currently
    const visibleHeight = $messages.offsetHeight; 

    // Height of message container - includes even those messages that can't be seen (which need scrolling to look at)
    const containerHeight = $messages.scrollHeight;

    // How far have I scrolled ?
    const scrollOffset = $messages.scrollTop + visibleHeight;

    // to make sure that we were at the bottom before the last messages was added
    if (containerHeight - newMessageHeight <= scrollOffset){
        // this pushes us to the bottom
        $messages.scrollTop = $messages.scrollHeight;
    }
}

socket.on("message", (message) => {
    // add message template inside at bottom on messages div
    // the second argument is the object that passes in the dynamic message to the message variable in the template
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format("h:mm a")
    });
    $messages.insertAdjacentHTML("beforeend", html);
    autoScroll();
});

socket.on("locationMessage", (message) => {
    const html = Mustache.render(locationMessageTemplate, { 
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format("h:mm a")
    });
    $messages.insertAdjacentHTML("beforeend", html);
    autoScroll();
});

socket.on("roomData", ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    });
    document.querySelector("#sidebar").innerHTML = html;
})

$messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    // disable button after it has been sent and before receiving it
    $messageFormButton.setAttribute("disabled", "disabled");

    const message = e.target.elements.message.value;

    // the last fucntional arugment is used for acknowleding events
    socket.emit("sendMessage", message, (error) => {
        // enable button once it has been delivered
        $messageFormButton.removeAttribute("disabled");
        // clear the input after the message has been sent
        $messageFormInput.value = "";
        $messageFormInput.focus();
        if (error){
            return console.log(error);
        }
    });
});

$sendLocationButton.addEventListener("click", () => {
    if (!navigator.geolocation){
        return alert("Geolocation is not supported by your browser");
    }

    $sendLocationButton.setAttribute("disabled", "disabled");

    navigator.geolocation.getCurrentPosition((location) => {
        const {latitude, longitude} = location.coords;
        socket.emit("sendLocation", {latitude, longitude}, (message) => {
            console.log(message);
            $sendLocationButton.removeAttribute("disabled");
        });
    });
});

socket.emit("join", {username, room}, (error) => {
    if (error){
        alert(error);
        // sending the user back to home page if error 
        location.href = "/"
    }
});

