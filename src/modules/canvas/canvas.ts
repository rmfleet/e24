export class Canvas {
	private htmlCanvasElement: HTMLCanvasElement;

	constructor() {
		this.htmlCanvasElement = document.createElement("canvas");
		this.setDimensions(window.innerWidth, window.innerHeight);

		window.addEventListener("resize", () => {
			this.setDimensions(window.innerWidth, window.innerHeight);
		});

		document.body.appendChild(this.htmlCanvasElement);
	}

	getAspectRatio (): number {
		return this.htmlCanvasElement.width / this.htmlCanvasElement.height;
	}

	getHTMLCanvasElement (): HTMLCanvasElement {
		return this.htmlCanvasElement;
	}

	getDimensions (): { width: number, height: number } {
		return {
			width: this.htmlCanvasElement.width,
			height: this.htmlCanvasElement.height
		};
	}

	setDimensions (width: number, height: number): void {
		this.htmlCanvasElement.width = width;
		this.htmlCanvasElement.height = height;
	}
}
