import {
	describe,
	expect,
	it,
	vi
} from "vitest";
import { Mesh } from "./Mesh.js";

describe("Mesh", () => {
	it("should be able to create a new Mesh", () => {
		const mesh = new Mesh(new Mesh());
		expect(mesh).toBeDefined();
	});

	it("should be able to load a Mesh from a url", async () => {
		global.fetch = vi.fn(() =>
			Promise.resolve({
				text: () => Promise.resolve(JSON.stringify({
					"version": 1,
					"vertices": [
						0.0, 0.5, 0.0,
						-0.5, -0.5, 0.0,
						0.5, -0.5, 0.0
					],
					"colors": [
						1.0, 0.0, 0.0, 1.0,
						0.0, 1.0, 0.0, 1.0,
						0.0, 0.0, 1.0, 1.0
					],
					"texcoords": [
						0.5, 1.0,
						0.0, 0.0,
						1.0, 0.0
					],
					"indices": [
						0, 1, 2
					]
				}))
			})
		) as unknown as typeof fetch;
		const mesh = new Mesh(new Mesh());
		await expect(mesh.loadFromUrl("./")).resolves.toBeUndefined();
		expect(mesh.version).toBe(1);
		expect(mesh.vertices).toEqual(new Float32Array([
			0.0, 0.5, 0.0,
			-0.5, -0.5, 0.0,
			0.5, -0.5, 0.0
		]));
		expect(mesh.colors).toEqual(new Float32Array([
			1.0, 0, 0, 1.0, 0, 1.0, 0, 1.0, 0, 0, 1.0, 1.0
		]));
		expect(mesh.texcoords).toEqual(new Float32Array([
			0.5, 1.0, 0.0, 0.0, 1.0, 0.0
		]));
		expect(mesh.indices).toEqual(new Uint16Array([
			0, 1, 2
		]));
	});
});
