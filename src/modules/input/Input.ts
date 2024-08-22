export class Input {
	private keys: Record<string, boolean> = {};
	private mouse: Record<string, boolean> = {};
	private pointerLocked: boolean = false;

	constructor(
		public mouseMoveCallback: (x: number, y: number) => void,
		public keyPressCallback: (key: string) => void
	) {
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleKeyUp = this.handleKeyUp.bind(this);
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleMouseUp = this.handleMouseUp.bind(this);
		this.handlePointerLockChange = this.handlePointerLockChange.bind(this);
		this.handleMouseMove = this.handleMouseMove.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);

		document.addEventListener("keypress", this.handleKeyPress);
		document.addEventListener("keydown", this.handleKeyDown);
		document.addEventListener("keyup", this.handleKeyUp);
		document.addEventListener("mousedown", this.handleMouseDown);
		document.addEventListener("mouseup", this.handleMouseUp);
		document.addEventListener("pointerlockchange", this.handlePointerLockChange);
		document.addEventListener("mousemove", this.handleMouseMove, false);
		document.addEventListener("fullscreenchange", this.handleFullscreenChange);
	}

	public isKeyDown (key: string): boolean {
		return this.keys[key] || false;
	}

	public isMouseDown (button: string): boolean {
		return this.mouse[button] || false;
	}

	public isPointerLocked (): boolean {
		return this.pointerLocked;
	}

	public toggleFullscreen(): void {
		if (document.fullscreenElement) {
			document.exitFullscreen();
		} else if (document.documentElement.requestFullscreen) {
			document.documentElement.requestFullscreen();
		}
	}

	public requestPointerLock(): void {
		if (document.pointerLockElement !== document.documentElement) {
			if (document.documentElement.requestPointerLock) {
				document.documentElement.requestPointerLock();
			}
		}
	}

	public releasePointerLock(): void {
		if (document.pointerLockElement === document.documentElement) {
			document.exitPointerLock();
		}
	}

	private handleMouseDown (event: MouseEvent): void {
		if (event.button === 0) {
			this.mouse["left"] = true;
		}
	}

	private handleMouseUp (event: MouseEvent): void {
		if (event.button === 0) {
			this.mouse["left"] = false;
		}
	}

	private handleMouseMove (event: MouseEvent): void {
		if (this.pointerLocked) {
			this.mouseMoveCallback(event.movementX, event.movementY);
		}
	}

	private handlePointerLockChange (): void {
		this.pointerLocked = (document.pointerLockElement === document.documentElement);
	}

	private handleKeyDown (event: KeyboardEvent): void {
		this.keys[event.key] = true;
	}

	private handleKeyPress (event: KeyboardEvent): void {
		this.keyPressCallback(event.key);
	}

	private handleKeyUp (event: KeyboardEvent): void {
		this.keys[event.key] = false;
	}

	private handleFullscreenChange (): void {
		console.log("Fullscreen mode changed");
		if (document.fullscreenElement) {
			console.log("Entered fullscreen mode");
		} else {
			console.log("Exited fullscreen mode");
		}
	}
}
