import type { DepthStencil } from "../depthstencil/DepthStencil";
import { Display } from "../display/Display";
import type { Matrix } from "../matrix/Matrix";
import { MatrixBindModel } from "../matrix/MatrixBind";
import type { Mesh } from "../mesh/Mesh";
import { InstanceRenderer } from "../instance/InstanceRenderer";
import type { Shader } from "../shader/Shader";
import type { Texture } from "../texture/Texture";
import { Vector } from "../vector/Vector";
import {
	Voxel,
	VoxelType
} from "./Voxel";
import { Frustum } from "../frustum/Frustum.js";
import { AxisAlignedBoundingBox } from "../aabb/AxisAlignedBoundingBox.js";
import type { Lighting } from "../lighting/Lighting";
import type { ColorAttachment } from "../colorattachment/ColorAttachment";

interface VoxelInstance {
	renderer: InstanceRenderer;
	texture: Texture;
	voxels: Set<Voxel>;
}

interface VoxelEntry {
	voxel: Voxel;
	instance: VoxelInstance;
}

export interface VoxelRegionInput {
	display: Display;
	mesh: Mesh;
	shader: Shader;
	textures: Texture[];
	position: Vector;
	lighting: Lighting;
}

export class VoxelRegion {
	private matrixBindModel: MatrixBindModel;
	private instances: VoxelInstance[];
	private mesh: Mesh;
	private display: Display;
	private voxelMap: Map<string, VoxelEntry>;
	private bounds: AxisAlignedBoundingBox;
	private position: Vector;
	private lighting: Lighting;

	constructor({ display, mesh, shader, textures, position, lighting }: VoxelRegionInput) {
		this.matrixBindModel = new MatrixBindModel(display.getDevice());
		this.instances = [];
		this.mesh = mesh;
		this.display = display;
		this.voxelMap = new Map();
		this.bounds = new AxisAlignedBoundingBox();
		this.position = position;
		this.lighting = lighting;

		for (const texture of textures) {
			this.createInstanceRenderer(shader, texture, lighting);
		}
	}

	public destroy(): void {
		this.matrixBindModel.destroy();
		for (const instance of this.instances) {
			instance.renderer.destroy();
		}
	}

	public addVoxel(voxel: Voxel, voxelInstance: VoxelInstance): void {
		voxelInstance.voxels.add(voxel);
		this.voxelMap.set(voxel.position.toString(), { voxel, instance: voxelInstance });
		this.bounds.expandToPoint(voxel.position);
	}

	public getPosition(): Vector {
		return this.position;
	}

	public async initialize(): Promise<void> {
		await this.load();

		const promises: Promise<void>[] = [];
		for (const instance of this.instances) {
			promises.push(this.updateInstanceVoxels(instance));
		}
		await Promise.all(promises);
	}

	// eslint-disable-next-line max-params
	public render(
		matrix: Matrix,
		encoder: GPUCommandEncoder,
		colorAttachment: ColorAttachment,
		depthStencil: DepthStencil,
		frustum: Frustum
	): boolean {
		if (this.instances.length === 0) {
			return false;
		}

		const aabbInside = frustum.isAxisAlignedBoxInside(this.bounds);

		if (aabbInside === false) {
			return false;
		}

		this.matrixBindModel.bind(this.display.getDevice(), matrix);

		for (const instance of this.instances) {
			instance.renderer.render(
				encoder,
				[
					this.matrixBindModel.getBindGroup(),
					instance.texture.getBindGroup(),
					this.lighting.getBindGroup()
				],
				colorAttachment,
				depthStencil
			);
		}

		return true;
	}

	private async load (): Promise<void> {
		const response = await fetch(`/region?x=${this.position.x}&y=${this.position.y}&z=${this.position.z}`);
		const data = await response.json();

		let i = 0;
		for (let x = 0; x < 32; x++) {
			for (let y = 0; y < 32; y++) {
				for (let z = 0; z < 32; z++) {
					const voxelType: VoxelType = data[i++];

					if (voxelType < 0) {
						continue;
					}
					const position = new Vector(x, y, z).add(this.position).subtract(new Vector(16, 16, 16));

					const voxel = new Voxel(position, voxelType);
					const voxelInstance = this.instances[voxelType];
					this.addVoxel(voxel, voxelInstance);
				}
			}
		}
	}

	private createInstanceRenderer(shader: Shader, texture: Texture, lighting: Lighting): void {
		const instanceRenderer = new InstanceRenderer(this.display, "load");

		instanceRenderer.initialize([
			this.matrixBindModel.getBindGroupLayout(),
			texture.getBindGroupLayout(),
			lighting.getBindGroupLayout()
		], this.mesh, shader);

		this.instances.push({
			renderer: instanceRenderer,
			texture: texture,
			voxels: new Set<Voxel>()
		});
	}

	private isVoxelOccluded(voxel: Voxel): boolean {
		const neighbors = [
			new Vector(voxel.position.x + 1, voxel.position.y, voxel.position.z),
			new Vector(voxel.position.x - 1, voxel.position.y, voxel.position.z),
			new Vector(voxel.position.x, voxel.position.y + 1, voxel.position.z),
			new Vector(voxel.position.x, voxel.position.y - 1, voxel.position.z),
			new Vector(voxel.position.x, voxel.position.y, voxel.position.z + 1),
			new Vector(voxel.position.x, voxel.position.y, voxel.position.z - 1)
		];

		for (const neighbor of neighbors) {
			const entry = this.voxelMap.get(neighbor.toString());
			if (entry === undefined) {
				return false;
			}

			if (entry?.voxel.isTransparent()) {
				return false;
			}
		}

		return true;
	}

	private async updateInstanceVoxels(voxelInstance: VoxelInstance): Promise<void> {
		const instances: Vector[] = [];
		for (const voxel of voxelInstance.voxels) {
			if (this.isVoxelOccluded(voxel) !== true) {
				instances.push(voxel.position);
			}
		}

		const instanceManager = voxelInstance.renderer.getInstanceManager();
		await instanceManager.setInstances(instances);
	}
}
