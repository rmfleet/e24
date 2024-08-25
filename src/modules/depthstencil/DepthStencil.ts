import type { Canvas } from "../canvas/Canvas.js";

export class DepthStencil {
	private depthTexture: GPUTexture;
	private view: GPUTextureView;
	public clearFlag: boolean = true;

	constructor(device: GPUDevice, canvas: Canvas) {
		window.addEventListener("resize", () => {
			this.depthTexture = this.createDepthTexture(device, canvas);
			this.createView();
		});

		this.depthTexture = this.createDepthTexture(device, canvas);
		this.view = this.createView();
	}

	public clear(): void {
		this.clearFlag = true;
	}

	public createView(): GPUTextureView {
		return this.view = this.depthTexture.createView();
	}

	public destroy(): void {
		this.depthTexture.destroy();
	}

	getDepthStencilAttachment(): GPURenderPassDepthStencilAttachment {
		const depthStencilAttachment: GPURenderPassDepthStencilAttachment = {
			view: this.view,
			depthClearValue: 1.0,
			depthLoadOp: this.clearFlag ? "clear" : "load",
			depthStoreOp: "store"
		};

		this.clearFlag = false;

		return depthStencilAttachment;
	}

	private createDepthTexture(device: GPUDevice, canvas: Canvas): GPUTexture {
		const size: GPUExtent3DStrict = {
			width: canvas.getDimensions().width,
			height: canvas.getDimensions().height
		};

		const format: GPUTextureFormat = "depth24plus";

		const depthTexture: GPUTexture = device.createTexture({
			size: size,
			format: format,
			usage: GPUTextureUsage.RENDER_ATTACHMENT
		});

		return depthTexture;
	}
}
