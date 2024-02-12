class AbstractPoint1DZeroConstraint {

	constructor(point) {
		this.point = point;
	}

	solve() {
		changeAbstractPoint1DPosition(this.point, -this.point.getPosition());
	}

}
