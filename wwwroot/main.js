import { Point } from '/Point.js';
import { Shape } from '/Shape.js';

export { startGame, processInput };

const rows = 20;
const columns = 10; 
const inputType = Object.freeze({ Left: 0, Down: 1, Right: 2, RotateLeft: 3, RotateRight: 4 });

let shape1 = new Shape("#FF0000","#770000", [new Point(0,0), new Point(1,0),new Point(2,0),new Point(3,0)]);
let shape2 = new Shape("#00FF00","#007700", [new Point(0,0), new Point(1,0),new Point(0,1),new Point(1,1)]);
let shape3 = new Shape("#0000FF","#000077", [new Point(0,0), new Point(1,0),new Point(2,0),new Point(2,1)]);
let shape4 = new Shape("#FF00FF","#770077", [new Point(0,0), new Point(1,0),new Point(1,1),new Point(2,1)]);
let shape5 = new Shape("#FFFF00","#777700", [new Point(0,0), new Point(1,0),new Point(2,0),new Point(1,1)]);
let shape6 = new Shape("#00FFFF","#007777", [new Point(0,0), new Point(1,0),new Point(2,0),new Point(0,1)]);
let shape7 = new Shape("#FFFFFF","#777777", [new Point(0,0), new Point(0,1),new Point(1,1),new Point(1,2)]);
let currentShape;
let  nextShape;
let x;
let y;
let angle;
let gameBoard;
let lines
let level
let speed;
let intervalId;

document.getElementById("startGameButton").addEventListener("click", startGame);
document.getElementById("leftButton").addEventListener("click", function () { processInput(inputType.Left)});
document.getElementById("downButton").addEventListener("click", function () { processInput(inputType.Down) });
document.getElementById("rightButton").addEventListener("click", function () { processInput(inputType.Right) });
document.getElementById("rotateLeftButton").addEventListener("click", function () { processInput(inputType.RotateLeft) });
document.getElementById("rotateRightButton").addEventListener("click", function () { processInput(inputType.RotateRight) });
showHighScores();

document.onkeypress = function (e) {
    e = e || window.event;
	let input;

	if (e.key === "a") {
		input = inputType.Left;
		processInput(input); 
	}

	if (e.key === "d") {
		input = inputType.Right;
		processInput(input); 
	}

	if (e.key === "s") {
		input = inputType.Down;
		processInput(input); 
	}

	if (e.key === "<" || e.key === ",") {
		input = inputType.RotateLeft;
		processInput(input); 
	}

	if (e.key === ">" || e.key === ".") {	
		input = inputType.RotateRight;
		processInput(input); 
	}
};

function processInput(input) {
	let draw = false;

	switch (input) {
		case inputType.Left:
			if (!shapeIntersectWithBoard(x - 1, y)) {
				x = x - 1;
				draw = true;
			}
			break;

		case inputType.Right:
			if (!shapeIntersectWithBoard(x + 1, y)) {
				x = x + 1;
				draw = true;
			}
			break;

		case inputType.Down:
			if (!shapeIntersectWithBoard(x, y + 1)) {
				y = y + 1
				draw = true;
			}
			break;

		case inputType.RotateLeft:
			angle = angle - 1;

			if (angle < 0) {
				angle = 3;
			}

			draw = true;
			currentShape.rotateShape90Degrees();
			break;

		case inputType.RotateRight:
			angle = angle + 1;

			if (angle > 3) {
				angle = 0;
			}

			draw = true;
			currentShape.rotateShape90Degrees();
			break;
	}

	if (draw) {
		let canvas = document.getElementById("gameCanvas");
		drawBoard(canvas);
		drawShape(canvas, currentShape, x, y, null);
	}
}

function showHighScores() {
	document.getElementById("highScores").style.display = "initial";
	document.getElementById("gameCanvas").style.display = "none";
	document.getElementById("gameInfoPanel").style.display = "none";

	let ulScores = document.getElementById("scores");
	while (ulScores.firstChild) {
		ulScores.removeChild(ulScores.firstChild)
	}

	fetch('/api/highscore')
		.then(response => response.json())
		.then(data => {
			console.log(data);
			let ulScores = document.getElementById("scores");
			for (let i = 0; i < data.length; i++) {
				let obj = data[i];

				console.log(obj.name);

				let li = document.createElement("li");
				li.appendChild(document.createTextNode(obj.name+" - "+obj.score));
				ulScores.appendChild(li);
			}});
}

