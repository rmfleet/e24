export class Lighting {
	private lightBindGroup: GPUBindGroup;
	private lightBindGroupLayout: GPUBindGroupLayout;

	constructor(device: GPUDevice) {
		// Define the light direction, color, and ambient light
		const lightDirection = new Float32Array([0.5, -0.75, 1.0]);
		const lightColor = new Float32Array([1.0, 1.0, 1.0]);
		const ambientLight = new Float32Array([0.25, 0.25, 0.25]);

		// Create the buffers
		const lightDirectionBuffer = this.createBuffer(device, lightDirection);
		const lightColorBuffer = this.createBuffer(device, lightColor);
		const ambientLightBuffer = this.createBuffer(device, ambientLight);

		// Create the bind group layout and bind group
		this.lightBindGroupLayout = this.createBindGroupLayout(device);
		this.lightBindGroup = this.createBindGroup(device, lightDirectionBuffer, lightColorBuffer, ambientLightBuffer);
	}

	private createBuffer(device: GPUDevice, data: Float32Array): GPUBuffer {
		const buffer = device.createBuffer({
			size: data.byteLength,
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
		});
		device.queue.writeBuffer(buffer, 0, data);
		return buffer;
	}

	private createBindGroup(
		device: GPUDevice,
		lightDirectionBuffer: GPUBuffer,
		lightColorBuffer: GPUBuffer,
		ambientLightBuffer: GPUBuffer
	): GPUBindGroup {
		return device.createBindGroup({
			layout: this.lightBindGroupLayout,
			entries: [
				{ binding: 0, resource: { buffer: lightDirectionBuffer } },
				{ binding: 1, resource: { buffer: lightColorBuffer } },
				{ binding: 2, resource: { buffer: ambientLightBuffer } }
			]
		});
	}

	private createBindGroupLayout(device: GPUDevice): GPUBindGroupLayout {
		return device.createBindGroupLayout({
			entries: [
				{ binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: { type: "uniform" } },
				{ binding: 1, visibility: GPUShaderStage.FRAGMENT, buffer: { type: "uniform" } },
				{ binding: 2, visibility: GPUShaderStage.FRAGMENT, buffer: { type: "uniform" } }
			]
		});
	}

	getBindGroup(): GPUBindGroup {
		return this.lightBindGroup;
	}

	getBindGroupLayout(): GPUBindGroupLayout {
		return this.lightBindGroupLayout;
	}
}
