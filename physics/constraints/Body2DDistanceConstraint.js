class Body2DDistanceConstraint {

    constructor(body0, localPoint0, body1, localPoint1, distance) {
        this.body0 = body0;
        this.localPoint0 = localPoint0;
        this.body1 = body1;
        this.localPoint1 = localPoint1;
        this.distance = distance;
    }

    solve() {
        const displacement0 = this.body0.localToDisplacement(this.localPoint0);
        const globalPoint0 = this.body0.displacementToGlobal(displacement0);
        const displacement1 = this.body1.localToDisplacement(this.localPoint1);
        const globalPoint1 = this.body1.displacementToGlobal(displacement1);

        const direction = Vector2D.subtract(globalPoint1, globalPoint0);
        const currentDistance = direction.getLength();
        const error = currentDistance - this.distance;
        if (error < 0.0) {
            return;
        }
        direction.divide(currentDistance);

        const lightness0 = this.body0.generalizedLightness(displacement0, direction);
        const lightness1 = this.body1.generalizedLightness(displacement1, direction);
        const totalLightness = lightness0 + lightness1;

        const impulse = error / totalLightness;

        this.body0.position.addScaled(direction, impulse * this.body0.lightness);
        this.body0.angle += impulse * Vector2D.cross(displacement0, direction) 
            * this.body0.angularLightness;
        this.body1.position.addScaled(direction, -impulse * this.body1.lightness);
        this.body1.angle += -impulse * Vector2D.cross(displacement1, direction) 
            * this.body1.angularLightness;
    }

}
