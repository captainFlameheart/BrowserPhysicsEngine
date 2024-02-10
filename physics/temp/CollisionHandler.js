class CollisionHandler {

	constructor(circleColliders, directedLineColliders) {
		this.circleColliders = circleColliders;
		this.directedLineColliders = directedLineColliders;
	}

	static default() {
		return new CollisionHandler([], []);
	}

	solve() {
		for (const circleCollider of this.circleColliders) {
			for (const directedLineCollider of this.directedLineColliders) {
				this.solveCircleVsDirectedLineCollision(
					circleCollider, directedLineCollider);
			}
		}
	}

	solveCircleVsDirectedLineCollision(circleCollider, directedLineCollider) {
		const circleBody = circleCollider.body;
		const circle = circleCollider.circle;
		const directedLineBody = directedLineCollider.body;
		const directedLine = directedLineCollider.directedLine;

		const globalNormal = 
			directedLineBody.localToDisplacement(directedLine.normal);

		const circleDisplacement = 
			circleBody.localToDisplacement(circle.position);
		
		const globalCirclePosition = 
			circleBody.displacementToGlobal(circleDisplacement);

		const lineBodyToCircleBody = Vector2D.subtract(
			globalCirclePosition, 
			directedLineBody.position
		);

		const penetration = directedLine.position 
			- Vector2D.dot(lineBodyToCircleBody, globalNormal) 
			+ circle.radius;
		
		if (penetration < 0.0) {
			return;
		}

		const circleLightness = circleBody.getGeneralizedLightness(
			circleDisplacement, globalNormal
		);
		const directedLineLightness = directedLineBody.getGeneralizedLightness(
			lineBodyToCircleBody, globalNormal
		);
		const totalLightness = circleLightness + directedLineLightness;
		const positionImpulse = penetration / totalLightness;
		circleBody.applyOffsetPositionImpulse(
			circleDisplacement, globalNormal, positionImpulse);
		directedLineBody.applyOffsetPositionImpulse(
			lineBodyToCircleBody, globalNormal, -positionImpulse
		);
	}

}
