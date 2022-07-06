// helper function for selecting element by id
let id = id => document.getElementById(id);

// ask user to enter his name
let username = localStorage.getItem("username");
while (!username) {
    username = prompt("Please enter your username");
}
localStorage.setItem("username", username);

// get chat history
fetch('/history')
    .then(response => response.json())
    .then(data => {
        for (const message of data) {
            updateChat(message);
        }
    });


// WebSocket connection setup
let ws;
connectWs();

function connectWs() {
    // Establish the WebSocket connection and set up event handlers
    const protocol = (location.protocol === 'https:') ? 'wss' : 'ws';
    ws = new WebSocket(`${protocol}://${location.hostname}:${location.port}/chat?user=${username}`);
    ws.onmessage = msg => updateChat(msg.data);
    ws.onclose = () => connectWs();
}


// Add event listeners to button and input field
id("send").addEventListener("click", () => sendAndClear(id("message").value));
id("message").addEventListener("keypress", function (e) {
    if (e.keyCode === 13) { // Send message if enter is pressed in input field
        sendAndClear(e.target.value);
    }
});

function sendAndClear(message) {
    if (message !== "") {
        ws.send(message);
        id("message").value = "";
    }
}

// Update chat-panel and list of connected users
function updateChat(msg) {
    let data = JSON.parse(msg);
    id("chat").insertAdjacentHTML("afterbegin", data.userMessage);
    id("userList").innerHTML = data.userList.map(user => "<li>" + user + "</li>").join("");
}