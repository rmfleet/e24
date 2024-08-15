import type { Display } from "../display/Display.js";

export class IndirectBufferManager {
	private display: Display;
	private indirectBuffer: GPUBuffer;
	private numIndices: number;

	constructor(display: Display, numIndices: number) {
		this.display = display;
		this.numIndices = numIndices;
		this.indirectBuffer = this.createIndirectBuffer();
	}

	public updateIndirectBuffer(instanceCount: number): void {
		const indirectData = new Uint32Array([
			this.numIndices,
			instanceCount,
			0,
			0,
			0
		]);

		this.display.getDevice().queue.writeBuffer(this.indirectBuffer, 0, indirectData.buffer);
	}

	public getIndirectBuffer(): GPUBuffer {
		return this.indirectBuffer;
	}

	private createIndirectBuffer(): GPUBuffer {
		// 5 elements: indexCount, instanceCount, firstIndex, baseVertex, firstInstance
		const bufferSize = 5 * Uint32Array.BYTES_PER_ELEMENT;
		return this.display.getDevice().createBuffer({
			size: bufferSize,
			usage: GPUBufferUsage.INDIRECT | GPUBufferUsage.COPY_DST
		});
	}
}
