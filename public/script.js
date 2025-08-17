const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  input.value = '';

  const thinkingMessage = appendMessage('bot', 'Gemini is thinking...');

  fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ messages: [{ role: 'user', content: userMessage }] })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data && data.result) {
        thinkingMessage.textContent = data.result;
      } else {
        thinkingMessage.textContent = 'Sorry, no response received.';
      }
    })
    .catch(error => {
      console.error('Error:', error);
      thinkingMessage.textContent = 'Failed to get response from server.';
    });
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;

  // Add text content to the message
  chatBox.appendChild(msg);

  // Scroll to the bottom of the chat box
  chatBox.scrollTop = chatBox.scrollHeight;


  // Return the message element
  return msg;
}
