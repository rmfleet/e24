import type { Display } from "../display/Display.js";

export class LoopModel {
	private appCallback: () => Promise<void>;
	private displayCallback: () => Promise<void>;
	private shouldDisplay: boolean = false;
	private shouldRun: boolean = false;
	private isPaused: boolean = false;
	private animationHandle: number = 0;

	constructor(display: Display, appCallback: () => Promise<void>, displayCallback: () => Promise<void>) {
		this.appCallback = appCallback;
		this.displayCallback = displayCallback;

		display.onVisibilityChange((visible: boolean) => {
			if (visible) {
				this.resume();
			} else {
				this.shouldDisplay = false;
			}
		});

		this.resume();
	}

	public pause (): void {
		this.shouldDisplay = false;
		this.shouldRun = false;
		this.isPaused = true;
	}

	public resume (): void {
		this.isPaused = false;
		this.resumeDisplay();
		this.resumeApp();
	}

	private resumeApp (): void {
		if (this.shouldRun !== true) {
			this.shouldRun = true;
			this.appLoop();
		}
	}

	private resumeDisplay (): void {
		if (this.isPaused) {
			return;
		}

		if (this.shouldDisplay !== true) {
			this.shouldDisplay = true;
			this.displayLoop();
		}
	}

	private appLoop (): void {
		if (this.isPaused) {
			return;
		}

		if (!this.shouldRun) {
			return;
		}

		const startTime: number = performance.now();

		this.appCallback().then(() => {
			const interval: number = 1000 / 30;
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
			cancelAnimationFrame(this.animationHandle);
			return;
		}

		this.displayCallback().then(() => {
			cancelAnimationFrame(this.animationHandle);
			this.animationHandle = requestAnimationFrame(() => {
				this.displayLoop();
			});
		});
	}
}
