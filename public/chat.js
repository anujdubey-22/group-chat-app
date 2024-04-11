function sendMessage() {
    let message = document.getElementById('input-message').value;
    let messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.textContent = message;
    document.querySelector('.chat-messages').appendChild(messageDiv);
    document.getElementById('input-message').value = '';
}

function toggleTheme() {
    let container = document.querySelector('.chat-container');
    container.classList.toggle('dark-theme');
    container.classList.toggle('light-theme');
}
