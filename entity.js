class ServerEntity {
	constructor (type) {
		this.type = type;
		this.id = genUUID();
		this.pos = {x : 0, y : 0, z : 0};
		this.rot = {x : 0, y : 0, z : 0};
	}
}

class ServerPlayer extends ServerEntity{
	constructor () {
		super("player");
	}
}

class ServerZombie extends ServerEntity{
	constructor () {
		super("zombie");
	}
}

function genUUID () {
	var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
        d += performance.now(); //use high-precision timer if available
    }
    return 'xxxx-xxxx-xxxx-xxxx-xxxx'.replace(/[x]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

module.exports = {
	ServerEntity : ServerEntity,
	ServerPlayer : ServerPlayer,
	ServerZombie : ServerZombie,
	genUUID : genUUID
}
