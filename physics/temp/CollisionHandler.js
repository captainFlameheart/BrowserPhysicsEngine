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
		const directedLineBody = directedLineCollider.body;
		const directedLine = directedLineCollider.directedLine;

		const globalNormal = 
			directedLineBody.localToDisplacement(directedLine.normal);

		const circleContactDisplacement = Vector2D.subtractScaled(
			circleBody.localToDisplacement(circle.position), 
			globalNormal, circle.radius
		);
		
		const globalCircleContact = 
			circleBody.displacementToGlobal(circleContactDisplacement);

		const lineBodyToCircleContact = Vector2D.subtract(
			globalCircleContact, 
			directedLineBody.position
		);

		const penetration = directedLine.position 
			- Vector2D.dot(lineBodyToCircleContact, globalNormal);
		
		if (penetration < 0.0) {
			return;
		}

		const globalTangent = Vector2D.perpendicularClockwise(globalNormal);
		const lineContactDisplacement = Vector2D.add(
			Vector2D.multiply(globalNormal, directedLine.position), 
			Vector2D.multiply(globalTangent, 
				Vector2D.dot(lineBodyToCircleContact, globalTangent))
		);

		const circleNormalLightness = circleBody.getGeneralizedLightness(
			circleContactDisplacement, globalNormal
		);
		const directedLineNormalLightness = directedLineBody.getGeneralizedLightness(
			lineContactDisplacement, globalNormal
		);
		const totalNormalLightness = circleNormalLightness + directedLineNormalLightness;
		const normalPositionImpulse = penetration / totalNormalLightness;

		const contactVelocity = Vector2D.subtract(
			circleBody.getOffsetStepVelocity(circleContactDisplacement), 
			directedLineBody.getOffsetStepVelocity(lineContactDisplacement)
		);

		const normalStepVelocity = Vector2D.dot(contactVelocity, globalNormal);
		const restitutionCoefficient = 0.5;
		const restitutionThreshold = 0.2;
		const jitterAwareRestitutionCoefficient = 
			normalStepVelocity < -restitutionThreshold ? 
				restitutionCoefficient : 0.0;
		const deltaNormalStepVelocity = 
			(1.0 + jitterAwareRestitutionCoefficient) * normalStepVelocity;
		const normalStepImpulse = 
			deltaNormalStepVelocity / totalNormalLightness;
		circleBody.applyOffsetStepImpulse(
			circleContactDisplacement, globalNormal, -normalStepImpulse
		);
		directedLineBody.applyOffsetStepImpulse(
			lineContactDisplacement, globalNormal, normalStepImpulse
		);		

		const circleTangentLightness = circleBody.getGeneralizedLightness(
			circleContactDisplacement, globalTangent
		);
		const lineTangentLightness = directedLineBody.getGeneralizedLightness(
			lineContactDisplacement, globalTangent
		);
		const totalTangentLightness = circleTangentLightness + lineTangentLightness;
		const tangentStepVelocity = 
			Vector2D.dot(contactVelocity, globalTangent);
		const tangentStepSpeed = Math.abs(tangentStepVelocity);
		const frictionCoefficient = 1.5;
		const deltaTangentStepVelocity = Math.min(
			frictionCoefficient * normalPositionImpulse, 
			tangentStepSpeed
		) * Math.sign(tangentStepVelocity);
		const tangentStepImpulse = 
			deltaTangentStepVelocity / totalTangentLightness;
		circleBody.applyOffsetStepImpulse(
			circleContactDisplacement, globalTangent, -tangentStepImpulse
		);
		directedLineBody.applyOffsetStepImpulse(
			lineContactDisplacement, globalTangent, tangentStepImpulse
		);

		circleBody.applyOffsetPositionImpulseWithKeptVelocity(
			circleContactDisplacement, globalNormal, normalPositionImpulse);
		directedLineBody.applyOffsetPositionImpulseWithKeptVelocity(
			lineContactDisplacement, globalNormal, -normalPositionImpulse
		);
	}

}
