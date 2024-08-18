import { DepthStencil } from "../depthstencil/DepthStencil.js";
import { Display } from "../display/Display.js";
import { IndirectBufferManager } from "../indirect/IndirectBufferManager.js";
import { InstanceManager } from "./InstanceManager.js";
import { Mesh } from "../mesh/Mesh.js";
import { Shader } from "../shader/Shader.js";

export class InstanceRenderer {
	private display: Display;
	private renderPipeline: GPURenderPipeline;
	private vertexBuffer: GPUBuffer;
	private vertexColorBuffer: GPUBuffer;
	private vertexTexCoordBuffer: GPUBuffer;
	private indexBuffer: GPUBuffer;
	private instanceManager: InstanceManager;
	private numIndices: number;
	private colorLoadOp: GPULoadOp;
	private indirectBufferManager: IndirectBufferManager;

	constructor(display: Display, colorLoadOp: GPULoadOp) {
		this.display = display;
		this.renderPipeline = {} as GPURenderPipeline;
		this.vertexBuffer = {} as GPUBuffer;
		this.vertexColorBuffer = {} as GPUBuffer;
		this.vertexTexCoordBuffer = {} as GPUBuffer;
		this.indexBuffer = {} as GPUBuffer;
		this.numIndices = 0;
		this.colorLoadOp = colorLoadOp;
		this.indirectBufferManager = new IndirectBufferManager(display, this.numIndices);

		this.instanceManager = new InstanceManager(
			display,
			500,
			this.updateIndirectBuffer.bind(this)
		);
	}

	public getInstanceManager(): InstanceManager {
		return this.instanceManager;
	}

	private updateIndirectBuffer(instanceCount: number): void {
		this.indirectBufferManager.updateIndirectBuffer(instanceCount);
	}

	private getVertexBufferLayouts(): GPUVertexBufferLayout[] {
		const vertexCoordBufferLayout: GPUVertexBufferLayout = {
			attributes: [
				{ shaderLocation: 0, offset: 0, format: "float32x3" }
			],
			arrayStride: 12,
			stepMode: "vertex"
		};

		const vertexColorBufferLayout: GPUVertexBufferLayout = {
			attributes: [
				{ shaderLocation: 1, offset: 0, format: "float32x3" }
			],
			arrayStride: 12,
			stepMode: "vertex"
		};

		const vertexTexCoordBufferLayout: GPUVertexBufferLayout = {
			attributes: [
				{ shaderLocation: 2, offset: 0, format: "float32x2" }
			],
			arrayStride: 8,
			stepMode: "vertex"
		};

		const instancePositionBufferLayout: GPUVertexBufferLayout = {
			attributes: [
				{ shaderLocation: 3, offset: 0, format: "float32x3" }
			],
			arrayStride: 12,
			stepMode: "instance"
		};

		const vertexBufferLayouts: GPUVertexBufferLayout[] = [
			vertexCoordBufferLayout,
			vertexColorBufferLayout,
			vertexTexCoordBufferLayout,
			instancePositionBufferLayout
		];

		return vertexBufferLayouts;
	}

	private initialiizeVertexColorsBuffer(colors: Float32Array): void {
		this.vertexColorBuffer = this.display.getDevice().createBuffer({
			size: colors.byteLength,
			usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
		});

		this.display.getDevice().queue.writeBuffer(this.vertexColorBuffer, 0, colors);
	}

	private initializeVertexCoordsBuffer(vertexCoords: Float32Array): void {
		this.vertexBuffer = this.display.getDevice().createBuffer({
			size: vertexCoords.byteLength,
			usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
		});

		this.display.getDevice().queue.writeBuffer(this.vertexBuffer, 0, vertexCoords);
	}

	private initializeVertexTexCoordsBuffer(texCoords: Float32Array): void {
		this.vertexTexCoordBuffer = this.display.getDevice().createBuffer({
			size: texCoords.byteLength,
			usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
		});

		this.display.getDevice().queue.writeBuffer(this.vertexTexCoordBuffer, 0, texCoords);
	}

