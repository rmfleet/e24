import {
	afterAll,
	beforeAll,
	describe,
	expect,
	it,
	vitest,
	type MockInstance
} from "vitest";
import { main } from "./main.js";
import { Server } from "./modules/server/Server.js";
import dotenv from "dotenv";

describe("main", () => {
	let listenSpy: MockInstance<() => Promise<void>>;

	beforeAll(() => {
		listenSpy = vitest.spyOn(Server.prototype, "listen").mockResolvedValue(undefined);
	});

	afterAll(() => {
		listenSpy.mockRestore();
	});

	it("should be able to run the main function", () => {
		vitest.spyOn(dotenv, "config");
		expect(main()).resolves.toBeUndefined();
		expect(dotenv.config).toHaveBeenCalledOnce();
		expect(listenSpy).toHaveBeenCalledOnce();
	});

	it("should return a default port when not is not provided", () => {
		vitest.spyOn(dotenv, "config").mockImplementationOnce(() => {
			delete(process.env.PORT);
			return {};
		});
		expect(main()).resolves.toBeUndefined();
		expect(process.env.PORT).toBeUndefined();
		expect(dotenv.config).toHaveBeenCalledOnce();
	});

	it("should return a default port when not is not a number", () => {
		vitest.spyOn(dotenv, "config").mockImplementationOnce(() => {
			process.env.PORT = "not a number";
			return {};
		});
		expect(main()).resolves.toBeUndefined();
		expect(process.env.PORT).toBe("not a number");
		expect(dotenv.config).toHaveBeenCalledOnce();
	});
});
