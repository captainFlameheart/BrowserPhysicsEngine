class PointMassDistanceConstraint {

    constructor(pointMass0, pointMass1, distance) {
        this.pointMass0 = pointMass0;
        this.pointMass1 = pointMass1;
        this.distance = distance;
    }

    solve() {
        const position0 = this.pointMass0.position;
        const lightness0 = this.pointMass0.lightness;
        const position1 = this.pointMass1.position;
        const lightness1 = this.pointMass1.lightness;

        const direction = Vector2D.subtract(position1, position0);
        const currentDistance = direction.getLength();
        if (currentDistance < 5.0) {
            return;
        }
        direction.divide(currentDistance);

        const error = currentDistance - this.distance;

        const totallightness = lightness0 + lightness1;

        position0.addScaled(direction, error * lightness0 / totallightness);
        position1.addScaled(direction, -error * lightness1 / totallightness);
    }

}
