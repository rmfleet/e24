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

interface VoxelInstance {
	renderer: InstanceRenderer;
	texture: Texture;
	voxels: Set<Voxel>;
}

interface VoxelEntry {
	voxel: Voxel;
	instance: VoxelInstance;
}

import { Frustum } from "../frustum/Frustum.js";
import { AxisAlignedBoundingBox } from "../aabb/AxisAlignedBoundingBox.js";

export interface VoxelManagerInput {
	display: Display;
	mesh: Mesh;
	shader: Shader;
	textures: Texture[];
	position: Vector;
}

export class VoxelManager {
	private matrixBindModel: MatrixBindModel;
	private instances: VoxelInstance[];
	private mesh: Mesh;
	private display: Display;
	private voxelMap: Map<string, VoxelEntry>;
	private bounds: AxisAlignedBoundingBox;
	private position: Vector;

	// eslint-disable-next-line max-params
	constructor({ display, mesh, shader, textures, position }: VoxelManagerInput) {
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

	public addVoxel(voxel: Voxel, voxelInstance: VoxelInstance): void {
		voxelInstance.voxels.add(voxel);
		this.voxelMap.set(voxel.position.toString(), { voxel, instance: voxelInstance });
		this.bounds.expandToPoint(voxel.position);
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
	): void {
		const aabbInside = frustum.isAxisAlignedBoxInside(this.bounds);

		if (aabbInside === false) {
			return;
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
	}

	private async load (): Promise<void> {
		// Eventually this will be replaced with a call to a server to get the voxel data for the given position
		for (let x = 0; x < 10; x++) {
			for (let y = 0; y < 10; y++) {
				for (let z = 0; z < 10; z++) {
					const position = new Vector(x, y, z).add(this.position);
					const voxel = new Voxel(position);

					const instanceIndex = Math.floor(Math.random() * this.instances.length);
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
