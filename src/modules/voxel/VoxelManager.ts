import type { DepthStencil } from "../depthstencil/DepthStencil";
import { Display } from "../display/Display";
import type { Matrix } from "../matrix/Matrix";
import { MatrixBindModel } from "../matrix/MatrixBind";
import type { Mesh } from "../mesh/Mesh";
import { InstanceRenderer } from "../render/InstanceRenderer";
import type { Shader } from "../shader/Shader";
import type { Texture } from "../texture/Texture";
import { Vector } from "../vector/Vector";
import { Voxel } from "./Voxel";

interface VoxelInstance {
	renderer: InstanceRenderer;
	texture: Texture;
	voxels: Map<string, Voxel>;
}

export class VoxelManager {
	private matrixBindModel: MatrixBindModel;
	private instances: VoxelInstance[];
	private mesh: Mesh;
	private display: Display;

	constructor(display: Display, mesh: Mesh, shader: Shader, textures: Texture[]) {
		this.matrixBindModel = new MatrixBindModel(display.getDevice());
		this.instances = [];
		this.mesh = mesh;
		this.display = display;

		for (const texture of textures) {
			this.createInstanceRenderer(shader, texture);
		}
	}

	public async initialize(): Promise<void> {
		for (let x = 0; x < 50; x++) {
			for (let y = 0; y < 50; y++) {
				for (let z = 0; z < 50; z++) {
					const position = new Vector(x, y, z);
					const voxel = new Voxel(position);
					const instanceIndex = Math.floor(Math.random() * this.instances.length);
					this.instances[instanceIndex].voxels.set(position.toString(), voxel);
				}
			}
		}

		const promises: Promise<void>[] = [];
		for (const instance of this.instances) {
			promises.push(this.updateInstanceVoxels(instance));
		}
		await Promise.all(promises);
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
			voxels: new Map()
		});
	}

	private async updateInstanceVoxels(voxelInstance: VoxelInstance): Promise<void> {
		const instances: Vector[] = Array.from(voxelInstance.voxels.values()).map(voxel => voxel.position);
		const instanceManager = voxelInstance.renderer.getInstanceManager();
		await instanceManager.setInstances(instances);
	}

	public render(
		matrix: Matrix,
		encoder: GPUCommandEncoder,
		view: GPUTextureView,
		depthStencil: DepthStencil
	): void {
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
}
