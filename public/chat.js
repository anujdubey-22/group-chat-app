async function showChatToScreen(message){
     // let messageDiv = document.createElement('div');
  // messageDiv.className = 'message';
  // messageDiv.textContent = message;
  // document.querySelector('.chat-messages').appendChild(messageDiv);
}


async function sendMessage() {
  try {
    const message = document.getElementById("input_message").value;
    const token = localStorage.getItem("token");
    const chat = await axios.post(
      "http://localhost:3000/chat/send",
      {
        message: message,
      },
      { headers: { authorization: token } }
    );
    console.log(chat, "chat post method done");
    showChatToScreen(chat)
  } catch (error) {
    console.log(error, "error in sending message");
  }

  // let message = document.getElementById('input-message').value;
  // let messageDiv = document.createElement('div');
  // messageDiv.className = 'message';
  // messageDiv.textContent = message;
  // document.querySelector('.chat-messages').appendChild(messageDiv);
  // document.getElementById('input-message').value = '';
}

function toggleTheme() {
  let container = document.querySelector(".chat-container");
  container.classList.toggle("dark-theme");
  container.classList.toggle("light-theme");
}
