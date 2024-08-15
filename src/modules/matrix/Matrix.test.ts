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
});
