class OffsetAbstractPoint1D {

	constructor(point, relativePosition) {
		this.point = point;
		this.relativePosition = relativePosition;
	}

	getPosition() {
		return this.point.getPosition() - this.relativePosition;
	}

	getVelocity() {
		return this.point.getVelocity();
	}

	getLightness() {
		return this.point.getLightness();
	}

	applyPositionImpulse(impulse) {
		this.point.applyPositionImpulse(impulse);
	}

	applyPositionImpulseWithKeptVelocity(impulse) {
		this.point.applyPositionImpulseWithKeptVelocity(impulse);
	}

	applyStepImpulse(impulse) {
		this.point.applyStepImpulse(impulse);
	}

}
