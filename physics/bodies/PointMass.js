class PointMass {
    
    constructor(previousPosition, position, velocity, acceleration, lightness) {
        this.previousPosition = previousPosition;
        this.position = position;
        this.velocity = velocity;
        this.acceleration = acceleration;
        this.lightness = lightness;
    }

    static default() {
        return new PointMass(
            Vector2D.zero(), Vector2D.zero(), Vector2D.zero(), Vector2D.zero(), 1.0
        );
    }

    setPosition(position) {
        this.previousPosition.set(position);
        this.position.set(position);
    }

    step(deltaTime) {
        this.previousPosition.set(this.position);
        this.velocity.addScaled(this.acceleration, deltaTime);
        this.position.addScaled(this.velocity, deltaTime);
    }

    updateVelocity(deltaTime) {
        this.velocity.set(Vector2D.divide(Vector2D.subtract(
            this.position, this.previousPosition), deltaTime
        ));
    }

}
