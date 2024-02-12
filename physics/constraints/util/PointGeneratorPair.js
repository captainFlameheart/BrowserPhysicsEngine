class PointGeneratorPair {
	
	constructor(pointGenerator0, pointGenerator1) {
		this.pointGenerator0 = pointGenerator0;
		this.pointGenerator1 = pointGenerator1;
	}

	getCurrentState() {
		return new PointPair(
			this.pointGenerator0.getCurrentState(), 
			this.pointGenerator1.getCurrentState()
		);
	}
	
}
