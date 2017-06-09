function distanceBeetween(a, b) {
	let c = {x : b.x - a.x, y : b.y - a.y, z : b.z - a.z};
	return Math.sqrt(c.x * c.x + c.y * c.y + c.z * c.z)
}

function goToTarget(a, b) {
	let dir = {x : b.x - a.x, y : b.y - a.y, z : b.z - a.z};
	let dist = distanceBeetween(a, b);
	dir.x /= dist;
	dir.y /= dist;
	dir.z /= dist;
	return dir;
}


module.exports = {
	distanceBeetween : distanceBeetween,
	goToTarget : goToTarget
}
