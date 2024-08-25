import type { Display } from "../display/Display";

export class ColorAttachment {
	private clearFlag: boolean = true;
	private display: Display;
	private view: GPUTextureView;

	constructor (display: Display) {
		window.addEventListener("resize", () => {
			this.createView();
		});

		this.display = display;
		this.view = this.createView();
	}

	public clear(): void {
		this.clearFlag = true;
	}

	public createView(): GPUTextureView {
		return this.view = this.display.createView();
	}

	public getColorAttachment(): GPURenderPassColorAttachment {
		const colorAttachment: GPURenderPassColorAttachment = {
			clearValue: [0.1, 0.2, 0.3, 1],
			loadOp: this.clearFlag ? "clear" : "load",
			storeOp: "store",
			view: this.view
		};

		this.clearFlag = false;

		return colorAttachment;
	}
}
