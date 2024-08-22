import { Vector } from "../vector/Vector.js";
import { AxisAlignedBoundingBox } from "../aabb/AxisAlignedBoundingBox.js";

export class Ray {
	public origin: Vector;
	public direction: Vector;

	constructor(origin: Vector, direction: Vector) {
		this.origin = origin.clone();
		this.direction = direction.clone().normalize();
	}

	public at(t: number): Vector {
		return this.origin.clone().add(this.direction.clone().scale(t));
	}

	public intersectAABB(aabb: AxisAlignedBoundingBox): number | null {
		let tmin = (aabb.min.x - this.origin.x) / this.direction.x;
		let tmax = (aabb.max.x - this.origin.x) / this.direction.x;

		if (tmin > tmax) [tmin, tmax] = [tmax, tmin];

		let tymin = (aabb.min.y - this.origin.y) / this.direction.y;
		let tymax = (aabb.max.y - this.origin.y) / this.direction.y;

		if (tymin > tymax) [tymin, tymax] = [tymax, tymin];

		if ((tmin > tymax) || (tymin > tmax)) return null;

		if (tymin > tmin) tmin = tymin;
		if (tymax < tmax) tmax = tymax;

		let tzmin = (aabb.min.z - this.origin.z) / this.direction.z;
		let tzmax = (aabb.max.z - this.origin.z) / this.direction.z;

		if (tzmin > tzmax) [tzmin, tzmax] = [tzmax, tzmin];

		if ((tmin > tzmax) || (tzmin > tmax)) return null;

		if (tzmin > tmin) tmin = tzmin;
		if (tzmax < tmax) tmax = tzmax;

		return tmin > 0 ? tmin : tmax;
	}
}
