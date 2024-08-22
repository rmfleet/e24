/* eslint-disable max-lines-per-function */
import {
	describe,
	expect,
	it
} from "vitest";
import { Vector } from "./Vector.js";
import { Matrix } from "../matrix/Matrix.js";


describe("Vector", () => {
	it("should be able to create a new Vector", () => {
		const vector = new Vector(1, 2, 3);
		expect(vector).toBeDefined();
		expect(vector.x).toBe(1);
		expect(vector.y).toBe(2);
		expect(vector.z).toBe(3);
		expect(vector.toString()).toBe("1,2,3");
	});

	it("should be able to set a Vector", () => {
		const vector = new Vector(1, 2, 3);
		const other = new Vector(4, 5, 6);
		vector.set(other);
		expect(vector.x).toBe(4);
		expect(vector.y).toBe(5);
		expect(vector.z).toBe(6);
	});

	it("should be able to check if a Vector is zero", () => {
		const vector = new Vector(0, 0, 0);
		expect(vector.isZero()).toBe(true);
	});

	it("should be able to calculate the square root of a Vector", () => {
		const vector = new Vector(1, 2, 3);
		expect(vector.length()).toBeCloseTo(3.7416573867739413);
	});

	it("should be able to calculate the reciprocal square root of a Vector", () => {
		const vector = new Vector(1, 2, 3);
		expect(vector.inverseLength()).toBeCloseTo(0.2672612419124244);
	});

	it("should be able to normalize a Vector", () => {
		const vector = new Vector(1, 2, 3);
		vector.normalize();
		expect(vector.x).toBeCloseTo(0.2672612419124244);
		expect(vector.y).toBeCloseTo(0.5345224838248488);
		expect(vector.z).toBeCloseTo(0.8017837257372732);
	});

	it("should be able to scale a Vector", () => {
		const vector = new Vector(1, 2, 3);
		vector.scale(2);
		expect(vector.x).toBe(2);
		expect(vector.y).toBe(4);
		expect(vector.z).toBe(6);
	});

	it("should be able to calculate the inverse scale of a Vector", () => {
		const vector = new Vector(1, 2, 3);
		vector.inverseScale(2);
		expect(vector.x).toBe(0.5);
		expect(vector.y).toBe(1);
		expect(vector.z).toBe(1.5);
	});

	it("should be able to calculate the dot product of two Vectors", () => {
		const vector = new Vector(1, 2, 3);
		const other = new Vector(4, 5, 6);
		expect(vector.dot(other)).toBe(32);
	});

	it("should be able to calculate the cross product of two Vectors", () => {
		const vector = new Vector(1, 0, 0);
		const other = new Vector(0, 1, 0);
		vector.cross(other);
		expect(vector.x).toBe(0);
		expect(vector.y).toBe(0);
		expect(vector.z).toBe(1);
	});

	it("should be able to transform a coordinate with a given matrix", () => {
		const vector = new Vector(1, 2, 3);
		const matrix = new Matrix();
		matrix.setIdentity();
		vector.transformCoord(matrix);
		expect(vector.x).toBe(1);
		expect(vector.y).toBe(2);
		expect(vector.z).toBe(3);
	});

	it("should be able to add two Vectors", () => {
		const vector = new Vector(1, 2, 3);
		const other = new Vector(4, 5, 6);
		const result = vector.add(other);
		expect(result.x).toBe(5);
		expect(result.y).toBe(7);
		expect(result.z).toBe(9);
	});

	it("should be able to check if two Vectors are equal", () => {
		const vector = new Vector(1, 2, 3);
		const other = new Vector(1, 2, 3);
		expect(vector.equals(other)).toBe(true);
	});

	it("should be able to clone a Vector", () => {
		const vector = new Vector(1, 2, 3);
		const clone = vector.clone();
		expect(clone.x).toBe(1);
		expect(clone.y).toBe(2);
		expect(clone.z).toBe(3);
	});

	it("should be able to subtract two Vectors", () => {
		const vector = new Vector(1, 2, 3);
		const other = new Vector(4, 5, 6);
		const result = vector.subtract(other);
		expect(result.x).toBe(-3);
		expect(result.y).toBe(-3);
		expect(result.z).toBe(-3);
	});

	it("should be able to floor a Vector", () => {
		const vector = new Vector(1.1, 2.2, 3.3);
		vector.floor();
		expect(vector.x).toBe(1);
		expect(vector.y).toBe(2);
		expect(vector.z).toBe(3);
	});

	it("should be able to get the distance between two Vectors", () => {
		const vector = new Vector(1, 2, 3);
		const other = new Vector(4, 6, 8);
		expect(vector.distance(other)).toBeCloseTo(7.071, 3);
	});

	it("should be able to get the absolute value of a Vector", () => {
		const vector = new Vector(-1, -2, -3);
		vector.abs();
		expect(vector.x).toBe(1);
		expect(vector.y).toBe(2);
		expect(vector.z).toBe(3);
	});

	it("should be able to check if all components of a Vector are less than or equal to another Vector", () => {
		const vector = new Vector(1, 2, 3);
		const other = new Vector(4, 5, 6);
		expect(vector.allLessThanOrEqual(other)).toBe(true);
	});

	it("should be able to check if any component of a Vector is greater than another Vector", () => {
		const vector = new Vector(1, 2, 3);
		const other = new Vector(4, 5, 6);
		expect(vector.anyGreaterThan(other)).toBe(false);
	});
});
