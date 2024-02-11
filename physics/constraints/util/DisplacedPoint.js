class DisplacedPoint {

	constructor(body, displacement) {
		this.body = body;
		this.displacement = displacement;
	}

	getStepVelocity() {
		return this.body.getOffsetStepVelocity(this.displacement);
	}

	getLightnessAlong(direction) {
		return this.body.getGeneralizedLightness(this.displacement, direction);
	}

	applyPositionImpulse(direction, impulse) {
		this.body.applyOffsetPositionImpulse(
			this.displacement, direction, impulse);
	}

	applyPositionImpulseWithKeptVelocity(direction, impulse) {
		this.body.applyOffsetPositionImpulseWithKeptVelocity(
			this.displacement, direction, impulse
		);
	}

	applyStepImpulse(direction, impulse) {
		this.body.applyOffsetStepImpulse(this.displacement, direction, impulse);
	}

}
