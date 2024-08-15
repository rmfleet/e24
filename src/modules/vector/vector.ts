import type { Matrix } from "../matrix/Matrix";

export class Vector {
	x: number;
	y: number;
	z: number;

	constructor(x: number = 0, y: number = 0, z: number = 0) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	public cross(v: Vector, w: Vector): Vector {
		const x = v.y * w.z - v.z * w.y;
		const y = v.z * w.x - v.x * w.z;
		const z = v.x * w.y - v.y * w.x;

		this.x = x;
		this.y = y;
		this.z = z;

		return this;
	}

	public dot (v: Vector): number {
		return this.x * v.x + this.y * v.y + this.z * v.z;
	}

	public isZero (): boolean {
		return this.x === 0 && this.y === 0 && this.z === 0;
	}

	public normalize(): Vector {
		return this.scale(this.rsqrt());
	}

	public rsqrt (): number {
		return 1.0 / this.sqrt();
	}

	public scale (s: number): Vector {
		this.x *= s;
		this.y *= s;
		this.z *= s;
		return this;
	}

	public sqrt (): number {
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
