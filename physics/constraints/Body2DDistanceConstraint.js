class DistanceConstraint {

    constructor(pointGenerator, distance) {
		this.pointGenerator = pointGenerator;
        this.distance = distance;
    }

	static create0(body0, localPoint0, body1, localPoint1, distance) {
		return DistanceConstraint.create1(
			new Body2DLocalPoint(body0, localPoint0), 
			new Body2DLocalPoint(body1, localPoint1), 
			distance
		);
	}

	static create1(pointGenerator0, pointGenerator1, distance) {
		return new DistanceConstraint(new AbstractPoint2DGeneratorPair(
			pointGenerator0, 
			pointGenerator1
		), distance);
	}

	static create2(body0, localPoint0, pointGenerator1, distance) {
		return this.create1(
			new Body2DLocalPoint(body0, localPoint0), 
			pointGenerator1, 
			distance
		);
	}

    solve(deltaTime) {
		const point = this.pointGenerator.generateAbstractPoint2D();
		const currentDistance = AbstractPoint2DDistance.create(point);
		const offsetDistance = new OffsetAbstractPoint1D(
			currentDistance, this.distance);
		const constraint = new AbstractPoint1DNegativeConstraint(
			offsetDistance);
		constraint.solve();
    }

}