function saveScore(newScore) {
	console.log("Save Score");

	let saveDialog = document.getElementById("saveDialog");

	document.querySelector('#submitScoreButton').onclick = function () {
		let nameTextBox = document.querySelector('#nameTextBox');

		let highScoreModel = {
			name: nameTextBox.value,
			score: newScore
		};

		console.log(highScoreModel);

		let response = fetch('/api/highscore', {
			method: 'post',
			headers: {
				"Content-type": "application/json"
			},
			body: JSON.stringify(highScoreModel)
		}).then(() => {
			saveDialog.close();
			showHighScores();
		})
	};

	document.querySelector('#ignoreButton').onclick = function () {
		saveDialog.close();
		showHighScores();
	};

	//Show dialog
	saveDialog.showModal();
}

function startGame() {
	console.log("Start game");

	document.getElementById("highScores").style.display = "none";
	document.getElementById("gameCanvas").style.display = "initial";
	document.getElementById("gameInfoPanel").style.display = "initial";

	lines = 0;
	level = 1;
	x = columns / 2;
	y = 0;
	angle = 0;
	speed = 1000;
	currentShape = getNextShape();

	initialiseBoard();

	let canvas = document.getElementById("gameCanvas");
	drawBoard(canvas);

	displayLines(lines);
	displayLevel(level);

	console.log(gameBoard);
	setGameSpeed(speed);
}

function setGameSpeed(speed){
	console.log("Set game speed "+speed+"ms");

	if (intervalId !== undefined){
		window.clearInterval(intervalId);
	}
	
	intervalId = window.setInterval(processGame, speed);
}

function initialiseBoard() {
	gameBoard = new Array(rows);
	for (let i = 0; i < gameBoard.length; i++) {
		let columnVals = new Array(columns);

		for (let j = 0; j < columns; j++) {
			columnVals[j] = null;
		}

		gameBoard[i] = columnVals;
	}
}

function processGame() {
	//console.log("processGame")

	let canvas = document.getElementById("gameCanvas");
	drawBoard(canvas);
	drawShape(canvas, currentShape, x, y, null);

	if (shapeIntersectWithBoard(x, y+1))
	{
		copyShapeToArray(currentShape);
		checkForCompleteLines();

		x = columns / 2;
		y = 0;
		angle = 0;
		currentShape = getNextShape();

		if (shapeIntersectWithBoard(x, y)) {

			if (intervalId !== undefined) {
				window.clearInterval(intervalId);
			}

			saveScore(lines);
		}
	}
	else
	{
		y = y + 1;
	}
}

function checkForCompleteLines(){
	for (let i = 0; i < gameBoard.length; i++) {
		let columnVals = gameBoard[i];
		let lineComplete = true;

		for (let j = 0; j < columns; j++) {
			if (columnVals[j] === null){
				lineComplete = false;
				break;
			}
		}

		if (lineComplete){
			lines = lines + 1;

			displayLines(lines);
			
			//Copy above lines down
			for (let k = i; k  > 0 ; k--) {
				gameBoard[k] = gameBoard[k-1];
			}

			//Clear top line
			let columnVals = new Array(columns);

			for (let l = 0; l < columns; l++) {
				columnVals[l] = null;
			}

			gameBoard[0] = columnVals

			//Update game speed
			if (lines % 5 === 0){
				if (speed>= 50) {
					speed = speed - 50;
					level = level+1;
					setGameSpeed(speed);

					displayLevel(level);
				}
			}
		}
	}
}

function displayLines(lines){
	console.log("Lines "+lines);
	let linesLabel = document.getElementById("linesLabel");
	linesLabel.innerHTML = "Lines - "+lines;
}

function displayLevel(level){
	console.log("Level "+level);
	let linesLabel = document.getElementById("levelLabel");
	linesLabel.innerHTML = "Level - "+level;
}

