import type { Display } from "../display/Display.js";
import type { Vector } from "../vector/Vector.js";

export class InstanceManager {
	private display: Display;
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
		this.bufferCapacity = initialCapacity;
		this.instancePositionBuffer = {} as GPUBuffer;
		this.stagingBuffer = {} as GPUBuffer;
		this.onInstanceCountChange = onInstanceCountChange || ((): void => {});

		this.createBuffers(initialCapacity);
	}

	public async setInstances(positions: Vector[]): Promise<void> {
		const requiredCapacity = positions.length * 3 * Float32Array.BYTES_PER_ELEMENT;

		if (requiredCapacity > this.bufferCapacity) {
			this.createBuffers(positions.length);
		}

		await this.stagingBuffer.mapAsync(GPUMapMode.WRITE);
		const mappedRange = new Float32Array(this.stagingBuffer.getMappedRange());
		for (let i = 0; i < positions.length; i++) {
			mappedRange[i * 3 + 0] = positions[i].x;
			mappedRange[i * 3 + 1] = positions[i].y;
			mappedRange[i * 3 + 2] = positions[i].z;
		}
		this.stagingBuffer.unmap();

		const commandEncoder = this.display.getDevice().createCommandEncoder();
		commandEncoder.copyBufferToBuffer(this.stagingBuffer, 0, this.instancePositionBuffer, 0, requiredCapacity);
		this.display.getDevice().queue.submit([commandEncoder.finish()]);

		this.onInstanceCountChange(positions.length);
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
