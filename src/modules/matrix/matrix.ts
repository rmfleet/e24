import { Vector } from "../vector/vector";

const AA = 0;
const AB = 1;
const AC = 2;
const AD = 3;
const BA = 4;
const BB = 5;
const BC = 6;
const BD = 7;
const CA = 8;
const CB = 9;
const CC = 10;
const CD = 11;
const DA = 12;
const DB = 13;
const DC = 14;
const DD = 15;


export class Matrix {
	constructor(public elements: Float32Array = new Float32Array(16)) {
		this.elements = elements;
	}

	getByteLength (): number {
		return this.elements.byteLength;
	}

	concatenate (matrix: Matrix): Matrix {
		const a00 = this.elements[AA];
		const a01 = this.elements[AB];
		const a02 = this.elements[AC];
		const a03 = this.elements[AD];
		const a10 = this.elements[BA];
		const a11 = this.elements[BB];
		const a12 = this.elements[BC];
		const a13 = this.elements[BD];
		const a20 = this.elements[CA];
		const a21 = this.elements[CB];
		const a22 = this.elements[CC];
		const a23 = this.elements[CD];
		const a30 = this.elements[DA];
		const a31 = this.elements[DB];
		const a32 = this.elements[DC];
		const a33 = this.elements[DD];

		const b00 = matrix.elements[AA];
		const b01 = matrix.elements[AB];
		const b02 = matrix.elements[AC];
		const b03 = matrix.elements[AD];
		const b10 = matrix.elements[BA];
		const b11 = matrix.elements[BB];
		const b12 = matrix.elements[BC];
		const b13 = matrix.elements[BD];
		const b20 = matrix.elements[CA];
		const b21 = matrix.elements[CB];
		const b22 = matrix.elements[CC];
		const b23 = matrix.elements[CD];
		const b30 = matrix.elements[DA];
		const b31 = matrix.elements[DB];
		const b32 = matrix.elements[DC];
		const b33 = matrix.elements[DD];

		this.elements[AA] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
		this.elements[AB] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
		this.elements[AC] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
		this.elements[AD] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
		this.elements[BA] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
		this.elements[BB] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
		this.elements[BC] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
		this.elements[BD] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
		this.elements[CA] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
		this.elements[CB] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
		this.elements[CC] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
		this.elements[CD] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
		this.elements[DA] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
		this.elements[DB] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
		this.elements[DC] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
		this.elements[DD] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;

		return this;
	}

	public set (matrix: Matrix): void {
		this.elements.set(matrix.elements);
	}

	public setView (position: Vector, right: Vector, up: Vector, view: Vector): Matrix {
		this.elements[AA] = right.x;
		this.elements[AB] = up.x;
		this.elements[AC] = view.x;
		this.elements[AD] = 0.0;
		this.elements[BA] = right.y;
		this.elements[BB] = up.y;
		this.elements[BC] = view.y;
		this.elements[BD] = 0.0;
		this.elements[CA] = right.z;
		this.elements[CB] = up.z;
		this.elements[CC] = view.z;
		this.elements[CD] = 0.0;
		this.elements[DA] = position.dot(right);
		this.elements[DB] = position.dot(up);
		this.elements[DC] = position.dot(view);
		this.elements[DD] = 1.0;
		return this;
	}

	setIdentity (): void {
		this.elements[AA] = 1;
		this.elements[AB] = 0;
		this.elements[AC] = 0;
		this.elements[AD] = 0;
		this.elements[BA] = 0;
		this.elements[BB] = 1;
		this.elements[BC] = 0;
		this.elements[BD] = 0;
		this.elements[CA] = 0;
		this.elements[CB] = 0;
		this.elements[CC] = 1;
		this.elements[CD] = 0;
		this.elements[DA] = 0;
		this.elements[DB] = 0;
		this.elements[DC] = 0;
		this.elements[DD] = 1;
	}

	setPerspective (fov: number, aspect: number, near: number, far: number): void {
		const f = 1.0 / Math.tan(fov / 2);
		const nf = 1 / (near - far);

		this.elements[AA] = f / aspect;
		this.elements[AB] = 0;
		this.elements[AC] = 0;
		this.elements[AD] = 0;
		this.elements[BA] = 0;
		this.elements[BB] = f;
		this.elements[BC] = 0;
		this.elements[BD] = 0;
		this.elements[CA] = 0;
		this.elements[CB] = 0;
		this.elements[CC] = (far + near) * nf;
		this.elements[CD] = -1;
		this.elements[DA] = 0;
		this.elements[DB] = 0;
		this.elements[DC] = 2 * far * near * nf;
		this.elements[DD] = 0;
	}

	public setRotation (v: Vector, angle: number): Matrix {
		if (v.isZero()) {
			this.setIdentity();
			return this;
		}

		const c = Math.cos(angle);
		const s = Math.sin(angle);
		const nv: Vector = new Vector().set(v).normalize();

		this.elements[AA] = (nv.x * nv.x) * (1.0 - c) + c;
		this.elements[AB] = (nv.y * nv.x) * (1.0 - c) + (nv.z * s);
		this.elements[AC] = (nv.z * nv.x) * (1.0 - c) - (nv.y * s);
		this.elements[AD] = 0.0;
		this.elements[BA] = (nv.x * nv.y) * (1.0 - c) - (nv.z * s);
		this.elements[BB] = (nv.y * nv.y) * (1.0 - c) + c;
		this.elements[BC] = (nv.z * nv.y) * (1.0 - c) + (nv.x * s);
		this.elements[BD] = 0.0;
		this.elements[CA] = (nv.x * nv.z) * (1.0 - c) + (nv.y * s);
		this.elements[CB] = (nv.y * nv.z) * (1.0 - c) - (nv.x * s);
		this.elements[CC] = (nv.z * nv.z) * (1.0 - c) + c;
		this.elements[CD] = 0.0;
		this.elements[DA] = 0.0;
		this.elements[DB] = 0.0;
		this.elements[DC] = 0.0;
		this.elements[DD] = 1.0;
		return this;
	}

	setTranslation (v: Vector): void {
		this.elements[AA] = 1;
		this.elements[AB] = 0;
		this.elements[AC] = 0;
		this.elements[AD] = 0;
		this.elements[BA] = 0;
		this.elements[BB] = 1;
		this.elements[BC] = 0;
		this.elements[BD] = 0;
		this.elements[CA] = 0;
		this.elements[CB] = 0;
		this.elements[CC] = 1;
		this.elements[CD] = 0;
		this.elements[DA] = v.x;
		this.elements[DB] = v.y;
		this.elements[DC] = v.z;
		this.elements[DD] = 1;
	}

	public transformCoord (vector: Vector): Vector {
		const x = vector.x;
		const y = vector.y;
		const z = vector.z;

		vector.x = x * this.elements[AA] + y * this.elements[BA] + z * this.elements[CA] + this.elements[DA];
		vector.y = x * this.elements[AB] + y * this.elements[BB] + z * this.elements[CB] + this.elements[DB];
		vector.z = x * this.elements[AC] + y * this.elements[BC] + z * this.elements[CC] + this.elements[DC];

		return vector;
	}

	public translate (v: Vector): void {
		this.elements[DA] += v.x;
		this.elements[DB] += v.y;
		this.elements[DC] += v.z;
	}

}
