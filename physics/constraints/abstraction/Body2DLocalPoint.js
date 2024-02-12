class Body2DLocalPoint {

	constructor(body, localPoint) {
		this.body = body;
		this.localPoint = localPoint;
	}

	getDisplacement() {
		return this.body.localToDisplacement(this.localPoint);
	}

	generateAbstractPoint2D() {
		return new Body2DDisplacedPoint(this.body, this.getDisplacement());
	}

}
