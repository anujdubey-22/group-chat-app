// Initialize socket.io
const socket = io.connect("http://localhost:3000");
socket.on("sendToAll", (msg) => {
  console.log(msg, "msg through socket");
  showChatToScreen(msg);
  // const item = document.createElement('li');
  // item.textContent = msg;
  // messages.appendChild(item);
  //window.scrollTo(0, document.body.scrollHeight);
});

async function getChatsAndGroups() {
  try {
    const token = localStorage.getItem("token");

    const groups = await axios.get(`http://localhost:3000/group/getgroup`, {
      headers: { authorization: token },
    });
    console.log(groups, "all groups fetched");

    /// now loop through group and find which task has groupid, and if that groupid belongs to admin or not if belongs to admin and userid matched it show it to screen
    //also add group while creating chat.
    const chats = await axios.get(`http://localhost:3000/chat/allchat`, {
      headers: { authorization: token },
    });
    console.log(chats, "chats");

    if (groups) {
      for (let group of groups.data.groups) {
        //console.log(group.group)
        showGroup(group);
      }
    }
    if (chats) {
      for (let message of chats.data.data) {
        console.log(message.message);
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
    const room = document.getElementById("roomInput").value;

    // to clear the input element
    document.getElementById("messageInput").value = "";

    const token = localStorage.getItem("token");
    const chat = await axios.post(
      "http://localhost:3000/chat/send",
      {
        message: message,
        groupName: room,
      },
      { headers: { authorization: token } }
    );
    console.log(chat, "chat post method done");

    // Send message to server using socket.io
    socket.emit("sendMessage", { message, room });
    //room=''

    if (chat.status === 201) {
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
  console.log(groupRow);
  const { group, id } = groupRow;
  const groupList = document.getElementById("groupList");

  const button = document.createElement("button");
  button.textContent = group;
  button.style.backgroundColor = "#00fcf6";
  button.style.color = "black";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Enter UserId";
  input.size = 7;

  const addButton = document.createElement("button");
  addButton.textContent = "AddAdmin";
  addButton.style.backgroundColor = "#ddd600";
  addButton.style.color = "black";

  const deleteGroup = document.createElement("button");
  deleteGroup.textContent = "X";
  deleteGroup.style.backgroundColor = "#08ec30";
  deleteGroup.style.color = "black";

  const buttonDiv = document.createElement("div");
  buttonDiv.style.marginBottom = "10px"; // Add margin below the buttonDiv
  button.style.marginRight = "10px";
  buttonDiv.appendChild(button);

  input.style.marginRight = "1px"; // Add margin to the right of the input element
  buttonDiv.appendChild(input);

  addButton.style.marginRight = "10px"; // Add margin to the right of the addButton element
  buttonDiv.appendChild(addButton);

  deleteGroup.style.marginLeft = "3px"; // Add margin to the left of the deleteGroup element
  buttonDiv.appendChild(deleteGroup);

  groupList.appendChild(buttonDiv);
  // Adding padding to the buttonDiv
  buttonDiv.style.padding = "10px";

  const token = localStorage.getItem("token");
  addButton.addEventListener("click", async () => {
    try {
      // add another user admin here
      const inputValue = input.value;
      console.log("addAdmin clicked");

      const adminCreated = await axios.post(
        `http://localhost:3000/user/adduser?secondId=${inputValue}`,
        {
          groupId: id,
        },
        {
          headers: { authorization: token },
        }
      );

      console.log(adminCreated, "adminCreated succesfully");
    } catch (error) {
      console.log(error, "error in adding admin");
    }
  });

  deleteGroup.addEventListener("click", async () => {
    try {
      const groupId = id;
      const token = localStorage.getItem("token");
      console.log(token, "token in deletingGroup");
      const deleteGroup = await axios.post(
        `http://localhost:3000/group/groupdelete`,
        {
          groupId: groupId,
        },
        {
          headers: { authorization: token },
        }
      );
      console.log(deleteGroup, "deleteGroup in chat.js");
      location.reload();
    } catch (error) {
      console.log(error, "error in deleting group");
    }
  });

  button.addEventListener("click", function (e) {
    // Add your code here to perform the action you want when the button is clicked
    console.log("Button clicked!");
    console.log(e);
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
  socket.emit("join-room", groupName, (err, res) => {
    if (err) {
      console.log(err, "error in join-group");
    }
  });
  console.log(group, "group created in database in chat.js");
  showGroup(group.data.group);
}

async function download() {
  try {
    const token = localStorage.getItem("token");
    console.log("download clicked", token);
    const download = await axios.get(
      "http://localhost:3000/chat/chatdownload",
      {
        headers: { authorization: token },
      }
    );
    console.log(download, "download in downloading chat");

    if (download.status === 201) {
      //the bcakend is essentially sending a download link
      //  which if we open in browser, the file would download
      var a = document.createElement("a");
      a.href = download.data.fileUrl;
      a.download = "mychats.csv";
      a.click();
    } else {
      throw new Error(download.data.message);
    }
  } catch (error) {
    console.log(error, "error in download in chat js");
  }
}
