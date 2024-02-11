class Vector2D {
    
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static zero() {
        return new Vector2D(0.0, 0.0);
    }

	static fromAngle(angle) {
		return new Vector2D(Math.cos(angle), Math.sin(angle));
	}

    static add(vector0, vector1) {
        return new Vector2D(
            vector0.x + vector1.x, 
            vector0.y + vector1.y
        );
    }

    static addScaled(vector0, vector1, scalar) {
        return new Vector2D(
            vector0.x + scalar * vector1.x, 
            vector0.y + scalar * vector1.y
        );
    }

    static subtract(vector0, vector1) {
        return new Vector2D(
            vector0.x - vector1.x, 
            vector0.y - vector1.y
        );
    }

	static subtractScaled(vector0, vector1, scalar) {
		return new Vector2D(
			vector0.x - scalar * vector1.x, 
			vector0.y - scalar * vector1.y
		);
	}

    static multiply(vector, scalar) {
        return new Vector2D(
            vector.x * scalar, 
            vector.y * scalar
        );
    }

    static negate(vector) {
        return new Vector2D(
            vector.x * -1.0, 
            vector.y * -1.0
        );
    }

    static divide(vector, scalar) {
        return new Vector2D(
            vector.x / scalar, 
            vector.y / scalar
        );
    }

    static rotate(vector, angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return new Vector2D(
            vector.x * cos - vector.y * sin, 
            vector.x * sin + vector.y * cos
        );
    }

	static perpendicularClockwise(vector) {
		return new Vector2D(
			-vector.y, 
			vector.x
		);
	}

	static dot(vector0, vector1) {
		return vector0.x * vector1.x + vector0.y * vector1.y;
	}

    static cross(vector0, vector1) {
        return vector0.x * vector1.y - vector1.x * vector0.y;
    }

	static zCross(z, vector) {
		return new Vector2D(
			-vector.y * z, 
			vector.x * z
		);
	}

    set(vector) {
        this.x = vector.x;
        this.y = vector.y;
    }

	add(vector) {
		this.x += vector.x;
		this.y += vector.y;
	}

    addScaled(vector, scalar) {
        this.x += vector.x * scalar;
        this.y += vector.y * scalar;
    }

    divide(scalar) {
        this.x /= scalar;
        this.y /= scalar;
    }

    getLength() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

}
