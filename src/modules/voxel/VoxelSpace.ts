import type { Camera } from "../camera/Camera.js";
import type { ColorAttachment } from "../colorattachment/ColorAttachment.js";
import type { DepthStencil } from "../depthstencil/DepthStencil.js";
import type { Display } from "../display/Display.js";
import type { Frustum } from "../frustum/Frustum.js";
import type { Lighting } from "../lighting/Lighting.js";
import type { Matrix } from "../matrix/Matrix.js";
import type { Mesh } from "../mesh/Mesh.js";
import type { Shader } from "../shader/Shader.js";
import type { Texture } from "../texture/Texture.js";
import { Vector } from "../vector/Vector.js";
import { VoxelRegion } from "./VoxelRegion.js";

export interface VoxelSpaceInput {
	display: Display;
	mesh: Mesh;
	shader: Shader;
	textures: Texture[];
	position: Vector;
	loadDistance: Vector;
	unloadDistance: Vector;
	lighting: Lighting;
}

export interface VoxelSpaceRenderInput {
	camera: Camera;
	matrix: Matrix;
	encoder: GPUCommandEncoder;
	colorAttachment: ColorAttachment;
	depthStencil: DepthStencil;
	frustum: Frustum;
}

export class VoxelSpace {
	private position: Vector = new Vector();
	private display: Display;
	private mesh: Mesh;
	private shader: Shader;
	private textures: Texture[];
	private voxelRegions: Map<string, VoxelRegion> = new Map();
	private loadDistance: Vector;
	private unloadDistance: Vector;
	private regionSize: number = 32;
	private lighting: Lighting;

	private regionsToLoadQueue: string[] = [];
	private isLoading: boolean = false;

	constructor(input: VoxelSpaceInput) {
		this.display = input.display;
		this.mesh = input.mesh;
		this.shader = input.shader;
		this.textures = input.textures;
		this.position = new Vector(Infinity, Infinity, Infinity);
		this.loadDistance = input.loadDistance;
		this.unloadDistance = input.unloadDistance;
		this.lighting = input.lighting;
		this.setPosition(input.position);
	}

	public setPosition(position: Vector): void {
		if (this.position.equals(position)) {
			return;
		}

		this.position = position.clone();
		this.updateRegions();
	}

	public render(input: VoxelSpaceRenderInput): void {
		this.setPosition(input.camera.position);
		let renderCount = 0;
		for (const region of this.voxelRegions.values()) {
			if (region.render(input.matrix, input.encoder, input.colorAttachment, input.depthStencil, input.frustum)) {
				renderCount++;
			}
		}

		const regionsElement = document.getElementById("regions") as HTMLElement;
		regionsElement.textContent = `Regions: ${renderCount} of ${this.voxelRegions.size}`;

		if (!this.isLoading && this.regionsToLoadQueue.length > 0) {
			const key = this.regionsToLoadQueue.shift()!;
			const [x, y, z] = key.split(",").map(Number);
			this.loadRegion(new Vector(x, y, z));
		}
	}

	private loadRegion(regionCenter: Vector): void {
		const key = this.getRegionKey(regionCenter);
		if (!this.voxelRegions.has(key)) {
			this.isLoading = true;

			const voxelRegionInput = {
				display: this.display,
				mesh: this.mesh,
				shader: this.shader,
				textures: this.textures,
				position: regionCenter,
				lighting: this.lighting
			};

			const newRegion = new VoxelRegion(voxelRegionInput);
			newRegion.initialize().then(() => {
				this.voxelRegions.set(key, newRegion);
				this.isLoading = false;
			});
		}
	}

	private updateRegions(): void {
		const regionsToLoad: Set<string> = new Set();
		const regionsToUnload: Set<string> = new Set(this.voxelRegions.keys());

		const scaledLoadDistance = this.loadDistance.clone().inverseScale(this.regionSize).scale(this.regionSize);
		const halfRegionSize = this.regionSize / 2;

		const currentRegion = this.position.clone()
			.inverseScale(this.regionSize)
			.floor()
			.scale(this.regionSize)
			.addScalar(halfRegionSize);

		const regionElement = document.getElementById("region") as HTMLElement;
		regionElement.textContent = `Region: ${currentRegion.toString()}`;

		const start = currentRegion.clone().subtract(scaledLoadDistance);
		const end = currentRegion.clone().add(scaledLoadDistance);

		for (let x = start.x; x <= end.x; x += this.regionSize) {
			for (let y = start.y; y <= end.y; y += this.regionSize) {
				for (let z = start.z; z <= end.z; z += this.regionSize) {
					const regionCenter = new Vector(x, y, z);
					const distance = this.position.clone().subtract(regionCenter).abs();

					const key = this.getRegionKey(regionCenter);

					if (distance.allLessThanOrEqual(this.loadDistance)) {
						regionsToLoad.add(key);
						regionsToUnload.delete(key);
					}
				}
			}
		}

		// Add regions to the loading queue
		for (const key of regionsToLoad) {
			if (!this.regionsToLoadQueue.includes(key)) {
				this.regionsToLoadQueue.push(key);
			}
		}

		// Unload regions that are outside the unload distance
		for (const key of regionsToUnload) {
			const [x, y, z] = key.split(",").map(Number);
			const regionCenter = new Vector(x, y, z);
			const distance = this.position.clone().subtract(regionCenter).abs();
			if (distance.anyGreaterThan(this.unloadDistance)) {
				this.unloadRegion(regionCenter);
			}
		}
	}

	private getRegionKey(regionCenter: Vector): string {
		return `${regionCenter.x},${regionCenter.y},${regionCenter.z}`;
	}

	private unloadRegion(regionCenter: Vector): void {
		const key = this.getRegionKey(regionCenter);
		if (this.voxelRegions.has(key)) {
			this.voxelRegions.get(key)?.destroy();
			this.voxelRegions.delete(key);
		}
	}
}
