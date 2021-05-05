var ctx = document.getElementById('canvas').getContext('2d');
var starttime = Date.now();
var fpsmeasure = 0;
var elaptime = 0;
var preelaptime = 0;
var fps = 60;
var bq = 10;
var radremain = 1000;
var radlines = [];
var r = 400;

var sourceX = canvas.width / 2;
var sourceY = canvas.height / 3 * 2;

function timemanagement() {
	elaptime = Date.now() - starttime;
	fpsmeasure++;
	if (Math.floor((elaptime - preelaptime) / 1000)) {
		fps = Math.floor(100000 / ((elaptime - preelaptime) / fpsmeasure)) / 100;
		fpsmeasure = 0;
		preelaptime = elaptime;
	}
}

function drawfield() {
	ctx.strokeStyle = "#000000";
	ctx.strokeRect(0, sourceY, canvas.width, 1);
	ctx.fillStyle = "#FF0000";
	ctx.beginPath();
	ctx.arc(sourceX, sourceY, sourceY / 50, 0, Math.PI, true);
	ctx.fill();
}

function drawtime() {
	ctx.fillStyle = "#000000";
	ctx.font = "18px monospace";
	ctx.fillText("fps:" + fps, 5, canvas.height - 18);

}

function radpop() {
	let radnum = bq / 2 / fps;
	if (Math.random() < radnum) {
		radlines.push({ "theta": Math.random() * Math.PI - Math.PI / 2, "phi": Math.random() * Math.PI * 2, "rem": radremain });
	}
}

function drawradtrails() {
	for (let i = 0; i < radlines.length; i++) {
		ctx.strokeStyle = `rgba(0,0,0, ${1 - (radremain - radlines[i].rem) / 1000})`;
		ctx.beginPath();
		ctx.moveTo(sourceX, sourceY);
		ctx.lineTo(sourceX - r * Math.sin(radlines[i].theta) * Math.sin(radlines[i].phi),
			sourceY - r * Math.cos(radlines[i].theta));
		ctx.closePath();
		ctx.stroke();

		radlines[i].rem -= radremain / fps;
		if (radlines[i].rem <= 0) {
			radlines.shift();
			i--;
		}
	}
}

function mainLoop() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	radpop();
	drawradtrails();
	drawfield();
	drawtime();
	timemanagement();
}

(function loop() {
	mainLoop();
	window.requestAnimationFrame(loop);
}());