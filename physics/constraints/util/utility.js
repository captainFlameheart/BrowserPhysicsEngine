function solveContact(
	body0, displacement0, 
	body1, displacement1, 
	normal, penetration, 
	restitutionCoefficient, restitutionThreshold, frictionCoefficient
) {
	const tangent = Vector2D.perpendicularClockwise(normal);

	const contact = new PointPair(
		new DisplacedPoint(body0, displacement0), 
		new DisplacedPoint(body1, displacement1)
	);
	const normalContact = new ProjectedPoint(contact, normal);
	const normalLightness = normalContact.getLightness();
	const normalPositionImpulse = penetration / normalLightness;

	const contactStepVelocity = contact.getStepVelocity();
	const normalStepVelocity = Vector2D.dot(contactStepVelocity, normal);
	//const restitutionCoefficient = 0.5;
	//const restitutionThreshold = 0.2;
	let deltaNormalStepVelocity;
	if (normalStepVelocity < -restitutionThreshold) {
		deltaNormalStepVelocity = -(1.0 + restitutionCoefficient) 
			* normalStepVelocity;
	} else if (-restitutionThreshold <= normalStepVelocity 
				&& normalStepVelocity < 0.0) {
		deltaNormalStepVelocity = -normalStepVelocity;
	} else {
		deltaNormalStepVelocity = 0.0;
	}
	const normalStepImpulse = 
		deltaNormalStepVelocity / normalLightness;
	normalContact.applyStepImpulse(normalStepImpulse);

	const tangentStepVelocity = 
		Vector2D.dot(contactStepVelocity, tangent);
	const tangentStepSpeed = Math.abs(tangentStepVelocity);
	//const frictionCoefficient = 5.0;
	const deltaTangentStepVelocity = Math.min(
		frictionCoefficient * normalPositionImpulse, 
		tangentStepSpeed
	) * Math.sign(-tangentStepVelocity);
	const tangentContact = new ProjectedPoint(contact, tangent);
	tangentContact.changeStepVelocity(deltaTangentStepVelocity);

	normalContact.applyPositionImpulseWithKeptVelocity(
		normalPositionImpulse);
}
