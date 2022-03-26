let debug = document.querySelector("#debug"),
	debug2 = document.querySelector("#debug2"),
	canvas = document.querySelector("#canvas"),
	ctx = canvas.getContext("2d"),
	W = 600,
	H = 600,
	STEP = 1,
	MODEL_MIN_X = -1,
	MODEL_MAX_X = 1,
	MODEL_MIN_Y = -1,
	MODEL_MAX_Y = 1,
	points = [],
	dist = 5,
	tX,
	tY,
	initGeometry = () => {
		for (let x = -1; x <= 1; x += STEP) {
			for (let y = -1; y <= 1; y += STEP) {
				for (let z = -1; z <= 1; z += STEP) {
					points.push([x, y, z]);
				}
			}
		}
	},
	render = (x = 0, y = 0) => {
		ctx.clearRect(0, 0, W, H);

		tX = y / (W / 2);
		tY = x / (H / 2);

		points.forEach(p => {
			p = rotateX(p, tX);
			p = rotateY(p, tY);
			renderPoint(p);
		});
	},
	renderPoint = p => {
		let projectedPoint = project(p),
			x = projectedPoint[0],
			y = projectedPoint[1];

		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x + 1, y + 1);
		ctx.lineWidth = 4;
		ctx.strokeStyle = "#fff";
		ctx.stroke();
	},
	project = p => {
		let pp = perspectiveProjection(p);

		return [
			W * (pp[0] - MODEL_MIN_X) / (MODEL_MAX_X - MODEL_MIN_X),
			H * (1 - (pp[1] - MODEL_MIN_Y) / (MODEL_MAX_Y - MODEL_MIN_Y)),
		];
	},
	perspectiveProjection = p => {
		return [
			p[0] / (p[2] + dist),
			p[1] / (p[2] + dist),
		];
	},
	rotateX = (p, t) => {
		return [
			p[0],
			Math.cos(t) * p[1] - Math.sin(t) * p[2],
			Math.sin(t) * p[1] + Math.cos(t) * p[2],
		];
	},
	rotateY = (p, t) => {
		return [
			Math.cos(t) * p[0] - Math.sin(t) * p[2],
			p[1],
			Math.sin(t) * p[0] + Math.cos(t) * p[2],
		];
	};

canvas.width = W;
canvas.height = H;

initGeometry();
render();

canvas.addEventListener("mousemove", e => {
	let x = e.clientX - W / 2,
		y = -e.clientY + H / 2;

	debug.textContent = `Event: ${x} / ${y}`;

	render(x, y);
});