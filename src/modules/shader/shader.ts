import type { Display } from "../display/display.js";

export class Shader {
	private module: GPUShaderModule | null;

	constructor() {
		this.module = null;
	}

	async loadShader (url: string, display: Display): Promise<void> {
		const getResponse = await fetch(url);
		const body: string = await getResponse.text();

		const descriptor: GPUShaderModuleDescriptor = {
			code: body
		};

		this.module = display.getDevice().createShaderModule(descriptor);
	}

	getModule (): GPUShaderModule {
		if (!this.module) {
			throw new Error("module not created");
		}

		return this.module;
	}
}
