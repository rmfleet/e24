import type { Canvas } from "../canvas/Canvas";

export class Display {
	private canvas: Canvas;
	private context: GPUCanvasContext | null;
	private device: GPUDevice | null;

	constructor(canvas: Canvas) {
		this.canvas = canvas;
		this.context = null;
		this.device = null;
	}

	createCommandEncoder (): GPUCommandEncoder {
		if (!this.device) {
			throw new Error("no device available during DisplayModel.createCommandEncoder()");
		}

		const descriptor: GPUCommandEncoderDescriptor = {};
		return this.device.createCommandEncoder(descriptor);
	}

	createView (): GPUTextureView {
		if (!this.context) {
			throw new Error("no context available during DisplayModel.createView()");
		}

		const descriptor: GPUTextureViewDescriptor = {};
		return this.context.getCurrentTexture().createView(descriptor);
	}

	async initialize (): Promise<void> {
		this.device = await this.initializeDevice();

		this.device.lost.then(() => {
			console.error("device lost");
		});

		this.context = this.canvas.getHTMLCanvasElement().getContext("webgpu");
		if (!this.context) {
			throw new Error("no context available during DisplayModel.initialize()");
		}

		const gpuCanvasConfiguration: GPUCanvasConfiguration = {
			device: this.device,
			format: this.getPixelFormat(),
			alphaMode: "premultiplied"
		};

		this.context.configure(gpuCanvasConfiguration);
	}

	private async initializeAdapter (): Promise<GPUAdapter> {
		const gpu: GPU = navigator.gpu;
		if (!gpu) {
			throw new Error("no gpu support is available during DisplayModel.initialize()");
		}

		const adaptorOptions: GPURequestAdapterOptions = {
			powerPreference: "high-performance"
		};

		const adapter = await gpu.requestAdapter(adaptorOptions);
		if (!adapter) {
			throw new Error("no adaptor available during DisplayModel.initializeAdaptor()");
		}

		return adapter;
	}

	private async initializeDevice (): Promise<GPUDevice> {
		const adapter = await this.initializeAdapter();

		const deviceDescriptor: GPUDeviceDescriptor = {};

		const device = await adapter.requestDevice(deviceDescriptor);
		if (!device) {
			throw new Error("no device available during DisplayModel.initializeDevice()");
		}

		return device;
	}

	getContext (): GPUCanvasContext {
		if (!this.context) {
			throw new Error("no context available during DisplayModel.getContext()");
		}

		return this.context;
	}

	getDevice (): GPUDevice {
		if (!this.device) {
			throw new Error("no device available during DisplayModel.getDevice()");
		}

		return this.device;
	}

	getPixelFormat (): GPUTextureFormat {
		return navigator.gpu.getPreferredCanvasFormat();
	}

	submitCommandEncoder (encoder: GPUCommandEncoder): void {
		if (!this.device) {
			throw new Error("no device available during DisplayModel.submitCommandEncoder()");
		}

		const commandBuffer = encoder.finish();
		this.device.queue.submit([commandBuffer]);
	}

	onVisibilityChange (callback: (visible: boolean) => void): void {
		document.addEventListener("visibilitychange", () => {
			callback(document.visibilityState === "visible");
		});
	}
}
