class PointMass {
    
    constructor(stepVelocityOrigin, position, stepAcceleration, lightness) {
        this.stepVelocityOrigin = stepVelocityOrigin;
        this.position = position;
        this.stepAcceleration = stepAcceleration;
        this.lightness = lightness;
    }

    static default() {
        return new PointMass(
            Vector2D.zero(), Vector2D.zero(), Vector2D.zero(), 1.0
        );
    }

	getPosition() {
		return this.position;
	}

    setPosition(position) {
        this.stepVelocityOrigin.set(position);
        this.position.set(position);
    }

	getStepVelocity() {
		return Vector2D.subtract(this.position, this.stepVelocityOrigin);
	}

	setStepVelocity(stepVelocity) {
		this.stepVelocityOrigin = Vector2D.subtract(
			this.position, stepVelocity);
	}

	getVelocity(deltaTime) {
		return Vector2D.divide(this.getStepVelocity(), deltaTime);
	}

	setVelocity(velocity, deltaTime) {
		this.setStepVelocity(Vector2D.multiply(velocity, deltaTime));
	}

	getAcceleration(deltaTime) {
		return Vector2D.divide(this.stepAcceleration, deltaTime);
	}

	setAcceleration(acceleration, deltaTime) {
		this.stepAcceleration.set(Vector2D.multiply(acceleration, deltaTime));
	}

	getLightnessAlong(direction) {
		return this.lightness;
	}

	applyPositionImpulse(direction, impulse) {
		this.position.addScaled(direction, impulse * this.lightness);
		//this.body.applyOffsetPositionImpulse(
			//this.displacement, direction, impulse);
	}

	applyPositionImpulseWithKeptVelocity(direction, impulse) {
		const deltaPosition = Vector2D.multiply(
			direction, impulse * this.lightness);
		this.position.add(deltaPosition);
		this.stepVelocityOrigin.add(deltaPosition);
	}

	applyStepImpulse(direction, impulse) {
		const deltaStepVelocity = Vector2D.multiply(direction, 
			impulse * this.lightness);
		this.setStepVelocity(Vector2D.add(
			this.getStepVelocity(), deltaStepVelocity));
	}

	generateAbstractPoint2D() {
		return this;
	}

    step(deltaTime) {
        const stepVelocity = this.getStepVelocity();
		this.stepVelocityOrigin.set(this.position);
		stepVelocity.add(this.stepAcceleration);
		this.position.add(stepVelocity);
    }

}
