class PointPair {

	constructor(point0, point1) {
		this.point0 = point0;
		this.point1 = point1;
	}

	getStepVelocity() {
		return Vector2D.subtract(
			this.point0.getStepVelocity(), 
			this.point1.getStepVelocity()
		);
	}

	getStepVelocityAlong(direction) {
		return this.getStepVelocity().dot(direction);
	}

	getLightnessAlong(direction) {
		return (
			this.point0.getLightnessAlong(direction) + 
			this.point1.getLightnessAlong(direction)
		);
	}

	applyPositionImpulse(direction, impulse) {
		this.point0.applyPositionImpulse(direction, impulse);
		this.point1.applyPositionImpulse(direction, -impulse);
	}

	applyPositionImpulseWithKeptVelocity(direction, impulse) {
		this.point0.applyPositionImpulseWithKeptVelocity(
			direction, impulse);
		this.point1.applyPositionImpulseWithKeptVelocity(
			direction, -impulse);
	}

	applyStepImpulse(direction, impulse) {
		this.point0.applyStepImpulse(direction, impulse);
		this.point1.applyStepImpulse(direction, -impulse);
	}

}
