import { Vector } from "../vector/Vector.js";

export class AxisAlignedBoundingBox {
	public min: Vector;
	public max: Vector;

	constructor(
		min: Vector = new Vector(-Infinity, -Infinity, -Infinity),
		max: Vector = new Vector(Infinity, Infinity, Infinity)
	) {
		if (!this.isValidBox(min, max)) {
			throw new Error("invalid AxisAlignedBoundingBox bounds. min must be less than max");
		}

		this.min = min;
		this.max = max;
	}

	public getCenter(): Vector {
		return new Vector(
			(this.min.x + this.max.x) / 2,
			(this.min.y + this.max.y) / 2,
			(this.min.z + this.max.z) / 2
		);
	}

	public getSize(): Vector {
		return new Vector(
			this.max.x - this.min.x,
			this.max.y - this.min.y,
			this.max.z - this.min.z
		);
	}

	public expandToPoint(point: Vector): void {
		if (this.min.x === -Infinity && this.min.y === -Infinity && this.min.z === -Infinity &&
			this.max.x === Infinity && this.max.y === Infinity && this.max.z === Infinity) {
			this.min = new Vector(point.x, point.y, point.z);
			this.max = new Vector(point.x, point.y, point.z);
		} else {
			this.min.x = Math.min(this.min.x, point.x);
			this.min.y = Math.min(this.min.y, point.y);
			this.min.z = Math.min(this.min.z, point.z);

			this.max.x = Math.max(this.max.x, point.x);
			this.max.y = Math.max(this.max.y, point.y);
			this.max.z = Math.max(this.max.z, point.z);
		}
	}

	public intersects(other: AxisAlignedBoundingBox): boolean {
		return (
			this.min.x <= other.max.x && this.max.x >= other.min.x &&
			this.min.y <= other.max.y && this.max.y >= other.min.y &&
			this.min.z <= other.max.z && this.max.z >= other.min.z
		);
	}

	public containsPoint(point: Vector): boolean {
		return (
			point.x >= this.min.x && point.x <= this.max.x &&
			point.y >= this.min.y && point.y <= this.max.y &&
			point.z >= this.min.z && point.z <= this.max.z
		);
	}

	public getVertex(index: number): Vector {
		const x = (index & 1) === 0 ? this.min.x : this.max.x;
		const y = (index & 2) === 0 ? this.min.y : this.max.y;
		const z = (index & 4) === 0 ? this.min.z : this.max.z;

		return new Vector(x, y, z);
	}

	private isValidBox(min: Vector, max: Vector): boolean {
		return min.x <= max.x && min.y <= max.y && min.z <= max.z;
	}
}