	private initializeIndexBuffer(indices: Uint16Array): void {
		const alignedLength = Math.ceil(indices.byteLength / 4) * 4;
		const paddedIndices = new Uint16Array(alignedLength / 2);
		paddedIndices.set(indices);

		this.indexBuffer = this.display.getDevice().createBuffer({
			size: paddedIndices.byteLength,
			usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST
		});

		this.display.getDevice().queue.writeBuffer(this.indexBuffer, 0, paddedIndices);

		this.numIndices = indices.length;
		this.indirectBufferManager = new IndirectBufferManager(this.display, this.numIndices);
	}

	private initializeRenderPipeline(shaderModule: GPUShaderModule, bindGroupLayouts: GPUBindGroupLayout[]): void {
		const vertexState: GPUVertexState = {
			module: shaderModule,
			entryPoint: "vs",
			buffers: this.getVertexBufferLayouts()
		};

		const fragmentState: GPUFragmentState = {
			module: shaderModule,
			entryPoint: "fs",
			targets: [
				{
					format: this.display.getPixelFormat()
				}
			]
		};

		const primitiveState: GPUPrimitiveState = {
			topology: "triangle-list",
			cullMode: "back",
			frontFace: "ccw"
		};

		const layout: GPUPipelineLayout = this.display.getDevice().createPipelineLayout({
			bindGroupLayouts: bindGroupLayouts
		});

		const depthCompare: GPUCompareFunction = "less";
		const stencilFormat: GPUTextureFormat = "depth24plus";

		const depthStencil: GPUDepthStencilState = {
			depthWriteEnabled: true,
			depthCompare: depthCompare,
			format: stencilFormat
		};

		const renderPipelineDescriptor: GPURenderPipelineDescriptor = {
			vertex: vertexState,
			fragment: fragmentState,
			primitive: primitiveState,
			layout: layout,
			depthStencil: depthStencil
		};

		this.renderPipeline = this.display.getDevice().createRenderPipeline(renderPipelineDescriptor);
	}

	public initialize(bindGroupLayouts: GPUBindGroupLayout[], mesh: Mesh, shader: Shader): void {
		this.initializeRenderPipeline(shader.getModule(), bindGroupLayouts);
		this.initializeVertexCoordsBuffer(mesh.vertices);
		this.initialiizeVertexColorsBuffer(mesh.colors);
		this.initializeVertexTexCoordsBuffer(mesh.texcoords);
		this.initializeIndexBuffer(mesh.indices);
	}

	render(
		encoder: GPUCommandEncoder,
		view: GPUTextureView,
		bindGroups: GPUBindGroup[],
		depthStencil: DepthStencil
	): void {
		const pass = encoder.beginRenderPass(this.getRenderPassDescriptor(view, depthStencil));

		pass.setPipeline(this.renderPipeline);

		for (let i = 0; i < bindGroups.length; i++) {
			pass.setBindGroup(i, bindGroups[i]);
		}

		pass.setVertexBuffer(0, this.vertexBuffer);
		pass.setVertexBuffer(1, this.vertexColorBuffer);
		pass.setVertexBuffer(2, this.vertexTexCoordBuffer);
		pass.setVertexBuffer(3, this.instanceManager.getInstanceBuffer());
		pass.setIndexBuffer(this.indexBuffer, "uint16");

		pass.drawIndexedIndirect(this.indirectBufferManager.getIndirectBuffer(), 0);
		pass.end();
	}

	private getRenderPassDescriptor(view: GPUTextureView, depthStencil: DepthStencil): GPURenderPassDescriptor {
		const colorAttachments: GPURenderPassColorAttachment[] = [{
			clearValue: [0.1, 0.2, 0.3, 1],
			loadOp: this.colorLoadOp,
			storeOp: "store",
			view: view
		}];

		const renderPassDescriptor: GPURenderPassDescriptor = {
			colorAttachments: colorAttachments,
			depthStencilAttachment: depthStencil.getDepthStencilAttachment()
		};

		return renderPassDescriptor;
	}
}
