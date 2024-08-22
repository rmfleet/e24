import { Matrix } from "../matrix/Matrix.js";
import { Vector } from "../vector/Vector.js";

export class Camera {
	public position: Vector;
	public right: Vector;
	public up: Vector;
	public view: Vector;

	constructor () {
		this.position = new Vector(0, 0, 0);
		this.right = new Vector(1, 0, 0);
		this.up = new Vector(0, 1, 0);
		this.view = new Vector(0, 0, 1);
	}

	public identity(): void {
		this.position.set(new Vector(0, 0, 0));
		this.right.set(new Vector(1, 0, 0));
		this.up.set(new Vector(0, 1, 0));
		this.view.set(new Vector(0, 0, 1));
	}

	public pitchLimit(units: number): boolean {
		if ((this.view.y - units) <= -1) {
			this.up = new Vector(0, 1, 0);
			return true;
		} else if ((this.view.y - units >= 1)) {
			this.up = new Vector(0, -1, 0);
			return true;
		}

		return false;
	}

	public pitch(radianAngle: number): void {
		const matrix = new Matrix();
		matrix.setRotation(this.right, radianAngle);
		this.view.transformCoord(matrix);
		this.view.normalize();
	}

	public roll(radianAngle: number): void {
		const matrix = new Matrix();
		matrix.setRotation(this.view, radianAngle);
		this.right.transformCoord(matrix);
		this.up.transformCoord(matrix);
	}

	public setUpright(): void {
		this.right = new Vector(0, 1, 0).cross(this.view).normalize();
		this.up = this.view.clone().cross(this.right).normalize();
	}

	public strafe(units: number): void {
		this.position.x += units * this.right.x;
		this.position.y += units * this.right.y;
		this.position.z += units * this.right.z;
	}

	public getViewMatrix(): Matrix {
		this.view.normalize();
		this.right = this.up.clone().cross(this.view).normalize();
		this.up = this.view.clone().cross(this.right).normalize();

		const matrix = new Matrix();
		return matrix.setView(this.position, this.right, this.up, this.view);
	}

	public move(units: number): void {
		this.position.x += units * this.view.x;
		this.position.y += units * this.view.y;
		this.position.z += units * this.view.z;
	}

	public yaw(radianAngle: number): void {
		const matrix = new Matrix();
		matrix.setRotation(new Vector(0, 1, 0), radianAngle);
		this.view.transformCoord(matrix);
		this.view.normalize();
	}
}
