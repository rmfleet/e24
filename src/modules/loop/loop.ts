import type { Display } from "../display/display.js";

export class LoopModel {
	private appCallback: () => Promise<void>;
	private displayCallback: () => Promise<void>;
	private shouldDisplay: boolean = false;

	constructor(display: Display, appCallback: () => Promise<void>, displayCallback: () => Promise<void>) {
		this.appCallback = appCallback;
		this.displayCallback = displayCallback;

		display.onVisibilityChange((visible: boolean) => {
			if (visible) {
				this.shouldDisplay = true;
				this.displayLoop();
			} else {
				this.shouldDisplay = false;
			}
		});

		this.shouldDisplay = true;
		this.appLoop();
		this.displayLoop();
	}

	private appLoop (): void {
		const startTime: number = performance.now();

		this.appCallback().then(() => {
			const interval: number = 1000 / 60;
			const endTime: number = performance.now();
			const elapsedTime: number = endTime - startTime;
			const sleepTime: number = Math.max(0, interval - elapsedTime);

			setTimeout(() => {
				this.appLoop();
			}, sleepTime);
		});
	}

	private displayLoop (): void {
		if (!this.shouldDisplay) {
			return;
		}

		requestAnimationFrame(() => {
			this.displayCallback().then(() => {
				this.displayLoop();
			});
		});
	}
}
