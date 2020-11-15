const rows = 20;
const columns = 10; 

var shape1 = new Shape("#FF0000","#770000", [new Point(0,0), new Point(1,0),new Point(2,0),new Point(3,0)]);
var shape2 = new Shape("#00FF00","#007700", [new Point(0,0), new Point(1,0),new Point(0,1),new Point(1,1)]);
var shape3 = new Shape("#0000FF","#000077", [new Point(0,0), new Point(1,0),new Point(2,0),new Point(2,1)]);
var shape4 = new Shape("#FF00FF","#770077", [new Point(0,0), new Point(1,0),new Point(1,1),new Point(2,1)]);
var shape5 = new Shape("#FFFF00","#777700", [new Point(0,0), new Point(1,0),new Point(2,0),new Point(1,1)]);
var shape6 = new Shape("#00FFFF","#007777", [new Point(0,0), new Point(1,0),new Point(2,0),new Point(0,1)]);
var shape7 = new Shape("#FFFFFF","#777777", [new Point(0,0), new Point(0,1),new Point(1,1),new Point(1,2)]);
var currentShape;
var  nextShape;
var x;
var y;
var angle;
var gameBoard;
var lines
var level
var speed;
var intervalId;

document.onkeypress = function (e) {
    e = e || window.event;
	//console.log(e.key);
	var draw = false;

	if (e.key == "a"){
		if (!shapeIntersectWithBoard(x-1, y)){
			x = x - 1;
			draw = true;
		}
	}

	if (e.key == "d"){
		if (!shapeIntersectWithBoard(x+1, y)){
			x = x + 1;
			draw = true;
		}
	}

	if (e.key == "s"){
		if (!shapeIntersectWithBoard(x, y+1)){
			y = y +1
			draw = true;
		}
	}

	if (e.key == "<" || e.key == ","){
		angle = angle - 1;

		if (angle < 0){
			angle  = 3;
		}

		draw = true;
		rotateShape90Degrees(currentShape);
	}

	if (e.key == ">"|| e.key == "."){		
		angle = angle + 1;

		if (angle > 3){
			angle  = 0;
		}
		
		draw = true;
		rotateShape90Degrees(currentShape);
	}

	if (draw){
		var canvas = document.getElementById("gameCanvas");
		drawBoard(canvas);
		drawShape(canvas, currentShape, x, y, null);
	}
};

startGame();

function startGame() {
	console.log("Start game");
	lines = 0;
	level = 1;
	x = columns / 2;
	y = 0;
	angle = 0;
	speed = 1000;
	currentShape = getNextShape();

	initialiseBoard();

	var canvas = document.getElementById("gameCanvas");
	drawBoard(canvas);

	displayLines(lines);
	displayLevel(level);

	console.log(gameBoard);
	setGameSpeed(speed);
}

function setGameSpeed(speed){
	console.log("Set game speed "+speed+"ms");

	if (intervalId != undefined){
		window.clearInterval(intervalId);
	}
	
	intervalId = window.setInterval(processGame, speed);
}

function initialiseBoard() {
	gameBoard = new Array(rows);
	for (var i = 0; i < gameBoard.length; i++) {
		var columnVals = new Array(columns);

		for (var j = 0; j < columns; j++) {
			columnVals[j] = null;
		}

		gameBoard[i] = columnVals;
	}
}

function processGame() {
	//console.log("processGame")

	var canvas = document.getElementById("gameCanvas");
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

		if (shapeIntersectWithBoard(x, y)){
		 	startGame();
		}
	}
	else
	{
		y = y + 1;
	}
}

