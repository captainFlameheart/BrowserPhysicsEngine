class CollisionHandler {

	constructor(circleColliders, directedLineColliders) {
		this.circleColliders = circleColliders;
		this.directedLineColliders = directedLineColliders;
	}

	static default() {
		return new CollisionHandler([], []);
	}

	solve(deltaTime) {
		for (const circleCollider of this.circleColliders) {
			for (const directedLineCollider of this.directedLineColliders) {
				this.solveCircleVsDirectedLineCollision1(
					circleCollider, directedLineCollider, deltaTime);
			}
		}
	}

	solveCircleVsDirectedLineCollision(circleCollider, directedLineCollider, deltaTime) {
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

	solveCircleVsDirectedLineCollision1(circleCollider, directedLineCollider) {
		const circleBody = circleCollider.body;
		const circle = circleCollider.circle;
		const lineBody = directedLineCollider.body;
		const line = directedLineCollider.directedLine;

		const globalNormal = lineBody.localToDisplacement(line.normal);

		const circleContactDisplacement = Vector2D.subtractScaled(
			circleBody.localToDisplacement(circle.position), 
			globalNormal, circle.radius
		);
		const globalCircleContact = 
			circleBody.displacementToGlobal(circleContactDisplacement);

		const lineBodyToCircleContact = Vector2D.subtract(
			globalCircleContact, 
			lineBody.position
		);

		const penetration = line.position 
			- Vector2D.dot(lineBodyToCircleContact, globalNormal);
		if (penetration < 0.0) {
			return;
		}

		const lineContactDisplacement = Vector2D.addScaled(
			lineBodyToCircleContact, globalNormal, penetration);

		solveContact(
			circleBody, circleContactDisplacement, 
			lineBody, lineContactDisplacement, 
			globalNormal, penetration, 
			0.5, 0.2, 5.0
		);
	}

}
