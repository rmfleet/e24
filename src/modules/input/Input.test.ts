import {
	describe,
	expect,
	it
} from "vitest";
import { Input } from "./Input.js";

describe("Input", () => {
	it("should be able to create a new Input", () => {
		const input = new Input(() => {}, () => {});
		expect(input).toBeDefined();
	});

	it("should be able to check a keydown event listener", () => {
		const input = new Input(() => {}, () => {});
		expect(input.isKeyDown("a")).toBe(false);
	});

	it("should be able to check a mousedown event listener", () => {
		const input = new Input(() => {}, () => {});
		expect(input.isMouseDown("left")).toBe(false);
	});

	it("should be able to request a pointer lock", () => {
		const input = new Input(() => {}, () => {});
		input.requestPointerLock();
		expect(input.isPointerLocked()).toBe(false);
	});
});
