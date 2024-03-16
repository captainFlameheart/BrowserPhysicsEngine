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

		for (let i = 0; i < this.circleColliders.length - 1; i++) {
			const circleCollider0 = this.circleColliders[i];
			for (let j = i + 1; j < this.circleColliders.length; j++) {
				const circleCollider1 = this.circleColliders[j];
				this.solveCircleVsCircleContact(
					circleCollider0, circleCollider1);
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

		solveContact1(
			circleBody, circleContactDisplacement, 
			lineBody, lineContactDisplacement, 
			globalNormal, penetration, 
			0.5 * 0, 0.2 * 0, 5.0 * 0
		);
	}

	solveCircleVsCircleContact(circleCollider0, circleCollider1) {
		const body0 = circleCollider0.body;
		const circle0 = circleCollider0.circle;
		const body1 = circleCollider1.body;
		const circle1 = circleCollider1.circle;

		const circleDisplacement0 = body0.localToDisplacement(circle0.position);
		const circlePosition0 = body0.displacementToGlobal(circleDisplacement0);
		const circleDisplacement1 = body1.localToDisplacement(circle1.position);
		const circlePosition1 = body1.displacementToGlobal(circleDisplacement1);

		const normal = Vector2D.subtract(circlePosition0, circlePosition1);
		const distance = normal.getLength();
		normal.divide(distance);
		const penetration = circle0.radius + circle1.radius - distance;
		if (penetration < 0.0) {
			return;
		}
		const contactDisplacement0 = Vector2D.addScaled(
			circle0.position, normal, -circle0.radius);
		const contactDisplacement1 = Vector2D.addScaled(
			circle1.position, normal, circle1.radius);
		solveContact1(
			body0, contactDisplacement0, 
			body1, contactDisplacement1, 
			normal, penetration, 
			0.5 * 0, 0.2 * 0, 10.0 * 0
		);
	}

}
