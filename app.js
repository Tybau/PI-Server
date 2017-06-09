const {ServerEntity, ServerPlayer, ServerZombie} = require('./entity.js');
const {distanceBeetween, goToTarget} = require('./utils.js');

const io = require('socket.io').listen(8080)

let entities = {};

setInterval(() => {
	let players = [];
	let zombies = [];

	for(let entityId in entities) {
		let e = entities[entityId];
		if(e && e.type === "player")
			players.push(e);
		if(e && e.type === "zombie")
			zombies.push(e);
	}

	zombies.forEach(z => {
		let dMax = 10;
		let target = null;
		players.forEach(p => {
			let d = distanceBeetween(z.pos, p.pos);
			if(d < dMax) {
				dMax = d;
				target = p;
			}
		});
		if(target == null) return;
		let dir = goToTarget(z.pos, target.pos);
		z.pos.x += dir.x / 50;
		z.pos.z += dir.z / 50;

		z.rot.y = Math.atan2(dir.z, dir.x);
	});
}, 50);

io.on('connection', function(socket){
	let player = new ServerPlayer();
	entities[player.id] = player;
	socket.emit("gen-uuid", player.id);

	let timeoutHandle = setTimeout(() => {
		console.log(player.id + ' déconnecté !')
		socket.broadcast.emit("rm-entity", player.id);
		entities[player.id] = null;
	}, 5000);

	console.log(player.id + ' connecté !')

	socket.emit("sync-entities", entities);

	socket.on("tick-sync", function(p) {
		if(!entities[player.id]) return;
		entities[player.id].pos = p.pos;
		entities[player.id].rot = p.rot;
		socket.emit("sync-entities", entities);

		if(Math.random() > 0.999) {
			let zombie = new ServerZombie();
			zombie.pos = { x:Math.random() * 10 - 5, y:0, z:Math.random() * 10 - 5 };
			zombie.rot = { x:0, y:Math.random(), z:0};
			console.log("Zombie " + zombie.id + " added!");
			entities[zombie.id] = zombie;
		}

		clearTimeout(timeoutHandle)
		timeoutHandle = setTimeout(() => {
			console.log(player.id + ' déconnecté !')
			socket.broadcast.emit("rm-entity", player.id);
			delete entities[player.id];
		}, 5000);
	})

	socket.on("killall", (type) => {
		for(let entityId in entities) {
			let e = entities[entityId];
			if(e && e.type === type) {
				io.sockets.emit("rm-entity", e.id);
				console.log("Zombie " + e.id + " removed!");
				delete entities[entityId];
			}
		}
	});
});
