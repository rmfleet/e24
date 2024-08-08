import type { Display } from "../display/display.js";
import type { Vector } from "../vector/vector.js";

export class InstanceManager {
	private display: Display;
	private instancePositions: Vector[];
	private instancePositionBuffer: GPUBuffer;
	private stagingBuffer: GPUBuffer;
	private instanceCount: number;
	private bufferCapacity: number;

	constructor(display: Display, initialCapacity: number = 1000) {
		this.display = display;
		this.instancePositions = [];
		this.bufferCapacity = initialCapacity;
		this.instanceCount = 0;
		this.instancePositionBuffer = {} as GPUBuffer;
		this.stagingBuffer = {} as GPUBuffer;

		this.createBuffers(initialCapacity);
	}

	private createBuffers(capacity: number): void {
		const bufferSize = capacity * 3 * Float32Array.BYTES_PER_ELEMENT;

		// Create the GPU buffer for instance positions
		this.instancePositionBuffer = this.display.getDevice().createBuffer({
			size: bufferSize,
			usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
		});

		// Create the staging buffer for efficient data transfer
		this.stagingBuffer = this.display.getDevice().createBuffer({
			size: bufferSize,
			usage: GPUBufferUsage.MAP_WRITE | GPUBufferUsage.COPY_SRC
		});
	}

	async commitUpdates(): Promise<void> {
		await this.stagingBuffer.mapAsync(GPUMapMode.WRITE);
		const mappedRange = new Float32Array(this.stagingBuffer.getMappedRange());
		for (let i = 0; i < this.instancePositions.length; i++) {
			mappedRange[i * 3 + 0] = this.instancePositions[i].x;
			mappedRange[i * 3 + 1] = this.instancePositions[i].y;
			mappedRange[i * 3 + 2] = this.instancePositions[i].z;
		}
		this.stagingBuffer.unmap();

		const commandEncoder = this.display.getDevice().createCommandEncoder();
		commandEncoder.copyBufferToBuffer(
			this.stagingBuffer, 0, this.instancePositionBuffer, 0, this.stagingBuffer.size
		);
		this.display.getDevice().queue.submit([commandEncoder.finish()]);

		this.instanceCount = this.instancePositions.length;
	}

	addInstance(instancePosition: Vector): void {
		if (this.instanceCount >= this.bufferCapacity) {
			this.resizeBuffers(this.bufferCapacity * 2);
		}
		this.instancePositions.push(instancePosition);
	}

	removeInstance(instancePosition: Vector): void {
		const index = this.instancePositions.findIndex(pos =>
			pos.x === instancePosition.x && pos.y === instancePosition.y && pos.z === instancePosition.z
		);
		if (index !== -1) {
			this.instancePositions.splice(index, 1);
		}
	}

	private resizeBuffers(newCapacity: number): void {
		this.bufferCapacity = newCapacity;
		this.createBuffers(newCapacity);
	}

	getInstanceBuffer(): GPUBuffer {
		return this.instancePositionBuffer;
	}

	getInstanceCount(): number {
		return this.instanceCount;
	}
}
