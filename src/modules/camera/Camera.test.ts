import {
	describe,
	expect,
	it
} from "vitest";
import { Vector } from "../vector/Vector.js";
import { Camera } from "./Camera.js";

describe("Camera", () => {
	it("should be able to create a new Camera", () => {
		const camera = new Camera();
		expect(camera).toBeDefined();
	});

	it("should be able to set the Camera to the identity matrix", () => {
		const camera = new Camera();
		camera.identity();
		expect(camera.position).toEqual(new Vector(0, 0, 0));
		expect(camera.right).toEqual(new Vector(1, 0, 0));
		expect(camera.up).toEqual(new Vector(0, 1, 0));
		expect(camera.view).toEqual(new Vector(0, 0, 1));
	});

	it("should be able to limit the pitch of the Camera", () => {
		const camera = new Camera();
		camera.pitchLimit(1);
		expect(camera.up).toEqual(new Vector(0, 1, 0));
	});

	it("should be able to pitch the Camera", () => {
		const camera = new Camera();
		camera.pitch(1);
		expect(camera.view.x).toBeCloseTo(0);
		expect(camera.view.y).toBeCloseTo(-0.8414709899339101);
		expect(camera.view.z).toBeCloseTo(0.5403022978848462);
	});

	it("should be able to roll the Camera", () => {
		const camera = new Camera();
		camera.roll(1);
		expect(camera.right.x).toBeCloseTo(0.5403022766113281);
		expect(camera.right.y).toBeCloseTo(0.8414709568023682);
		expect(camera.right.z).toBeCloseTo(0);
		expect(camera.up.x).toBeCloseTo(-0.8414709568023682);
		expect(camera.up.y).toBeCloseTo(0.5403022766113281);
		expect(camera.up.z).toBeCloseTo(0);
	});

	it("should be able to set the Camera upright", () => {
		const camera = new Camera();
		camera.setUpright();
		expect(camera.up).toEqual(new Vector(0, 1, 0));
		expect(camera.right).toEqual(new Vector(1, 0, 0));
		expect(camera.view).toEqual(new Vector(0, 0, 1));
	});

	it("should be able to strafe the Camera", () => {
		const camera = new Camera();
		camera.strafe(1);
		expect(camera.position).toEqual(new Vector(1, 0, 0));
	});

	it("should be able to move the Camera forward", () => {
		const camera = new Camera();
		camera.move(1);
		expect(camera.position).toEqual(new Vector(0, 0, 1));
	});

	it("should be able to get the Camera view matrix", () => {
		const camera = new Camera();
		const matrix = camera.getViewMatrix();
		expect(matrix.elements[0]).toBeCloseTo(1);
		expect(matrix.elements[1]).toBeCloseTo(0);
		expect(matrix.elements[2]).toBeCloseTo(0);
		expect(matrix.elements[3]).toBeCloseTo(0);
		expect(matrix.elements[4]).toBeCloseTo(0);
		expect(matrix.elements[5]).toBeCloseTo(1);
		expect(matrix.elements[6]).toBeCloseTo(0);
		expect(matrix.elements[7]).toBeCloseTo(0);
		expect(matrix.elements[8]).toBeCloseTo(0);
		expect(matrix.elements[9]).toBeCloseTo(0);
		expect(matrix.elements[10]).toBeCloseTo(1);
		expect(matrix.elements[11]).toBeCloseTo(0);
		expect(matrix.elements[12]).toBeCloseTo(0);
		expect(matrix.elements[13]).toBeCloseTo(0);
		expect(matrix.elements[14]).toBeCloseTo(0);
		expect(matrix.elements[15]).toBeCloseTo(1);
	});

	it("should be able to yaw the Camera", () => {
		const camera = new Camera();
		camera.yaw(1);
		expect(camera.view.x).toBeCloseTo(0.8414709848078965);
		expect(camera.view.y).toBeCloseTo(0);
		expect(camera.view.z).toBeCloseTo(0.5403023058681398);
	});

	it("should return false and not modify 'up' when view.y minus units is within -1 and 1", () => {
		const camera = new Camera();
		camera.view = new Vector(0, 0.5, 0);
		const originalUp = camera.up;
		const result = camera.pitchLimit(0.3);
		expect(result).toBe(false);
		expect(camera.up).toBe(originalUp);
	});

	it("should set 'up' to (0, -1, 0) and return true when view.y minus units is greater than or equal to 1", () => {
		const camera = new Camera();
		camera.view = new Vector(0, 1.1, 0);
		const result = camera.pitchLimit(-0.2);
		expect(result).toBe(true);
		expect(camera.up.x).toBe(0);
		expect(camera.up.y).toBe(-1);
		expect(camera.up.z).toBe(0);
	});
});
