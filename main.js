const deltaTimeMilliseconds = 50;
const deltaTimeSeconds = 0.001 * deltaTimeMilliseconds;
const substeps = 100;
const deltaTime = deltaTimeSeconds / substeps;
let renderer;
let physicsEngine;
let collisionHandler;
let draggedBody = null;

function main() {
    canvas = document.getElementById('canvas');
    canvas.onmousemove = onMouseMove;
    renderer = canvas.getContext('2d');

    initialize();
    setInterval(() => tick(deltaTimeSeconds), deltaTimeMilliseconds);
}

function initialize() {
    physicsEngine = PhysicsEngine.default();
    physicsEngine.subSteps = substeps;

	collisionHandler = CollisionHandler.default();
	physicsEngine.constraints.push(collisionHandler);
	
	const ground = Body2D.default();
	ground.lightness = 0.0;
	ground.angularLightness = 0.0;
	physicsEngine.bodies.push(ground);

	const floorLine = new DirectedLine(new Vector2D(0.0, -1.0), -500.0);
	const floorCollider = new DirectedLineCollider(ground, floorLine);
	collisionHandler.directedLineColliders.push(floorCollider);

	const leftWallLine = new DirectedLine(new Vector2D(1.0, 0.0), 100.0);
	const leftWallCollider = new DirectedLineCollider(ground, leftWallLine);
	collisionHandler.directedLineColliders.push(leftWallCollider);

	const rightWallLine = new DirectedLine(new Vector2D(-1.0, 0.0), -700.0);
	const rightWallCollider = new DirectedLineCollider(ground, rightWallLine);
	collisionHandler.directedLineColliders.push(rightWallCollider);
	
	const radius = 5.0;
	const count = 200;
	for (let i = 0; i < count; i++) {
		const circleBody = Body2D.default();
		circleBody.angularLightness = 0.04;
		circleBody.setPosition(new Vector2D(
			100.0 + Math.random() * 500.0, 100.0 + Math.random() * 400.0));
		circleBody.setVelocity(new Vector2D(0.0, 0.0), deltaTime);
		circleBody.setAcceleration(new Vector2D(0.0, 1.0), deltaTime);
		physicsEngine.bodies.push(circleBody);

		const circle = new Circle(new Vector2D(0.0, 0.0), radius);
		const circleCollider = new CircleCollider(circleBody, circle);
		collisionHandler.circleColliders.push(circleCollider);
	}
	
	const firstIndex = physicsEngine.bodies.length - count;
	const lastIndex = physicsEngine.bodies.length - 1;
	const firstBody = physicsEngine.bodies[firstIndex];
	const lastBody = physicsEngine.bodies[lastIndex];

	firstBody.setVelocity(new Vector2D(-200.0, 0.0), deltaTime);
	//lastBody.setVelocity(new Vector2D(200.0, 0.0), deltaTime);

	/*const radius = 20.0;
	const count = 10;
	const pendelumLength = 100.0;
	const topLeft = new Vector2D(200.0, 300.0);
	createNewtonsCradle(radius, count, pendelumLength, topLeft);*/

	//createBallInBox();
    //createRope(new Vector2D(400.0, 100.0), new Vector2D(-10.0, 10.0), offset.getLength(), 20);
    //createCloth(new Vector2D(10.0, 10.0), 5.0, 120, 80);

    /*const body0 = Body2D.default();
    body0.setPosition(new Vector2D(100.0, 100.0));
    body0.angularLightness = 0.04;
    physicsEngine.bodies.push(body0);

    const body1 = Body2D.default();
    body1.setPosition(new Vector2D(100.0, 25.0));
    body1.lightness = 0.0;
    body1.angularLightness = 0.02;
    physicsEngine.bodies.push(body1);

    body = body1;

    const distanceConstraint = new Body2DDistanceConstraint(
        body0, new Vector2D(0.0, -20.0), body1, new Vector2D(0.0, 20.0), 35.0
    );
    physicsEngine.constraints.push(distanceConstraint);*/

    

    for (const body of physicsEngine.bodies) {
        if (body.lightness > 0.1) {
            //body.setAcceleration(new Vector2D(0.0, 1.0), deltaTime);
			//body.angularAcceleration = 0.1;
        }
    }
}

