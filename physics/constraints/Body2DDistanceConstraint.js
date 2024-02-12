class Body2DDistanceConstraint {

    constructor(point, distance) {
		this.point = point;
        this.distance = distance;
    }

	static create0(body0, localPoint0, body1, localPoint1, distance) {
		return new Body2DDistanceConstraint(new PointGeneratorPair(
			new LocalPoint(body0, localPoint0), 
			new LocalPoint(body1, localPoint1)
		), distance);
	}

    solve(deltaTime) {
        /*const displacement0 = this.body0.localToDisplacement(this.localPoint0);
        const globalPoint0 = this.body0.displacementToGlobal(displacement0);
        const displacement1 = this.body1.localToDisplacement(this.localPoint1);
        const globalPoint1 = this.body1.displacementToGlobal(displacement1);*/
		const currentPoint = this.point.getCurrentState();
		const direction = currentPoint.getPosition();
        //const direction = Vector2D.subtract(globalPoint1, globalPoint0);
        const currentDistance = direction.getLength();
        const error = currentDistance - this.distance;
        if (error < 0.0) {
            return;
        }
        direction.divide(currentDistance);

		const projectedPoint = new ProjectedPoint(currentPoint, direction);
		projectedPoint.changePosition(-error);

		/*
        const lightness0 = this.body0.getGeneralizedLightness(displacement0, direction);
        const lightness1 = this.body1.getGeneralizedLightness(displacement1, direction);
        const totalLightness = lightness0 + lightness1;

        const impulse = error / totalLightness;

		this.body0.applyOffsetPositionImpulse(
			displacement0, direction, impulse
		);
		this.body1.applyOffsetPositionImpulse(
			displacement1, direction, -impulse
		);*/
    }

}
