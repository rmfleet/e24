import {
	describe,
	expect,
	it
} from "vitest";
import { Frustum } from "./Frustum.js";
import { Matrix } from "../matrix/Matrix.js";
import { Plane } from "../plane/Plane.js";
import { AxisAlignedBoundingBox } from "../aabb/AxisAlignedBoundingBox.js";
import { Vector } from "../vector/Vector.js";

describe("Frustum", () => {
	it("should create a new Frustum with valid matrices", () => {
		const viewMatrix = new Matrix();
		const projectionMatrix = new Matrix();

		viewMatrix.setIdentity();
		projectionMatrix.setPerspective(45, 1.0, 0.1, 100);
		const pvMatrix = new Matrix().set(viewMatrix).concatenate(projectionMatrix);

		const frustum = new Frustum(pvMatrix);

		expect(frustum).toBeDefined();

		expect(frustum.left).toBeInstanceOf(Plane);
		expect(frustum.right).toBeInstanceOf(Plane);
		expect(frustum.top).toBeInstanceOf(Plane);
		expect(frustum.bottom).toBeInstanceOf(Plane);
		expect(frustum.near).toBeInstanceOf(Plane);
		expect(frustum.far).toBeInstanceOf(Plane);
	});

	it("should check if an axis-aligned bounding box is inside the frustum", () => {
		const viewMatrix = new Matrix();
		const projectionMatrix = new Matrix();

		viewMatrix.setIdentity();
		projectionMatrix.setPerspective(45, 1.0, 0.1, 100);
		const pvMatrix = new Matrix().set(viewMatrix).concatenate(projectionMatrix);

		const frustum = new Frustum(pvMatrix);

		const aabb = new AxisAlignedBoundingBox();
		aabb.min.set(new Vector(-1, -1, -1));
		aabb.max.set(new Vector(1, 1, 1));

		expect(frustum.isAxisAlignedBoxInside(aabb)).toBe(true);
	});

	it("should check if an axis-aligned bounding box is outside the frustum", () => {
		const viewMatrix = new Matrix();
		const projectionMatrix = new Matrix();

		viewMatrix.setIdentity();
		projectionMatrix.setPerspective(45, 1.0, 0.1, 100);
		const pvMatrix = new Matrix().set(viewMatrix).concatenate(projectionMatrix);

		const frustum = new Frustum(pvMatrix);

		const aabb = new AxisAlignedBoundingBox();
		aabb.min.set(new Vector(-10, -10, -200));
		aabb.max.set(new Vector(-5, -5, -150));

		expect(frustum.isAxisAlignedBoxInside(aabb)).toBe(false);
	});
});
