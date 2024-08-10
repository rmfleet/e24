import type { Display } from "../display/display.js";
import type { Vector } from "../vector/vector.js";

export class InstanceManager {
	private display: Display;
	private instancePositions: Vector[];
	private instancePositionBuffer: GPUBuffer;
	private stagingBuffer: GPUBuffer;
	private bufferCapacity: number;
	private onInstanceCountChange: (instanceCount: number) => void;

	constructor(
		display: Display,
		initialCapacity: number,
		onInstanceCountChange?: (instanceCount: number) => void
	) {
		this.display = display;
		this.instancePositions = [];
		this.bufferCapacity = initialCapacity;
		this.instancePositionBuffer = {} as GPUBuffer;
		this.stagingBuffer = {} as GPUBuffer;
		this.onInstanceCountChange = onInstanceCountChange || ((): void => {});

		this.createBuffers(initialCapacity);
	}

	public addInstance(instancePosition: Vector): void {
		this.instancePositions.push(instancePosition);
	}

	public removeInstance(instancePosition: Vector): void {
		const index = this.instancePositions.findIndex(pos =>
			pos.x === instancePosition.x && pos.y === instancePosition.y && pos.z === instancePosition.z
		);
		if (index !== -1) {
			this.instancePositions.splice(index, 1);
		}
	}

	public async commitUpdates(): Promise<void> {
		const requiredCapacity = this.instancePositions.length * 3 * Float32Array.BYTES_PER_ELEMENT;

		if (requiredCapacity > this.bufferCapacity) {
			this.createBuffers(this.instancePositions.length);
		}

		await this.stagingBuffer.mapAsync(GPUMapMode.WRITE);
		const mappedRange = new Float32Array(this.stagingBuffer.getMappedRange());
		for (let i = 0; i < this.instancePositions.length; i++) {
			mappedRange[i * 3 + 0] = this.instancePositions[i].x;
			mappedRange[i * 3 + 1] = this.instancePositions[i].y;
			mappedRange[i * 3 + 2] = this.instancePositions[i].z;
		}
		this.stagingBuffer.unmap();

		const commandEncoder = this.display.getDevice().createCommandEncoder();
		commandEncoder.copyBufferToBuffer(this.stagingBuffer, 0, this.instancePositionBuffer, 0, requiredCapacity);
		this.display.getDevice().queue.submit([commandEncoder.finish()]);

		this.onInstanceCountChange(this.instancePositions.length);
	}

	public getInstanceBuffer(): GPUBuffer {
		return this.instancePositionBuffer;
	}

	private createBuffers(capacity: number): void {
		const bufferSize = capacity * 3 * Float32Array.BYTES_PER_ELEMENT;

		this.instancePositionBuffer = this.display.getDevice().createBuffer({
			size: bufferSize,
			usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
		});

		this.stagingBuffer = this.display.getDevice().createBuffer({
			size: bufferSize,
			usage: GPUBufferUsage.MAP_WRITE | GPUBufferUsage.COPY_SRC
		});

		this.bufferCapacity = capacity;
	}
}
