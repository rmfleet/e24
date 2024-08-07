import type { Canvas } from "../canvas/canvas.js";

export class DepthStencil {
	private depthTexture: GPUTexture;
	private depthLoadOp: GPULoadOp;

	constructor(device: GPUDevice, canvas: Canvas, depthLoadOp: GPULoadOp) {
		window.addEventListener("resize", () => {
			this.depthTexture = this.createDepthTexture(device, canvas);
			this.setDepthLoadOp(depthLoadOp);
		});

		this.depthTexture = this.createDepthTexture(device, canvas);
		this.depthLoadOp = depthLoadOp;
	}

	getDepthStencilAttachment(): GPURenderPassDepthStencilAttachment {
		const depthStencilAttachment: GPURenderPassDepthStencilAttachment = {
			view: this.depthTexture.createView(),
			depthClearValue: 1.0,
			depthLoadOp: this.depthLoadOp,
			depthStoreOp: "store"
		};

		return depthStencilAttachment;
	}

	setDepthLoadOp(depthLoadOp: GPULoadOp): void {
		this.depthLoadOp = depthLoadOp;
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