function createNewtonsCradle(radius, count, pendelumLength, topLeft) {
	const ground = Body2D.default();
	ground.lightness = 0.0;
	ground.angularLightness = 0.0;
	physicsEngine.bodies.push(ground);
	
	const floorLine = new DirectedLine(new Vector2D(0.0, -1.0), -500.0);
	const floorCollider = new DirectedLineCollider(ground, floorLine);
	collisionHandler.directedLineColliders.push(floorCollider);

	for (let i = 0; i < count; i++) {
		const circleBody = Body2D.default();
		circleBody.angularLightness = 0.08;
		const x = topLeft.x + i * 2.0 * radius;
		const y = topLeft.y;
		circleBody.setPosition(
			new Vector2D(x, y + pendelumLength + radius)
		);
		circleBody.setVelocity(new Vector2D(0.0, 0.0), deltaTime);
		circleBody.setAcceleration(new Vector2D(0.0, 1.0), deltaTime);
		physicsEngine.bodies.push(circleBody);

		const circle = new Circle(new Vector2D(0.0, 0.0), radius);
		const circleCollider = new CircleCollider(circleBody, circle);
		collisionHandler.circleColliders.push(circleCollider);

		const distanceConstraint = DistanceConstraint.create0(
			circleBody, new Vector2D(0.0, -radius), 
			ground, new Vector2D(x, y), pendelumLength
		);
		physicsEngine.constraints.push(distanceConstraint);
	}
	
	const firstIndex = physicsEngine.bodies.length - count;
	const lastIndex = physicsEngine.bodies.length - 1;
	const firstBody = physicsEngine.bodies[firstIndex];
	const lastBody = physicsEngine.bodies[lastIndex];

	firstBody.setVelocity(new Vector2D(-200.0, 0.0), deltaTime);
	//lastBody.setVelocity(new Vector2D(200.0, 0.0), deltaTime);
}

function createBallInBox() {
	const pointMass0 = PointMass.default();
	pointMass0.setPosition(new Vector2D(100.0, 100.0));
	pointMass0.setStepVelocity(new Vector2D(0.0, 0.0));
	physicsEngine.bodies.push(pointMass0);

	const pointMass1 = PointMass.default();
	pointMass1.setPosition(new Vector2D(100.0, 200.0));
	pointMass1.setStepVelocity(new Vector2D(0.1, 0.0));
	physicsEngine.bodies.push(pointMass1);

	{
		const distanceConstraint = DistanceConstraint.create1(
			pointMass0, pointMass1, 100.0);
		physicsEngine.constraints.push(distanceConstraint);
	}

	const circleBody = Body2D.default();
	circleBody.angularLightness = 0.1;
	circleBody.setPosition(new Vector2D(500.0, 400.0));
	circleBody.setVelocity(new Vector2D(200.0, -150.0), deltaTime);
	circleBody.setAcceleration(new Vector2D(0.0, 1.0), deltaTime);
	//circleBody.setAngularVelocity(-0.5, deltaTime);
	physicsEngine.bodies.push(circleBody);

	const circle = new Circle(new Vector2D(0.0, 0.0), 40.0);

	const circleCollider = new CircleCollider(circleBody, circle);
	collisionHandler.circleColliders.push(circleCollider);

	const directedLineBody = Body2D.default();
	directedLineBody.lightness = 0.5;//1.0;
	directedLineBody.angularLightness = 0.0004;//0.001;
	directedLineBody.setPosition(new Vector2D(500.0, 400.0));
	directedLineBody.setVelocity(new Vector2D(0.0, 0.0), deltaTime);
	directedLineBody.setAcceleration(new Vector2D(0.0, 1.0), deltaTime);
	directedLineBody.setAngularVelocity(0.0, deltaTime);

	//directedLineBody.velocity.y = -0;
	//directedLineBody.setAngularVelocity(0.0, deltaTime);
	physicsEngine.bodies.push(directedLineBody);

	const rightDirectedLine = new DirectedLine(new Vector2D(-1.0, 0.0), -100.0);
	const leftDirectedLine = new DirectedLine(new Vector2D(1.0, 0.0), -100.0);
	const topDirectedLine = new DirectedLine(new Vector2D(0.0, 1.0), -100.0);
	const bottomDirectedLine = new DirectedLine(new Vector2D(0.0, -1.0), -100.0);

	const rightDirectedLineCollider = new DirectedLineCollider(
		directedLineBody, rightDirectedLine);
	const leftDirectedLineCollider = new DirectedLineCollider(
		directedLineBody, leftDirectedLine
	);
	const topDirectedLineCollider = new DirectedLineCollider(
		directedLineBody, topDirectedLine);
	const bottomDirectedLineCollider = new DirectedLineCollider(
		directedLineBody, bottomDirectedLine
	);
	collisionHandler.directedLineColliders.push(rightDirectedLineCollider);	
	collisionHandler.directedLineColliders.push(leftDirectedLineCollider);
	collisionHandler.directedLineColliders.push(topDirectedLineCollider);	
	collisionHandler.directedLineColliders.push(bottomDirectedLineCollider);

	const ground = Body2D.default();
	ground.lightness = 0.0;
	ground.angularLightness = 0.0;
	physicsEngine.bodies.push(ground);

	const startPosition = new Vector2D(500.0, 50.0);
    const count = 13;
    const offset = new Vector2D(0.0, 20.0);
    const anchorOffset = new Vector2D(0.0, 20.0);
    const constraintDistance = offset.getLength();
    
    let topIndex = physicsEngine.bodies.length;
    for (let i = 0; i < count; i++) {
        /*const body = Body2D.default();
		body.lightness = 4.0;
        body.angularLightness = 0.02;
        body.setPosition(Vector2D.addScaled(startPosition, offset, i));
        body.setAcceleration(new Vector2D(0.0, 1.0), deltaTime);
		*/
		const pointMass = PointMass.default();
		pointMass.lightness = 10.0;
		pointMass.setPosition(Vector2D.addScaled(startPosition, offset, i));
		pointMass.setAcceleration(new Vector2D(0.0, 1.0), deltaTime);
		physicsEngine.bodies.push(pointMass);
    }

    const topPointMass = physicsEngine.bodies[topIndex];
	topPointMass.lightness = 0.0;
    topPointMass.setAcceleration(new Vector2D(0.0, 0.0), deltaTime);

    const bottomPointMass = physicsEngine.bodies[physicsEngine.bodies.length - 1];
	//bottomBody.setVelocity(new Vector2D(10.0, 0.0), deltaTime);

    for (let i = 0; i < count - 1; i++) {
        constraint = DistanceConstraint.create1(
            physicsEngine.bodies[topIndex + i], /*anchorOffset.copy(),*/ 
            physicsEngine.bodies[topIndex + i + 1], /*Vector2D.negate(anchorOffset),  */
            constraintDistance
        );
        physicsEngine.constraints.push(constraint);
    }

	const boxAttachemntPoint = new Vector2D(0.0, -100.0);
	//const ropeAttachementPoint = new Vector2D(0.0, 20.0);
	const distance = Vector2D.subtract(
		directedLineBody.displacementToGlobal(boxAttachemntPoint), 
		bottomPointMass.position//displacementToGlobal(ropeAttachementPoint)
	).getLength();
	const distanceConstraint = DistanceConstraint.create2(
		directedLineBody, boxAttachemntPoint, 
		bottomPointMass, /*ropeAttachementPoint,*/ 
		distance
	);
	physicsEngine.constraints.push(distanceConstraint);
}

