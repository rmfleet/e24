import { AxisAlignedBoundingBox } from "../aabb/AxisAlignedBoundingBox.js";
import { Ray } from "../ray/Ray.js";
import { Vector } from "../vector/Vector.js";

export class Voxel {
	constructor(public position: Vector) {
	}

	public intersectsRay(ray: Ray): number | null {
		const min = new Vector(this.position.x - 0.5, this.position.y - 0.5, this.position.z - 0.5);
		const max = new Vector(this.position.x + 0.5, this.position.y + 0.5, this.position.z + 0.5);
		const aabb = new AxisAlignedBoundingBox(min, max);
		return ray.intersectAABB(aabb);
	}
}
