import type { AxisAlignedBoundingBox } from "../aabb/AxisAlignedBoundingBox.js";
import { Matrix } from "../matrix/Matrix.js";
import { Plane } from "../plane/Plane.js";

export class Frustum {
	public top: Plane;
	public bottom: Plane;
	public left: Plane;
	public right: Plane;
	public near: Plane;
	public far: Plane;

	constructor(pvMatrix: Matrix) {
		this.left = this.createLeftPlane(pvMatrix);
		this.right = this.createRightPlane(pvMatrix);
		this.top = this.createTopPlane(pvMatrix);
		this.bottom = this.createBottomPlane(pvMatrix);
		this.near = this.createNearPlane(pvMatrix);
		this.far = this.createFarPlane(pvMatrix);
		this.normalize();
	}

	public isAxisAlignedBoxInside(aabb: AxisAlignedBoundingBox): boolean {
		const planes = [this.left, this.right, this.top, this.bottom, this.near, this.far];
		for (const plane of planes) {
			if (plane.isAxisAlignedBoundingBoxInside(aabb) === false) {
				return false;
			}
		}
		return true;
	}

	private createLeftPlane(matrix: Matrix): Plane {
		const plane = new Plane();
		plane.a = matrix.elements[3] + matrix.elements[0];
		plane.b = matrix.elements[7] + matrix.elements[4];
		plane.c = matrix.elements[11] + matrix.elements[8];
		plane.d = matrix.elements[15] + matrix.elements[12];
		return plane;
	}

	private createRightPlane(matrix: Matrix): Plane {
		const plane = new Plane();
		plane.a = matrix.elements[3] - matrix.elements[0];
		plane.b = matrix.elements[7] - matrix.elements[4];
		plane.c = matrix.elements[11] - matrix.elements[8];
		plane.d = matrix.elements[15] - matrix.elements[12];
		return plane;
	}

	private createTopPlane(matrix: Matrix): Plane {
		const plane = new Plane();
		plane.a = matrix.elements[3] - matrix.elements[1];
		plane.b = matrix.elements[7] - matrix.elements[5];
		plane.c = matrix.elements[11] - matrix.elements[9];
		plane.d = matrix.elements[15] - matrix.elements[13];
		return plane;
	}

	private createBottomPlane(matrix: Matrix): Plane {
		const plane = new Plane();
		plane.a = matrix.elements[3] + matrix.elements[1];
		plane.b = matrix.elements[7] + matrix.elements[5];
		plane.c = matrix.elements[11] + matrix.elements[9];
		plane.d = matrix.elements[15] + matrix.elements[13];
		return plane;
	}

	private createNearPlane(matrix: Matrix): Plane {
		const plane = new Plane();
		plane.a = matrix.elements[3] + matrix.elements[2];
		plane.b = matrix.elements[7] + matrix.elements[6];
		plane.c = matrix.elements[11] + matrix.elements[10];
		plane.d = matrix.elements[15] + matrix.elements[14];
		return plane;
	}

	private createFarPlane(matrix: Matrix): Plane {
		const plane = new Plane();
		plane.a = matrix.elements[3] - matrix.elements[2];
		plane.b = matrix.elements[7] - matrix.elements[6];
		plane.c = matrix.elements[11] - matrix.elements[10];
		plane.d = matrix.elements[15] - matrix.elements[14];
		return plane;
	}

	private normalize (): void {
		this.left.normalize();
		this.right.normalize();
		this.top.normalize();
		this.bottom.normalize();
		this.near.normalize();
		this.far.normalize();
	}
}
