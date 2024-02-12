class AbstractPoint2DGeneratorPair {

	constructor(generator0, generator1) {
		this.generator0 = generator0;
		this.generator1 = generator1;
	}

	generateAbstractPoint2D() {
		return new AbstractPoint2DPair(
			this.generator0.generateAbstractPoint2D(), 
			this.generator1.generateAbstractPoint2D()
		);
	}

}
