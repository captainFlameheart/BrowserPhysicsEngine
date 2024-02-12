class AbstractPoint2DProjection {

	constructor(point, direction) {
		this.point = point;
		this.direction = direction;
	}

	getPosition() {
		return Vector2D.dot(this.point.getPosition(), this.direction);
	}

	getVelocity() {
		return Vector2D.dot(this.point.getVelocity(), this.direction);
	}

	getLightness() {
		return this.point.getLightnessAlong(this.direction);
	}

	applyPositionImpulse(impulse) {
		this.point.applyPositionImpulse(this.direction, impulse);
	}

	applyPositionImpulseWithKeptVelocity(impulse) {
		this.point.applyPositionImpulseWithKeptVelocity(
			this.direction, impulse);
	}

	applyStepImpulse(impulse) {
		this.point.applyStepImpulse(this.direction, impulse);
	}

}
