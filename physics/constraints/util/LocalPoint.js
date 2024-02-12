class LocalPoint {

	constructor(body, localPoint) {
		this.body = body;
		this.localPoint = localPoint;
	}

	getCurrentState() {
		return new DisplacedPoint(
			this.body, this.body.localToDisplacement(this.localPoint));
	}

}
