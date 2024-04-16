const messageArray = [];

async function getChatsAndGroups() {
  try {
    const token = localStorage.getItem("token");
    const message = localStorage.getItem("message");
    const messageArray = JSON.parse(message);
    const chats = await axios.get(
      `http://localhost:3000/chat/allchat?number=10`,
      {
        headers: { authorization: token },
      }
    );
    console.log(chats, "chats");

    const groups = await axios.get(`http://localhost:3000/group/getgroup`, {
      headers: { authorization: token },
    });
    console.log(groups, "all groups fetched");
    if (groups) {
      for (let group of groups.data.groups) {
        //console.log(group.group)
        showGroup(group);
      }
    }

    if (messageArray) {
      for (let message of messageArray) {
        showChatToScreen(message);
      }
    }
    if (chats) {
      for (let message of chats.data.data) {
        showChatToScreen(message.message);
      }
    }
  } catch (error) {
    console.log(error, "error in getting chats in getChats");
  }
}

document.addEventListener("DOMContentLoaded", getChatsAndGroups());

async function showChatToScreen(message) {
  let messageDiv = document.createElement("div");
  messageDiv.textContent = message;
  // Get the message list element
  const messageList = document.getElementById("messageList");

  // Add the new message element to the message list
  messageList.appendChild(messageDiv);
}

async function sendMessage() {
  try {
    const message = document.getElementById("messageInput").value;

    // to clear the input element
    document.getElementById("messageInput").value = "";

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
      messageArray.push(message);
      if (messageArray.length < 10) {
        const messageString = JSON.stringify(messageArray);
        localStorage.setItem("message", messageString);
      }

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

// function toggleTheme() {
//   let container = document.querySelector(".chat-container");
//   container.classList.toggle("dark-theme");
//   container.classList.toggle("light-theme");
// }

async function showGroup(groupRow) {
  console.log(groupRow)
  const {group,id} = groupRow
  const groupList = document.getElementById("groupList");

  const button = document.createElement("button");
  button.textContent = group;
  button.style.backgroundColor = "#00fcf6";
  button.style.color = "black";
  const buttonDiv = document.createElement("div");
  buttonDiv.appendChild(button);
  groupList.appendChild(buttonDiv);

  button.addEventListener("click", function (e) {
    // Add your code here to perform the action you want when the button is clicked
    console.log("Button clicked!");
    console.log(e)
    const groupName = this.textContent;
    console.log("Group Name: ", groupName);

    // You can access other properties of the button as needed
    // For example, you can get the id like this:
    const groupId = this.id;
    console.log("Group ID: ", id);
  });
}

async function createGroup() {
  const groupName = document.getElementById("groupInput").value;
  const token = localStorage.getItem("token");
  const group = await axios.post(
    "http://localhost:3000/group/creategroup",
    {
      groupName: groupName,
    },
    { headers: { authorization: token } }
  );
  console.log(group, "group created in database in chat.js");
  showGroup(groupName);
}
