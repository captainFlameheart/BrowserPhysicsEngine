class PhysicsEngine {    
    
    constructor(bodies, constraints, subSteps) {
        this.bodies = bodies;
        this.constraints = constraints;
        this.subSteps = subSteps;
    }

    static default() {
        return new PhysicsEngine([], [], 10);
    }

    tick(deltaTime) {
        const subDeltaTime = deltaTime / this.subSteps;
        for (let i = 0; i < this.subSteps; i++) {
            for (const body of this.bodies) {
                body.step(subDeltaTime);
            }
            for (const constraint of this.constraints) {
                constraint.solve();
            }
            for (const body of this.bodies) {
                body.updateVelocity(subDeltaTime);
            }
        }
    }

}
