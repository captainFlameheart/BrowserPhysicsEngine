class AbstractPoint2DDistance {

	constructor(point, direction, distance) {
		this.point = point;
		this.direction = direction;
		this.distance = distance;
	}

	static create(point) {
		const direction = point.getPosition();
		const distance = direction.getLength();
		direction.divide(distance);
		return new AbstractPoint2DDistance(point, direction, distance);
	}

	getPosition() {
		return this.distance;
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
