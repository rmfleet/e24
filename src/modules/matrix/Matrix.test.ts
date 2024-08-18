/* eslint-disable max-lines-per-function */
import {
	describe,
	expect,
	it
} from "vitest";
import { Matrix } from "./Matrix.js";
import { Vector } from "../vector/Vector.js";

describe("Matrix", () => {
	it("should be able to create a new Matrix", () => {
		const matrix = new Matrix();
		expect(matrix).toBeDefined();
	});

	it("should be able to set a Matrix", () => {
		const matrix = new Matrix();
		const other = new Matrix();
		other.set(matrix);
		expect(matrix).toEqual(other);
	});

	it("should be able to check if a Matrix is the identity matrix", () => {
		const matrix = new Matrix();
		matrix.setIdentity();
		expect(matrix.elements[0]).toEqual(1);
		expect(matrix.elements[1]).toEqual(0);
		expect(matrix.elements[2]).toEqual(0);
		expect(matrix.elements[3]).toEqual(0);
		expect(matrix.elements[4]).toEqual(0);
		expect(matrix.elements[5]).toEqual(1);
		expect(matrix.elements[6]).toEqual(0);
		expect(matrix.elements[7]).toEqual(0);
		expect(matrix.elements[8]).toEqual(0);
		expect(matrix.elements[9]).toEqual(0);
		expect(matrix.elements[10]).toEqual(1);
		expect(matrix.elements[11]).toEqual(0);
		expect(matrix.elements[12]).toEqual(0);
		expect(matrix.elements[13]).toEqual(0);
		expect(matrix.elements[14]).toEqual(0);
		expect(matrix.elements[15]).toEqual(1);
	});

	it("should be able to concatenate two matrices", () => {
		const matrix = new Matrix();
		matrix.setIdentity();
		const other = new Matrix();
		other.setIdentity();
		matrix.concatenate(other);
		expect(matrix.elements[0]).toEqual(1);
		expect(matrix.elements[1]).toEqual(0);
		expect(matrix.elements[2]).toEqual(0);
		expect(matrix.elements[3]).toEqual(0);
		expect(matrix.elements[4]).toEqual(0);
		expect(matrix.elements[5]).toEqual(1);
		expect(matrix.elements[6]).toEqual(0);
		expect(matrix.elements[7]).toEqual(0);
		expect(matrix.elements[8]).toEqual(0);
		expect(matrix.elements[9]).toEqual(0);
		expect(matrix.elements[10]).toEqual(1);
		expect(matrix.elements[11]).toEqual(0);
		expect(matrix.elements[12]).toEqual(0);
		expect(matrix.elements[13]).toEqual(0);
		expect(matrix.elements[14]).toEqual(0);
		expect(matrix.elements[15]).toEqual(1);
	});

	it("should be able to transform a Vector", () => {
		const matrix = new Matrix();
		matrix.setIdentity();
		const vector = new Vector(1, 2, 3);
		const result = matrix.transformCoord(vector);
		expect(result.x).toEqual(1);
		expect(result.y).toEqual(2);
		expect(result.z).toEqual(3);
	});

	it("should be able to transform a Vector with a translation matrix", () => {
		const matrix = new Matrix();
		matrix.setIdentity();
		matrix.translate(new Vector(1, 2, 3));
		const vector = new Vector(1, 2, 3);
		const result = matrix.transformCoord(vector);
		expect(result.x).toEqual(2);
		expect(result.y).toEqual(4);
		expect(result.z).toEqual(6);
	});

	it("should be able to translate a matrix", () => {
		const matrix = new Matrix();
		matrix.setIdentity();
		matrix.translate(new Vector(1, 2, 3));
		expect(matrix.elements[0]).toEqual(1);
		expect(matrix.elements[1]).toEqual(0);
		expect(matrix.elements[2]).toEqual(0);
		expect(matrix.elements[3]).toEqual(0);
		expect(matrix.elements[4]).toEqual(0);
		expect(matrix.elements[5]).toEqual(1);
		expect(matrix.elements[6]).toEqual(0);
		expect(matrix.elements[7]).toEqual(0);
		expect(matrix.elements[8]).toEqual(0);
		expect(matrix.elements[9]).toEqual(0);
		expect(matrix.elements[10]).toEqual(1);
		expect(matrix.elements[11]).toEqual(0);
		expect(matrix.elements[12]).toEqual(1);
		expect(matrix.elements[13]).toEqual(2);
		expect(matrix.elements[14]).toEqual(3);
		expect(matrix.elements[15]).toEqual(1);
	});

	it("should be able to set a translation matrix", () => {
		const matrix = new Matrix();
		matrix.setTranslation(new Vector(1, 2, 3));
		expect(matrix.elements[0]).toEqual(1);
		expect(matrix.elements[1]).toEqual(0);
		expect(matrix.elements[2]).toEqual(0);
		expect(matrix.elements[3]).toEqual(0);
		expect(matrix.elements[4]).toEqual(0);
		expect(matrix.elements[5]).toEqual(1);
		expect(matrix.elements[6]).toEqual(0);
		expect(matrix.elements[7]).toEqual(0);
		expect(matrix.elements[8]).toEqual(0);
		expect(matrix.elements[9]).toEqual(0);
		expect(matrix.elements[10]).toEqual(1);
		expect(matrix.elements[11]).toEqual(0);
		expect(matrix.elements[12]).toEqual(1);
		expect(matrix.elements[13]).toEqual(2);
		expect(matrix.elements[14]).toEqual(3);
		expect(matrix.elements[15]).toEqual(1);
	});

	it("should get the byte length of a Matrix", () => {
		const matrix = new Matrix();
		expect(matrix.getByteLength()).toEqual(64);
	});

	it("should be able to setView on a Matrix", () => {
		const matrix = new Matrix();
		const position = new Vector(1, 2, 3);
		const right = new Vector(4, 5, 6);
		const up = new Vector(7, 8, 9);
		const view = new Vector(10, 11, 12);

		matrix.setView(position, right, up, view);

		expect(matrix.elements[0]).toEqual(4);
		expect(matrix.elements[1]).toEqual(7);
		expect(matrix.elements[2]).toEqual(10);
		expect(matrix.elements[3]).toEqual(0.0);

		expect(matrix.elements[4]).toEqual(5);
		expect(matrix.elements[5]).toEqual(8);
		expect(matrix.elements[6]).toEqual(11);
		expect(matrix.elements[7]).toEqual(0.0);

		expect(matrix.elements[8]).toEqual(6);
		expect(matrix.elements[9]).toEqual(9);
		expect(matrix.elements[10]).toEqual(12);
		expect(matrix.elements[11]).toEqual(0.0);

		expect(matrix.elements[12]).toEqual(-position.dot(right));
		expect(matrix.elements[13]).toEqual(-position.dot(up));
		expect(matrix.elements[14]).toEqual(-position.dot(view));
		expect(matrix.elements[15]).toEqual(1.0);
	});

	it("should be able to set a perspective Matrix", () => {
		const expectedF = 1 / Math.tan(1 / 2);
		const aspectRatio = 2;
		const near = 3;
		const far = 4;

		const matrix = new Matrix();
		matrix.setPerspective(1, aspectRatio, near, far);

		expect(matrix.elements[0]).toBeCloseTo(expectedF / aspectRatio);
		expect(matrix.elements[5]).toBeCloseTo(expectedF);
		expect(matrix.elements[10]).toBeCloseTo(-(far + near) / (far - near));
		expect(matrix.elements[11]).toBe(-1);
		expect(matrix.elements[14]).toBeCloseTo(-(2 * far * near) / (far - near));
		expect(matrix.elements[15]).toBe(0);

		expect(matrix.elements[1]).toBe(0);
		expect(matrix.elements[2]).toBe(0);
		expect(matrix.elements[3]).toBe(0);

		expect(matrix.elements[4]).toBe(0);
		expect(matrix.elements[6]).toBe(0);
		expect(matrix.elements[7]).toBe(0);

		expect(matrix.elements[8]).toBe(0);
		expect(matrix.elements[9]).toBe(0);

		expect(matrix.elements[12]).toBe(0);
		expect(matrix.elements[13]).toBe(0);
	});

	it("should return an identity matrix when the rotation matrix is set to 0", () => {
		const matrix = new Matrix();
		matrix.setRotation(new Vector(0, 0, 0), 0);
		expect(matrix.elements[0]).toBe(1);
		expect(matrix.elements[1]).toBe(0);
		expect(matrix.elements[2]).toBe(0);
		expect(matrix.elements[3]).toBe(0);
		expect(matrix.elements[4]).toBe(0);
		expect(matrix.elements[5]).toBe(1);
		expect(matrix.elements[6]).toBe(0);
		expect(matrix.elements[7]).toBe(0);
		expect(matrix.elements[8]).toBe(0);
		expect(matrix.elements[9]).toBe(0);
		expect(matrix.elements[10]).toBe(1);
		expect(matrix.elements[11]).toBe(0);
		expect(matrix.elements[12]).toBe(0);
		expect(matrix.elements[13]).toBe(0);
		expect(matrix.elements[14]).toBe(0);
		expect(matrix.elements[15]).toBe(1);
	});

	it("should be able to set a rotation matrix", () => {
		const matrix = new Matrix();
		matrix.setRotation(new Vector(1, 0, 0), Math.PI / 2);

		expect(matrix.elements[0]).toBeCloseTo(1);
		expect(matrix.elements[1]).toBeCloseTo(0);
		expect(matrix.elements[2]).toBeCloseTo(0);
		expect(matrix.elements[3]).toBeCloseTo(0);
		expect(matrix.elements[4]).toBeCloseTo(0);
		expect(matrix.elements[5]).toBeCloseTo(6.123234262925839e-17);
		expect(matrix.elements[6]).toBeCloseTo(1);
		expect(matrix.elements[7]).toBeCloseTo(0);
		expect(matrix.elements[8]).toBeCloseTo(0);
		expect(matrix.elements[9]).toBeCloseTo(-1);
		expect(matrix.elements[10]).toBeCloseTo(6.123234262925839e-17);
		expect(matrix.elements[11]).toBeCloseTo(0);
		expect(matrix.elements[12]).toBeCloseTo(0);
		expect(matrix.elements[13]).toBeCloseTo(0);
		expect(matrix.elements[14]).toBeCloseTo(0);
		expect(matrix.elements[15]).toBeCloseTo(1);
	});
});
