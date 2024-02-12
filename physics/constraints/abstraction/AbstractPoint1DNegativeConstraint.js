class AbstractPoint1DNegativeConstraint {

	constructor(point) {
		this.point = point;
	}

	solve() {
		const position = this.point.getPosition();
		if (position > 0.0) {
			changeAbstractPoint1DPosition(this.point, -position);
		}
	}

}
