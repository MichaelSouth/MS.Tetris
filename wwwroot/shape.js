import { Point } from '/Point.js';

export class Shape {
	constructor(colour, colour2, points) {
		this.colour = colour;
		this.colour2 = colour2;
		this.points = points;
	}

	calcBottomRight() {
		let bottomRight = new Point(0, 0);

		for (let i = 0; i < this.points.length; i++) {
			if (this.points[i].x >= bottomRight.x && this.points[i].y >= bottomRight.y) {
				bottomRight = this.points[i];
			}
		}

		return bottomRight;
	}

	rotateShape90Degrees() {
		console.log("rotateShape90Degrees");
		for (let i = 0; i < this.points.length; i++) {
			this.points[i] = this.rotatePoint90Degrees(this.points[i]);
		}
	}

	rotatePoint90Degrees(point) {
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
		let tempX, tempY;

		tempY = point.x;
		if (point.y === 0) {
			tempX = 3;
		}
		if (point.y === 1) {
			tempX = 2;
		}
		if (point.y === 2) {
			tempX = 1;
		}
		if (point.y === 3) {
			tempX = 0;
		}

		return new Point(tempX, tempY);
	}

	clone() {
		let tempPoints = new Array(this.points);
		for (let i = 0; i < this.points.length; i++) {
			tempPoints[i] = new Point(this.points[i].x, this.points[i].y)
		}

		return new Shape(this.colour, this.colour2, tempPoints);
	}
}