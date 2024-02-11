class Body2D {
    
    constructor(
        stepVelocityOrigin, angularStepVelocityOrigin, position, angle, 
		stepAcceleration, angularStepAcceleration, 
        lightness, angularLightness
    ) {
        this.stepVelocityOrigin = stepVelocityOrigin;
        this.angularStepVelocityOrigin = angularStepVelocityOrigin;
        this.position = position;
        this.angle = angle;
        this.stepAcceleration = stepAcceleration;
        this.angularStepAcceleration = angularStepAcceleration;
        this.lightness = lightness;
        this.angularLightness = angularLightness;
    }

    static default() {
        return new Body2D(
            Vector2D.zero(), 0.0, Vector2D.zero(), 0.0, 
            Vector2D.zero(), 0.0, 1.0, 1.0
        );
    }

    setPosition(position) {
        this.stepVelocityOrigin.set(position);
        this.position.set(position);
    }

    setAngle(angle) {
        this.angularStepVelocityOrigin = angle;
        this.angle = angle;
    }

    localToDisplacement(localPoint) {
        return Vector2D.rotate(localPoint, this.angle);
    }

    displacementToGlobal(displacement) {
        return Vector2D.add(this.position, displacement);
    }

    localToGlobal(localPoint) {
        return this.displacementToGlobal(this.localToDisplacement(localPoint));
    }

	getStepVelocity() {
		return Vector2D.subtract(this.position, this.stepVelocityOrigin);
	}

	setStepVelocity(stepVelocity) {
		this.stepVelocityOrigin.set(
			Vector2D.subtract(this.position, stepVelocity)
		);
	}

	getVelocity(deltaTime) {
		return Vector2D.divide(this.getStepVelocity(), deltaTime);
	}

	setVelocity(velocity, deltaTime) {
		this.stepVelocityOrigin.set(
			Vector2D.subtractScaled(this.position, velocity, deltaTime)
		);
	}

	getAcceleration(deltaTime) {
		return Vector2D.divide(this.stepAcceleration, deltaTime);
	}

	setAcceleration(acceleration, deltaTime) {
		this.stepAcceleration.set(Vector2D.multiply(acceleration, deltaTime));
	}

	getAngularStepVelocity() {
		return this.angle - this.angularStepVelocityOrigin;
	}

	setAngularStepVelocity(deltaAngle) {
		this.angularStepVelocityOrigin = this.angle - deltaAngle;
	}

	getAngularVelocity(deltaTime) {
		return this.getAngularStepVelocity() / deltaTime;
	}

	setAngularVelocity(angularVelocity, deltaTime) {
		this.setAngularStepVelocity(angularVelocity * deltaTime);
	}

	getAngularAcceleration(deltaTime) {
		return this.angularStepAcceleration / deltaTime;
	}

	setAngularAcceleration(angularAcceleration, deltaTime) {
		this.angularStepAcceleration = angularAcceleration * deltaTime;
	}

    getGeneralizedLightness(displacement, direction) {
        const cross = Vector2D.cross(displacement, direction);
        return this.lightness + this.angularLightness * cross * cross;
    }

	applyOffsetPositionImpulse(displacement, direction, impulse) {
		this.position.addScaled(direction, impulse * this.lightness);
        this.angle += impulse * Vector2D.cross(displacement, direction) 
            * this.angularLightness;
	}

	applyOffsetPositionImpulseWithKeptVelocity(displacement, direction, impulse)
	{
		const deltaPosition = 
			Vector2D.multiply(direction, impulse * this.lightness);
		const deltaAngle = impulse * Vector2D.cross(displacement, direction) 
			* this.angularLightness;
		
		this.position.add(deltaPosition);
		this.stepVelocityOrigin.add(deltaPosition);
		this.angle += deltaAngle;
		this.angularStepVelocityOrigin += deltaAngle;
	}

	getOffsetStepVelocity(displacement) {
		return Vector2D.add(
			this.getStepVelocity(), 
			Vector2D.zCross(this.getAngularStepVelocity(), displacement)
		);
	}

	applyOffsetStepImpulse(displacement, direction, impulse) {
		this.setStepVelocity(Vector2D.add(this.getStepVelocity(), 
			Vector2D.multiply(direction, impulse * this.lightness)));
        this.setAngularStepVelocity(this.getAngularStepVelocity() + 
			impulse * Vector2D.cross(displacement, direction) 
			* this.angularLightness);
	}

    step(deltaTime) {
		const stepVelocity = this.getStepVelocity();
		this.stepVelocityOrigin.set(this.position);
        stepVelocity.add(this.stepAcceleration);
        this.position.add(stepVelocity);

		let angularStepVelocity = this.getAngularStepVelocity();
        this.angularStepVelocityOrigin = this.angle;
        angularStepVelocity += this.angularStepAcceleration;
        this.angle += angularStepVelocity;
    }

	// TODO: Remove
    updateVelocity(deltaTime) {
        /*this.velocity.set(Vector2D.divide(Vector2D.subtract(
            this.position, this.stepVelocityOrigin), deltaTime
        ));
        this.angularVelocity = (this.angle - this.angularStepVelocityOrigin) / deltaTime;*/
    }

}