function createRope(startPosition, offset, constraintDistance, count) {
    for (let i = 0; i < count; i++) {
        pointMass = PointMass.default();
        pointMass.setPosition(Vector2D.addScaled(startPosition, offset, i));
        pointMass.acceleration.set(new Vector2D(0.0, 100.0));
        physicsEngine.bodies.push(pointMass);
    }

    const topPointMass = physicsEngine.bodies[0];
    topPointMass.lightness = 0.0;
    topPointMass.acceleration.set(new Vector2D(0.0, 0.0));

    const bottomPointMass = physicsEngine.bodies[physicsEngine.bodies.length - 1];
    bottomPointMass.lightness = 1.0;

    for (let i = 0; i < count - 1; i++) {
        constraint = new PointMassDistanceConstraint(
            physicsEngine.bodies[i], physicsEngine.bodies[i + 1], 
            constraintDistance
        );
        physicsEngine.constraints.push(constraint);
    }
}

function createCloth(topLeft, distance, width, height) {
    pointMassGrid = [];
    for (let y = 0; y < height; y++) {
        pointMassRow = [];
        for (let x = 0; x < width; x++) {
            pointMass = PointMass.default();
            pointMass.setPosition(
                Vector2D.addScaled(topLeft, new Vector2D(x, y), distance)
            );
            pointMassRow.push(pointMass);
            physicsEngine.bodies.push(pointMass);
        }
        pointMassGrid.push(pointMassRow);
    }

    for (const pointMass of pointMassGrid[0]) {
        pointMass.lightness = 0.0;
    }

    for (let y = 1; y < height; y++) {
        for (let x = 0; x < width - 1; x++) {
            if (5 < y && y < 10 && 5 < x && x < 10) {
                continue;
            }
            constraint = new PointMassDistanceConstraint(
                pointMassGrid[y][x], pointMassGrid[y][x + 1], distance
            );
            physicsEngine.constraints.push(constraint);
        }
    }

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height - 1; y++) {
            if (5 < y && y < 10 && 5 < x && x < 10) {
                continue;
            }
            constraint = new PointMassDistanceConstraint(
                pointMassGrid[y][x], pointMassGrid[y + 1][x], distance
            );
            physicsEngine.constraints.push(constraint);
        }
    }
}

