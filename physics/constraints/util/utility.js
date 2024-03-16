function changeAbstractPoint1DPosition(point, deltaPosition) {
	const impulse = deltaPosition / point.getLightness();
	point.applyPositionImpulse(impulse);
}

function changeAbstractPoint1DStepVelocity(point, deltaStepVelocity) {
	const impulse = deltaStepVelocity / point.getLightness();
	point.applyStepImpulse(impulse);
}

function solveContact1(
	body0, displacement0, 
	body1, displacement1, 
	normal, penetration, 
	restitutionCoefficient, restitutionThreshold, frictionCoefficient
) {
	const contact = new AbstractPoint2DPair(
		new Body2DDisplacedPoint(body0, displacement0), 
		new Body2DDisplacedPoint(body1, displacement1)
	);
	solveContact0(contact, normal, penetration, 
		restitutionCoefficient, restitutionThreshold, frictionCoefficient);
}

function solveContact0(
	contact, normal, penetration, 
	restitutionCoefficient, restitutionThreshold, frictionCoefficient
) {
	const tangent = Vector2D.perpendicularClockwise(normal);

	const normalContact = new AbstractPoint2DProjection(contact, normal);// new ProjectedPoint(contact, normal);
	const normalLightness = normalContact.getLightness();
	const normalPositionImpulse = penetration / normalLightness;
	const contactStepVelocity = contact.getStepVelocity();
	
	const normalStepVelocity = Vector2D.dot(contactStepVelocity, normal);
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
	const deltaTangentStepVelocity = Math.min(
		frictionCoefficient * normalStepImpulse/*normalPositionImpulse*/, 
		tangentStepSpeed
	) * Math.sign(-tangentStepVelocity);
	const tangentContact = new AbstractPoint2DProjection(contact, tangent);//new ProjectedPoint(contact, tangent);
	changeAbstractPoint1DStepVelocity(tangentContact, deltaTangentStepVelocity);//tangentContact.changeStepVelocity(deltaTangentStepVelocity);

	normalContact.applyPositionImpulseWithKeptVelocity(
		normalPositionImpulse);
}
