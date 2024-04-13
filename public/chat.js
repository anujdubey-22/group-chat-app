async function getChats() {
    try{
        const token = localStorage.getItem("token");
        const message = localStorage.getItem('message');
        const messageArray = JSON.parse(message);
        const chats = await axios.get(`http://localhost:3000/chat/allchat/number=10`, {
          headers: { authorization: token }
        });
        console.log(chats,'chats');
        if (messageArray){
            for(let message of messageArray){
                showChatToScreen(message);
            }
        }
        if (chats){
            for(let message of chats.data.data){
                showChatToScreen(message.message)
            }
        }
    }
    catch(error){
        console.log(error,'error in getting chats in getChats');
    }
};

document.addEventListener("DOMContentLoaded", getChats());

async function showChatToScreen(message) {
  let messageDiv = document.createElement("div");
  messageDiv.className = "message";
  messageDiv.textContent = message;
  document.querySelector(".chat-messages").appendChild(messageDiv);
}

async function sendMessage() {
  try {
    const message = document.getElementById("input_message").value;

    // to clear the input element
    document.getElementById("input_message").value = "";

    const token = localStorage.getItem("token");
    const chat = await axios.post(
      "http://localhost:3000/chat/send",
      {
        message: message,
      },
      { headers: { authorization: token } }
    );
    console.log(chat, "chat post method done");
    if (chat.status === 201) {
        const messageArray = [];
        messageArray.push(message);
        const messageString = JSON.stringify(messageArray);
        localStorage.setItem('message',messageString);
      console.log("chat successfully created in database");
      showChatToScreen(chat.data.data.message);
    }
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