function onMouseMove(mouseEvent) {
    const mousePosition = new Vector2D(mouseEvent.pageX, mouseEvent.pageY);
    if (draggedBody != null) {
        draggedBody.acceleration.set(Vector2D.multiply(Vector2D.subtract(mousePosition, draggedBody.position), 1.0));
    }
    if (mouseEvent.buttons == 1) {
        for (let i = physicsEngine.constraints.length - 1; i >= 0; i--) {
            const constraint = physicsEngine.constraints[i];
            const position0 = constraint.pointMass0.position;
            const position1 = constraint.pointMass1.position;
            const centerPosition = Vector2D.addScaled(
                position0, Vector2D.subtract(position1, position0), 0.5
            );
            if (Vector2D.subtract(mousePosition, centerPosition).getLength() < 7.0) {
                physicsEngine.constraints.splice(i, 1);
            }
        }

    }
}

function tick(deltaTime) {
    physicsEngine.tick(deltaTime);
    draw();
}

function draw() {
    renderer.clearRect(0, 0, renderer.canvas.width, renderer.canvas.height);
    //renderer.fillStyle = "black";
    //renderer.fillRect(0, 0, renderer.canvas.width, renderer.canvas.height);
    //drawBodies();
	drawColliders();
    drawDistanceConstraints();
}

function drawBodies() {
    renderer.fillStyle = 'white';
    for (body of physicsEngine.bodies) {
        if (body instanceof PointMass) {
            const position = body.position;
            renderer.beginPath();
            renderer.arc(position.x, position.y, 2.0, 0.0, 2.0 * Math.PI);
            renderer.fill();
        } else if (body instanceof Body2D) {
            renderer.save();
            const position = body.position;
            const angle = body.angle;
            const radius = 20.0;
            renderer.translate(position.x, position.y);
            renderer.rotate(angle);
            renderer.scale(radius, radius);
            renderer.beginPath();
            renderer.moveTo(-1.0, 0.0);
            renderer.lineTo(1.0, 0.0);
            renderer.moveTo(0.0, -1.0);
            renderer.lineTo(0.0, 1.0);
            renderer.strokeStyle = 'white';
            renderer.lineWidth = 0.1;
            renderer.stroke();
            renderer.restore();
        }
    }
}

function drawColliders() {
	drawCircleColliders();
	drawDirectedLineColliders();
}

function drawCircleColliders() {
	renderer.strokeStyle = 'white';
	for (const circleCollider of collisionHandler.circleColliders) {
		renderer.save();
		const body = circleCollider.body;
		const position = body.position;
        const angle = body.angle;
		const circle = circleCollider.circle;
		renderer.translate(position.x, position.y);
		renderer.rotate(angle);
		renderer.beginPath();
        renderer.arc(circle.position.x, circle.position.y, circle.radius, 0.0, 2.0 * Math.PI);
        renderer.stroke();
		renderer.restore();
	}
}

function drawDirectedLineColliders() {
	renderer.strokeStyle = 'white';
	const length = 10000;
	for (const directedLineCollider of collisionHandler.directedLineColliders) {
		renderer.save();
		const body = directedLineCollider.body;
		const position = body.position;
        const angle = body.angle;
		const directedLine = directedLineCollider.directedLine;
		renderer.translate(position.x, position.y);
		renderer.rotate(angle);
		const center = Vector2D.multiply(
			directedLine.normal, directedLine.position);
		const tangent = Vector2D.perpendicularClockwise(directedLine.normal);
		const start = Vector2D.addScaled(center, tangent, -length);
		const end = Vector2D.addScaled(center, tangent, length);
		renderer.beginPath();
		renderer.moveTo(start.x, start.y);
        renderer.lineTo(end.x, end.y);
        renderer.stroke();
		renderer.restore();
	}
}

function drawDistanceConstraints() {
    renderer.strokeStyle = 'white';
    renderer.lineWidth = 1;
    for (constraint of physicsEngine.constraints) {
        if (constraint instanceof PointMassDistanceConstraint) {
            const position0 = constraint.pointMass0.position;
            const position1 = constraint.pointMass1.position;
            renderer.beginPath();
            renderer.moveTo(position0.x, position0.y);
            renderer.lineTo(position1.x, position1.y);
            renderer.stroke();
        } else if (constraint instanceof DistanceConstraint) {
            if (
				constraint.pointGenerator instanceof 
				AbstractPoint2DGeneratorPair
			) {	
				const position0 = getPosition(
					constraint.pointGenerator.generator0);
				const position1 = getPosition(
					constraint.pointGenerator.generator1);
				renderer.beginPath();
				renderer.moveTo(position0.x, position0.y);
				renderer.lineTo(position1.x, position1.y);
				renderer.stroke();
			}
        }
    }

function getPosition(pointGenerator) {
	if (pointGenerator instanceof Body2DLocalPoint) {
		return pointGenerator.body.localToGlobal(pointGenerator.localPoint);
	}
	if (pointGenerator instanceof PointMass) {
		return pointGenerator.position;
	}
	return null;
}

}
