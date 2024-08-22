import { Matrix } from "../matrix/Matrix.js";

export class Vector {
	x: number;
	y: number;
	z: number;

	constructor(x: number = 0, y: number = 0, z: number = 0) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	public abs (): Vector {
		this.x = Math.abs(this.x);
		this.y = Math.abs(this.y);
		this.z = Math.abs(this.z);
		return this;
	}

	public add (v: Vector): Vector {
		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
		return this;
	}

	public allLessThanOrEqual(v: Vector): boolean {
		return this.x <= v.x && this.y <= v.y && this.z <= v.z;
	}

	public anyGreaterThan(v: Vector): boolean {
		return this.x > v.x || this.y > v.y || this.z > v.z;
	}

	public clone(): Vector {
		return new Vector(this.x, this.y, this.z);
	}

	public cross(v: Vector): Vector {
		const x = this.y * v.z - this.z * v.y;
		const y = this.z * v.x - this.x * v.z;
		const z = this.x * v.y - this.y * v.x;

		this.x = x;
		this.y = y;
		this.z = z;

		return this;
	}

	public distance (v: Vector): number {
		return this.clone().subtract(v).length();
	}

	public dot (v: Vector): number {
		return this.x * v.x + this.y * v.y + this.z * v.z;
	}

	public equals (v: Vector): boolean {
		return this.x == v.x && this.y == v.y && this.z == v.z;
	}

	public floor (): Vector {
		this.x = Math.floor(this.x);
		this.y = Math.floor(this.y);
		this.z = Math.floor(this.z);
		return this;
	}

	public isZero (): boolean {
		return this.x === 0 && this.y === 0 && this.z === 0;
	}

	public normalize(): Vector {
		return this.scale(this.inverseLength());
	}

	public inverseLength (): number {
		return 1.0 / this.length();
	}

	public inverseScale (s: number): Vector {
		this.x /= s;
		this.y /= s;
		this.z /= s;
		return this;
	}

	public scale (s: number): Vector {
		this.x *= s;
		this.y *= s;
		this.z *= s;
		return this;
	}

	public subtract(v: Vector): Vector {
		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;
		return this;
	}

	public length (): number {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}

	public set (v: Vector): Vector {
		this.x = v.x;
		this.y = v.y;
		this.z = v.z;
		return this;
	}

	public toString(): string {
		return `${this.x},${this.y},${this.z}`;
	}

	public transformCoord (matrix: Matrix): Vector {
		return matrix.transformCoord(this);
	}
}
