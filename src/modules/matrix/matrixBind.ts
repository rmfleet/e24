import type { Matrix } from "./matrix.js";

export class MatrixBindModel {
	private bindBuffer: GPUBuffer;
	private bindGroup: GPUBindGroup;
	private bindGroupLayout: GPUBindGroupLayout;

	constructor(device: GPUDevice) {
		this.bindBuffer = {} as GPUBuffer;

		this.bindGroupLayout = this.createBindGroupLayout(device);

		this.bindGroup = device.createBindGroup({
			layout: this.getBindGroupLayout(),
			entries: this.createBindGroupEntries(device)
		});
	}

	bind (device: GPUDevice, matrix: Matrix): void {
		device.queue.writeBuffer(this.bindBuffer, 0, matrix.elements, 0, 16);
	}

	private createBindGroupEntries (device: GPUDevice): GPUBindGroupEntry[] {
		const size: number = 16 * 4;
		this.bindBuffer = device.createBuffer({
			size: size,
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
		});

		const matrixEntry: GPUBindGroupEntry = {
			binding: 0,
			resource: {
				buffer: this.bindBuffer,
				offset: 0,
				size: size
			}
		};

		const entries: GPUBindGroupEntry[] = [
			matrixEntry
		];

		return entries;
	}

	getBindGroup (): GPUBindGroup {
		return this.bindGroup;
	}

	getBindGroupLayout (): GPUBindGroupLayout {
		return this.bindGroupLayout;
	}

	createBindGroupLayout (device: GPUDevice): GPUBindGroupLayout {
		const entries: GPUBindGroupLayoutEntry[] = [
			{
				binding: 0,
				visibility: GPUShaderStage.VERTEX,
				buffer: {
					type: "uniform"
				}
			}
		];

		const layoutDescriptor: GPUBindGroupLayoutDescriptor = {
			entries: entries
		};

		return device.createBindGroupLayout(layoutDescriptor);
	}
}
