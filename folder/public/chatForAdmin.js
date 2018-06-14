// Make connection
var socket = io.connect('http://192.168.1.254:80');

// Query DOM
var message = document.getElementById('message'),
	handle = document.getElementById('handle'),
	btn = document.getElementById('send'),
	output = document.getElementById('output'),
	feedback = document.getElementById('feedback');

let getChatHistory = () => {
	xhr = new XMLHttpRequest();
	xhr.open("GET", "/chat_history", true);
	xhr.onreadystatechange = () => {
		if(xhr.readyState != 4) return;
		if(xhr.status != 200){
			alert(xhr.status + " : " + xhr.statusText);
		} else{
			if(xhr.responseText !== "OK"){// if server didn't send object but did string "OK"
				let history = JSON.parse(xhr.responseText)
				Array.prototype.forEach.call(history, (elem) => {
					output.innerHTML += elem;
				})
			}
		}
	};
	xhr.send();
};

getChatHistory();

// Emit events
btn.addEventListener('click', function(){
	if(message.value === "") {
		return;
	}
	let date = new Date();
	let HMS = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ' ';
	socket.emit('chat', {
		message: '<span style="color:#FF00C2">' + message.value + '</span>',
		handle: handle.value,
		time: HMS
	});
	message.value = "";
});

message.addEventListener('keypress', function(e){
	if(message.value !== ""){
		socket.emit('typing', handle.value)
	}
	let date = new Date();
	let HMS = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ' ';
	if(e.keyCode === 13 && message.value !== ""){
		socket.emit('chat', {
			message: '<span style="color:#FF00C2">' + message.value+ '</span>',
			handle: handle.value,
			time:HMS
		});
		message.value = "";
	}
})

// Listen for events
socket.on('chat', function(data){
	feedback.innerHTML = '';
	output.innerHTML += '<p><small>' + data.time + '</small><strong>' + data.handle + ': </strong>' + data.message + '</p>';
	messages = document.getElementsByTagName("p");
	lastMessage = messages[messages.length - 1];
	if(lastMessage)lastMessage.scrollIntoView(true);
});

socket.on('typing', function(data){
	feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
});
