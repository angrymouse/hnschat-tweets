var WebSocket = require("ws");

let session = "your session id";
let domain = "your domain id";

let socket = new WebSocket("wss://ws.hns.chat");

socket.onopen = function(e) {
	socket.send("IDENTIFY "+session);
};

socket.onmessage = function(e) {
	let message = e.data;
	let split = message.match(/(?<command>[A-Z]+)\s(?<body>.+)/);
	let command = split.groups.command;
	let body = JSON.parse(split.groups.body);

	switch (command) {
		case "MESSAGE":
			if (body.message === "!bot") {
				reply(body, "Hi, I'm a bot.");
			}
			break;
	}
};

function reply(message, string) {
	let data = {
		action: "sendMessage",
		conversation: message.conversation,
		from: domain,
		message: string
	};

	ws("ACTION", data);
}

function ws(command, body) {
	socket.send(command+" "+JSON.stringify(body));
}


