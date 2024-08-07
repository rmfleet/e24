export class Texture {
	private bindGroup: GPUBindGroup;
	private bindGroupLayout: GPUBindGroupLayout;

	constructor () {
		this.bindGroup = {} as GPUBindGroup;
		this.bindGroupLayout = {} as GPUBindGroupLayout;
	}

	private copyTextureToDevice (device: GPUDevice, imageBitmap: ImageBitmap): GPUTexture {
		const copySize: GPUExtent3DStrict = {
			width: imageBitmap.width,
			height: imageBitmap.height
		};

		const format: GPUTextureFormat = "rgba8unorm";

		const usage: GPUTextureUsageFlags =
			GPUTextureUsage.TEXTURE_BINDING |
			GPUTextureUsage.COPY_DST |
			GPUTextureUsage.RENDER_ATTACHMENT;

		const descriptor: GPUTextureDescriptor = {
			size: copySize,
			format: format,
			usage: usage
		};

		const imageTexture: GPUTexture = device.createTexture(descriptor);

		const source: GPUImageCopyExternalImage = {
			source: imageBitmap
		};

		const texture: GPUImageCopyTextureTagged = {
			texture: imageTexture
		};

		device.queue.copyExternalImageToTexture(source, texture, copySize);

		return imageTexture;
	}

	private createBindGroup (device: GPUDevice, imageTexture: GPUTexture): void {
		this.bindGroupLayout = this.createBindGroupLayout(device);
		const descriptor: GPUBindGroupDescriptor = {
			layout: this.bindGroupLayout,
			entries: this.createBindGroupEntries(device, imageTexture)
		};

		this.bindGroup = device.createBindGroup(descriptor);
	}

	getBindGroup (): GPUBindGroup {
		return this.bindGroup;
	}

	getBindGroupLayout (): GPUBindGroupLayout {
		return this.bindGroupLayout;
	}

	private createBindGroupEntries (device: GPUDevice, imageTexture: GPUTexture): GPUBindGroupEntry[] {
		const minFilterMode: GPUFilterMode = "linear";
		const magFilterMode: GPUFilterMode = "linear";

		const imageSampler: GPUSampler = device.createSampler({
			minFilter: minFilterMode,
			magFilter: magFilterMode
		});

		const samplerEntry: GPUBindGroupEntry = {
			binding: 0,
			resource: imageSampler
		};

		const textureView: GPUTextureView = imageTexture.createView();

		const textureEntry: GPUBindGroupEntry = {
			binding: 1,
			resource: textureView
		};

		const entries: GPUBindGroupEntry[] = [
			samplerEntry,
			textureEntry
		];

		return entries;
	}

	private createBindGroupLayout (device: GPUDevice): GPUBindGroupLayout {
		const samplerBindingType: GPUSamplerBindingType = "filtering";

		const samplerBindGroupEntry: GPUBindGroupLayoutEntry = {
			binding: 0,
			visibility: GPUShaderStage.FRAGMENT,
			sampler: {
				type: samplerBindingType
			}
		};

		const textureSampleType: GPUTextureSampleType = "float";
		const textureViewDimension: GPUTextureViewDimension = "2d";

		const textureBindGroupEntry: GPUBindGroupLayoutEntry = {
			binding: 1,
			visibility: GPUShaderStage.FRAGMENT,
			texture: {
				sampleType: textureSampleType,
				viewDimension: textureViewDimension,
				multisampled: false
			}
		};

		const entries: GPUBindGroupLayoutEntry[] = [
			samplerBindGroupEntry,
			textureBindGroupEntry
		];

		const descriptor: GPUBindGroupLayoutDescriptor = {
			entries: entries
		};

		const bindGroupLayout: GPUBindGroupLayout = device.createBindGroupLayout(descriptor);

		return bindGroupLayout;
	}

	private async loadImage (url: string): Promise<ImageBitmap> {
		const getResponse = await fetch(url);
		const blob: Blob = await getResponse.blob();

		const imageBitmap: ImageBitmap = await createImageBitmap(blob);
		return imageBitmap;
	}

	async loadTexture (url: string, device: GPUDevice): Promise<void> {
		const imageBitmap: ImageBitmap = await this.loadImage(url);
		const imageTexture: GPUTexture = this.copyTextureToDevice(device, imageBitmap);
		this.createBindGroup(device, imageTexture);
	}
}
