import {
	describe,
	expect,
	it
} from "vitest";
import { AxisAlignedBoundingBox } from "./AxisAlignedBoundingBox.js";
import { Vector } from "../vector/Vector.js";

describe("AxisAlignedBoundingBox", () => {
	it("should be able to create a new AxisAlignedBoundingBox", () => {
		const aabb = new AxisAlignedBoundingBox();
		expect(aabb).toBeDefined();
		expect(aabb.min).toBeDefined();
		expect(aabb.max).toBeDefined();
		expect(aabb.min.x).toBe(-Infinity);
		expect(aabb.min.y).toBe(-Infinity);
		expect(aabb.min.z).toBe(-Infinity);
		expect(aabb.max.x).toBe(Infinity);
		expect(aabb.max.y).toBe(Infinity);
		expect(aabb.max.z).toBe(Infinity);
	});

	it("should throw an error if min is greater than max", () => {
		expect(() => {
			new AxisAlignedBoundingBox(new Vector(1, 1, 1), new Vector(0, 0, 0));
		}).toThrow();
	});

	it("should be able to get the center of the box", () => {
		const aabb = new AxisAlignedBoundingBox(new Vector(-1, -1, -1), new Vector(1, 1, 1));
		const center = aabb.getCenter();
		expect(center.x).toBe(0);
		expect(center.y).toBe(0);
		expect(center.z).toBe(0);
	});

	it("should be able to get the size of the box", () => {
		const aabb = new AxisAlignedBoundingBox(new Vector(-1, -1, -1), new Vector(1, 1, 1));
		const size = aabb.getSize();
		expect(size.x).toBe(2);
		expect(size.y).toBe(2);
		expect(size.z).toBe(2);
	});

	it("should be able to expand the box to contain a point", () => {
		const aabb = new AxisAlignedBoundingBox(new Vector(-1, -1, -1), new Vector(1, 1, 1));
		aabb.expandToPoint(new Vector(2, 2, 2));
		expect(aabb.min.x).toBe(-1);
		expect(aabb.min.y).toBe(-1);
		expect(aabb.min.z).toBe(-1);
		expect(aabb.max.x).toBe(2);
		expect(aabb.max.y).toBe(2);
		expect(aabb.max.z).toBe(2);
	});

	it("should be able to expand the box to contain a point when the box is empty", () => {
		const aabb = new AxisAlignedBoundingBox();
		aabb.expandToPoint(new Vector(2, 2, 2));
		expect(aabb.min.x).toBe(2);
		expect(aabb.min.y).toBe(2);
		expect(aabb.min.z).toBe(2);
		expect(aabb.max.x).toBe(2);
		expect(aabb.max.y).toBe(2);
		expect(aabb.max.z).toBe(2);
	});

	it("should be able to check if the box intersects another box", () => {
		const aabb1 = new AxisAlignedBoundingBox(new Vector(-1, -1, -1), new Vector(1, 1, 1));
		const aabb2 = new AxisAlignedBoundingBox(new Vector(0, 0, 0), new Vector(2, 2, 2));
		const aabb3 = new AxisAlignedBoundingBox(new Vector(2, 2, 2), new Vector(3, 3, 3));
		expect(aabb1.intersects(aabb2)).toBe(true);
		expect(aabb1.intersects(aabb3)).toBe(false);
	});

	it("should be able to check if the box contains a point", () => {
		const aabb = new AxisAlignedBoundingBox(new Vector(-1, -1, -1), new Vector(1, 1, 1));
		expect(aabb.containsPoint(new Vector(0, 0, 0))).toBe(true);
		expect(aabb.containsPoint(new Vector(2, 2, 2))).toBe(false);
	});

	it("should be able to get a vertex of the box", () => {
		const aabb = new AxisAlignedBoundingBox(new Vector(-1, -1, -1), new Vector(1, 1, 1));
		expect(aabb.getVertex(0).equals(new Vector(-1, -1, -1))).toBe(true);
		expect(aabb.getVertex(1).equals(new Vector(1, -1, -1))).toBe(true);
		expect(aabb.getVertex(2).equals(new Vector(-1, 1, -1))).toBe(true);
		expect(aabb.getVertex(3).equals(new Vector(1, 1, -1))).toBe(true);
		expect(aabb.getVertex(4).equals(new Vector(-1, -1, 1))).toBe(true);
		expect(aabb.getVertex(5).equals(new Vector(1, -1, 1))).toBe(true);
		expect(aabb.getVertex(6).equals(new Vector(-1, 1, 1))).toBe(true);
		expect(aabb.getVertex(7).equals(new Vector(1, 1, 1))).toBe(true);
	});


});
