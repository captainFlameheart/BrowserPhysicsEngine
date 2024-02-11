class ProjectedPoint {

	constructor(point, direction) {
		this.point = point;
		this.direction = direction;
	}

	getStepVelocity() {
		return this.point.getStepVelocity().direction(this.direction);
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

	changePosition(deltaPosition) {
		this.applyPositionImpulse(deltaPosition / this.getLightness());
	}

	changePositionWithKeptVelocity(deltaPosition) {
		this.applyPositionImpulseWithKeptVelocity(
			deltaPosition / this.getLightness());
	}

	changeStepVelocity(deltaStepVelocity) {
		this.applyStepImpulse(deltaStepVelocity / this.getLightness());
	}

}
