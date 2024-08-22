import type { DepthStencil } from "../depthstencil/DepthStencil";
import { Display } from "../display/Display";
import type { Matrix } from "../matrix/Matrix";
import { MatrixBindModel } from "../matrix/MatrixBind";
import type { Mesh } from "../mesh/Mesh";
import { InstanceRenderer } from "../instance/InstanceRenderer";
import type { Shader } from "../shader/Shader";
import type { Texture } from "../texture/Texture";
import { Vector } from "../vector/Vector";
import { Voxel } from "./Voxel";
import { Frustum } from "../frustum/Frustum.js";
import { AxisAlignedBoundingBox } from "../aabb/AxisAlignedBoundingBox.js";

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
}

export class VoxelRegion {
	private matrixBindModel: MatrixBindModel;
	private instances: VoxelInstance[];
	private mesh: Mesh;
	private display: Display;
	private voxelMap: Map<string, VoxelEntry>;
	private bounds: AxisAlignedBoundingBox;
	private position: Vector;

	// eslint-disable-next-line max-params
	constructor({ display, mesh, shader, textures, position }: VoxelRegionInput) {
		this.matrixBindModel = new MatrixBindModel(display.getDevice());
		this.instances = [];
		this.mesh = mesh;
		this.display = display;
		this.voxelMap = new Map();
		this.bounds = new AxisAlignedBoundingBox();
		this.position = position;

		for (const texture of textures) {
			this.createInstanceRenderer(shader, texture);
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
		view: GPUTextureView,
		depthStencil: DepthStencil,
		frustum: Frustum
	): boolean {
		const aabbInside = frustum.isAxisAlignedBoxInside(this.bounds);

		if (aabbInside === false) {
			return false;
		}

		this.matrixBindModel.bind(this.display.getDevice(), matrix);

		for (const instance of this.instances) {
			instance.renderer.render(
				encoder,
				view,
				[
					this.matrixBindModel.getBindGroup(),
					instance.texture.getBindGroup()
				],
				depthStencil
			);
		}

		return true;
	}

	private async load (): Promise<void> {
		const response = await fetch(`/region/${this.position.x}/${this.position.y}/${this.position.z}`);
		const data = await response.json();

		let i = 0;
		for (let x = 0; x < 32; x++) {
			for (let y = 0; y < 32; y++) {
				for (let z = 0; z < 32; z++) {
					const instanceIndex = data[i++];

					if (instanceIndex < 0) {
						continue;
					}
					const position = new Vector(x, y, z).add(this.position).subtract(new Vector(16, 16, 16));

					const voxel = new Voxel(position);
					const voxelInstance = this.instances[instanceIndex];
					this.addVoxel(voxel, voxelInstance);
				}
			}
		}
	}

	private createInstanceRenderer(shader: Shader, texture: Texture): void {
		const instanceRenderer = new InstanceRenderer(this.display, "load");

		instanceRenderer.initialize([
			this.matrixBindModel.getBindGroupLayout(),
			texture.getBindGroupLayout()
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
			if (!this.voxelMap.has(neighbor.toString())) {
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
