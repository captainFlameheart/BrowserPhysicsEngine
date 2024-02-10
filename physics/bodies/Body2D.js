class Body2D {
    
    constructor(
        previousPosition, previousAngle, position, angle, 
        velocity, angularVelocity, acceleration, angularAcceleration, 
        lightness, angularLightness
    ) {
        this.previousPosition = previousPosition;
        this.previousAngle = previousAngle;
        this.position = position;
        this.angle = angle;
        this.velocity = velocity;
        this.angularVelocity = angularVelocity;
        this.acceleration = acceleration;
        this.angularAcceleration = angularAcceleration;
        this.lightness = lightness;
        this.angularLightness = angularLightness;
    }

    static default() {
        return new Body2D(
            Vector2D.zero(), 0.0, Vector2D.zero(), 0.0, 
            Vector2D.zero(), 0.0, Vector2D.zero(), 0.0, 
            1.0, 1.0
        );
    }

    setPosition(position) {
        this.previousPosition.set(position);
        this.position.set(position);
    }

    setAngle(angle) {
        this.previousAngle = angle;
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

    getGeneralizedLightness(displacement, direction) {
        const cross = Vector2D.cross(displacement, direction);
        return this.lightness + this.angularLightness * cross * cross;
    }

	applyOffsetPositionImpulse(displacement, direction, impulse) {
		this.position.addScaled(direction, impulse * this.lightness);
        this.angle += impulse * Vector2D.cross(displacement, direction) 
            * this.angularLightness;
	}

    step(deltaTime) {
        this.previousPosition.set(this.position);
        this.velocity.addScaled(this.acceleration, deltaTime);
        this.position.addScaled(this.velocity, deltaTime);

        this.previousAngle = this.angle;
        this.angularVelocity += this.angularAcceleration * deltaTime;
        this.angle += this.angularVelocity * deltaTime;
    }

    updateVelocity(deltaTime) {
        this.velocity.set(Vector2D.divide(Vector2D.subtract(
            this.position, this.previousPosition), deltaTime
        ));
        this.angularVelocity = (this.angle - this.previousAngle) / deltaTime;
    }

}