function clearBoard(canvas){
	//console.log("clearBoard")
	let ctx = canvas.getContext("2d");
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, canvas.width, canvas.height );
}

function drawBoard(canvas){
	//console.log("drawBoard")
	clearBoard(canvas);

	for (let tempY = 0; tempY < rows; tempY++) {
		for (let tempX = 0; tempX < columns; tempX++) {
			let tempShape = getBoardValue(tempX, tempY);
			if (tempShape !== null){
				drawBox(canvas, tempX, tempY, tempShape.colour, tempShape.colour2, null);
			}
		}
	}
}

function copyShapeToArray(shape){
	for (let i = 0; i < shape.points.length; i++) {
		setBoardValue(shape.points[i].x+x, shape.points[i].y+y, shape);
	}
}

function shapeIntersectWithBoard(tempX, tempY){
	let result = false;

	for (let i = 0; i < currentShape.points.length; i++) {
		if (currentShape.points[i].y+tempY >= (rows)){
			return true;
		}
	
		if (currentShape.points[i].x+tempX >= (columns)){
			return true;
		}
	
		if (currentShape.points[i].x+tempX < 0){
			return true;
		}
	
		if (getBoardValue(currentShape.points[i].x+tempX, currentShape.points[i].y+tempY) !== null){
			return true;
		}
	}

	return result;
}

function setBoardValue(x, y, shape){
	let columnVals = gameBoard[y];
	columnVals[x] = shape;
}

function getBoardValue(x, y){
	let columnVals = gameBoard[y];
	return columnVals[x];
}

function getNextShape(){
	let shape;

	if (nextShape === undefined){
		nextShape = getShape();
	}

	shape = nextShape;
	nextShape = getShape();

	let canvas = document.getElementById("nextShapeCanvas");

	clearBoard(canvas);

	let point = nextShape.calcBottomRight();
	drawShape(canvas, nextShape, 0, 0, point);

	return shape;
}

function getShape(){
	let val = Math.floor(Math.random() * 7);
	console.log("Get next shape = "+val);
	let shape = null;

	switch (val) {
		case 0:
			shape = shape1;
			break;
		case 1:
			shape = shape2;
			break;
		case 2:
			shape = shape3;
			break;
		case 3:
			shape = shape4;
			break;
		case 4:
			shape = shape5;
			break;
		case 5:
			shape = shape6;
			break;
		case 6:
			shape = shape7;
			break;
	}

	//Clone class as rotations will modify it
	return shape.clone();
}

function drawShape(canvas, shape, xOffset, yOffset, bottomRight) {
	for (let i = 0; i < shape.points.length; i++) {
		drawBox(canvas, shape.points[i].x+xOffset, shape.points[i].y+yOffset, shape.colour, shape.colour2, bottomRight);
	}
}

function drawBox(canvas, x, y, colour, colour2, bottomRight){
	let ctx = canvas.getContext("2d");
	let gameCanvas = document.getElementById("gameCanvas");
	let pixelWidth = gameCanvas.width/columns;
	let pixelHeight = gameCanvas.height/rows;
	//ctx.fillStyle = colour;
	
	let xPixelOffset = 0;
	let yPixelOffset = 0;

	if (bottomRight !== null){
		let bottomRightPixelsX = ((bottomRight.x+1) * pixelWidth)/2;
		let bottomRightPixelsY = ((bottomRight.y+1) * pixelHeight)/2;
		xPixelOffset = canvas.width/2 - (bottomRightPixelsX);
		yPixelOffset = canvas.height/2 - (bottomRightPixelsY);
	}

	let tempX = ((pixelWidth )*x) + xPixelOffset;
	let tempY = ((pixelHeight )*y) + yPixelOffset;

	let my_gradient = ctx.createLinearGradient(tempX, tempY, tempX+pixelWidth, tempY+pixelHeight);
	my_gradient.addColorStop(0, colour);
	my_gradient.addColorStop(1, colour2);
	ctx.fillStyle = my_gradient;
	ctx.fillRect(tempX , tempY, pixelWidth, pixelHeight );
}