function checkForCompleteLines(){
	for (var i = 0; i < gameBoard.length; i++) {
		var columnVals = gameBoard[i];
	    var lineComplete = true;

		for (var j = 0; j < columns; j++) {
			if (columnVals[j] == null){
				lineComplete = false;
				break;
			}
		}

		if (lineComplete){
			lines = lines + 1;

			displayLines(lines);
			
			//Copy above lines down
			for (var k = i; k  > 0 ; k--) {
				gameBoard[k] = gameBoard[k-1];
			}

			//Clear top line
			var columnVals = new Array(columns);

			for (var l = 0; l < columns; l++) {
				columnVals[l] = null;
			}

			gameBoard[0] = columnVals

			//Update game speed
			if (lines % 5 == 0){
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
	var linesLabel = document.getElementById("linesLabel");
	linesLabel.innerHTML = "Lines - "+lines;
}

function displayLevel(level){
	console.log("Level "+level);
	var linesLabel = document.getElementById("levelLabel");
	linesLabel.innerHTML = "Level - "+level;
}

function clearBoard(canvas){
	//console.log("clearBoard")
	var ctx = canvas.getContext("2d");
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, canvas.width, canvas.height );
}

function drawBoard(canvas){
	//console.log("drawBoard")
	clearBoard(canvas);

	for (var tempY = 0; tempY < rows; tempY++) {
		for (var tempX = 0; tempX < columns; tempX++) {
			var tempShape = getBoardValue(tempX, tempY);
			if (tempShape != null){
				drawBox(canvas, tempX, tempY, tempShape.colour, tempShape.colour2, null);
			}
		}
	}
}

function rotateShape90Degrees(shape){
	console.log("rotateShape90Degrees");
	for (var i = 0; i < shape.points.length; i++) {
		shape.points[i] = rotatePoint90Degrees(shape.points[i]);
	}
}

function rotatePoint90Degrees(point){
	// 0,0 = 3,0 
	// 1,0 = 3,1 
	// 2,0 = 3,2 
	// 3,0 = 3,3 

	// 0,1 = 2,0
	// 1,1 = 2,1 
	// 2,1 = 2,2 
	// 3,1 = 2,3 

	// 0,2 = 1,0 
	// 1,2 = 1,1 
	// 2,2 = 1,2 
	// 3,2 = 1,3 

	// 0,3 = 0,0 
	// 1,3 = 0,1 
	// 2,3 = 0,2 
	// 3,3 = 0,3 
	var tempX, tempY;

	tempY = point.x;
	if (point.y == 0){
		tempX = 3;
	}
	if (point.y == 1){
		tempX = 2;
	}
	if (point.y == 2){
		tempX = 1;
	}
	if (point.y == 3){
		tempX = 0;
	}

	return new Point(tempX, tempY);
}

function copyShapeToArray(shape){
	for (var i = 0; i < shape.points.length; i++) {
		setBoardValue(shape.points[i].x+x, shape.points[i].y+y, shape);
	}
}

function shapeIntersectWithBoard(tempX, tempY){
	var result = false;

	for (var i = 0; i < currentShape.points.length; i++) {
		if (currentShape.points[i].y+tempY >= (rows)){
			return true;
		}
	
		if (currentShape.points[i].x+tempX >= (columns)){
			return true;
		}
	
		if (currentShape.points[i].x+tempX < 0){
			return true;
		}
	
		if (getBoardValue(currentShape.points[i].x+tempX, currentShape.points[i].y+tempY) != null){
			return true;
		}
	}

	return result;
}

function setBoardValue(x, y, shape){
	var columnVals = gameBoard[y];
	columnVals[x] = shape;
}

function getBoardValue(x, y){
	var columnVals = gameBoard[y];
	return columnVals[x];
}

function getNextShape(){
	var shape;

	if (nextShape == undefined){
		nextShape = getShape();
	}

	shape = nextShape;
	nextShape = getShape();

	var canvas = document.getElementById("nextShapeCanvas");

	clearBoard(canvas);

	var point = nextShape.calcBottomRight();
	drawShape(canvas, nextShape, 0, 0, point);

	return shape;
}

function getShape(){
	var val = Math.floor(Math.random() * 7);
	console.log("Get next shape = "+val);
	var shape = null;

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
	for (var i = 0; i < shape.points.length; i++) {
		drawBox(canvas, shape.points[i].x+xOffset, shape.points[i].y+yOffset, shape.colour, shape.colour2, bottomRight);
	}
}

function drawBox(canvas, x, y, colour, colour2, bottomRight){
	var ctx = canvas.getContext("2d");
	var gameCanvas = document.getElementById("gameCanvas");
	var pixelWidth = gameCanvas.width/columns;
	var pixelHeight = gameCanvas.height/rows;
	//ctx.fillStyle = colour;
	
	var xPixelOffset = 0;
	var yPixelOffset = 0;

	if (bottomRight != null){
		var bottomRightPixelsX = ((bottomRight.x+1) * pixelWidth)/2;
		var bottomRightPixelsY = ((bottomRight.y+1) * pixelHeight)/2;
		xPixelOffset = canvas.width/2 - (bottomRightPixelsX);
		yPixelOffset = canvas.height/2 - (bottomRightPixelsY);
	}

	var tempX = ((pixelWidth )*x) + xPixelOffset;
	var tempY = ((pixelHeight )*y) + yPixelOffset;

	var my_gradient = ctx.createLinearGradient(tempX, tempY, tempX+pixelWidth, tempY+pixelHeight);
	my_gradient.addColorStop(0, colour);
	my_gradient.addColorStop(1, colour2);
	ctx.fillStyle = my_gradient;
	ctx.fillRect(tempX , tempY, pixelWidth, pixelHeight );
}

