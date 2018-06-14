// Make connection
var socket = io.connect('http://128.74.181.204:8080');

// Query DOM
var message = document.getElementById('message'),
      handle = document.getElementById('handle'),
      btn = document.getElementById('send'),
      output = document.getElementById('output'),
      feedback = document.getElementById('feedback');

// Emit events
btn.addEventListener('click', function(){
    socket.emit('chat', {
        message: message.value,
        handle: handle.value
    });
    message.value = "";
});

message.addEventListener('keypress', function(e){
    socket.emit('typing', handle.value);
    if(e.keyCode === 13){
      socket.emit('chat', {
          message: message.value,
          handle: handle.value
      });
      message.value = "";
    }
})

// Listen for events
socket.on('chat', function(data){
    feedback.innerHTML = '';
    output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
    messages = document.getElementsByTagName("p");
    lastMessage = messages[messages.length - 1];
    if(lastMessage)lastMessage.scrollIntoView(true);
});

socket.on('typing', function(data){
    feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
});
