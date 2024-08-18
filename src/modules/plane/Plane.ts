import type { AxisAlignedBoundingBox } from "../aabb/AxisAlignedBoundingBox";
import type { Vector } from "../vector/Vector";

export class Plane {
	public a: number;
	public b: number;
	public c: number;
	public d: number;

	constructor() {
		this.a = 0;
		this.b = 0;
		this.c = 0;
		this.d = 0;
	}

	public normalize(): void {
		const r = this.rsqrt();
		this.a *= r;
		this.b *= r;
		this.c *= r;
		this.d *= r;
	}

	public isAxisAlignedBoundingBoxInside(aabb: AxisAlignedBoundingBox): boolean {
		let allOutside = true;
		for (let i = 0; i < 8; i++) {
			const vertex = aabb.getVertex(i);
			const s = this.vectorInside(vertex);
			if (s) {
				allOutside = false;
				break;
			}
		}
		return !allOutside;
	}

	public vectorInside(v: Vector): boolean {
		const s = this.a * v.x + this.b * v.y + this.c * v.z + this.d;
		return s > -0.5;
	}

	public rsqrt (): number {
		return 1.0 / this.sqrt();
	}

	public sqrt (): number {
		return Math.sqrt(this.a * this.a + this.b * this.b + this.c * this.c);
	}
}
