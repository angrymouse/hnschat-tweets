var http = require("https");
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
			if (body.message === "!hns") {
				let price = hnsPrice().then(function(price){
					if (price) {
						reply(body, "$"+price);
					}
				});
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

async function hnsPrice() {
	let options = {
		host: "api.coingecko.com",
		path: "/api/v3/simple/price?ids=handshake&vs_currencies=usd",
	}

	let output = new Promise(function(resolve) {
		http.get(options, function(r){
			var response = '';
			
			r.on('data', function (chunk) {
				response += chunk;
			});
			r.on('end', function () {
				let json = JSON.parse(response);
				resolve(json.handshake.usd);
			});
		}).on('error', function(e) {
			resolve();
		});
	});

	return await output;
}
