class Shape {
	constructor(colour, colour2, points) {
		this.colour = colour;
		this.colour2 = colour2;
		this.points = points;
	}

	calcBottomRight() {
		var bottomRight = new Point(0, 0);

		for (var i = 0; i < this.points.length; i++) {
			if (this.points[i].x >= bottomRight.x && this.points[i].y >= bottomRight.y) {
				bottomRight = this.points[i];
			}
		}

		return bottomRight;
	}

	clone() {
		var tempPoints = new Array(this.points);
		for (var i = 0; i < this.points.length; i++) {
			tempPoints[i] = new Point(this.points[i].x, this.points[i].y)
		}

		return new Shape(this.colour, this.colour2, tempPoints);
	}
}