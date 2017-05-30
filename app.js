const io = require('socket.io').listen(8080)

let players = {};

io.on('connection', function(socket){
	let player = new ServerPlayer();
	players[player.id] = player;
	socket.emit("gen-uuid", player.id);
	socket.broadcast.emit("new-player", player);

	let timeoutHandle = setTimeout(() => {
		console.log(player.id + ' déconnecté !')
		socket.broadcast.emit("rm-player", player.id);
		players[player.id] = null;
	}, 3000);

	console.log(player.id + ' connecté !')

	socket.emit("sync-others", players);

	socket.on("sync-me", function(p) {
		player = p;
		socket.broadcast.emit("sync-other", p);
		clearTimeout(timeoutHandle)
		timeoutHandle = setTimeout(() => {
			console.log(player.id + ' déconnecté !')
			socket.broadcast.emit("rm-player", player.id);
			delete players[player.id];
		}, 3000);
	})
});

class ServerPlayer {
	constructor () {
		this.id = genUUID();
		this.pos = {x : 0, y : 0, z : 0};
		this.rot = {x : 0, y : 0, z : 0};
	}
}

function genUUID () {
	var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
        d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}
