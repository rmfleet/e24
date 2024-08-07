interface MeshData {
	version: number;
	vertices: Float32Array;
	colors: Float32Array;
	texcoords: Float32Array;
	indices: Uint16Array;
}

export class Mesh implements MeshData {
	version: number;
	vertices: Float32Array;
	colors: Float32Array;
	texcoords: Float32Array;
	indices: Uint16Array;

	constructor(meshData: MeshData | undefined = undefined) {
		this.version = meshData?.version || 0;
		this.vertices = meshData?.vertices || new Float32Array();
		this.colors = meshData?.colors || new Float32Array();
		this.texcoords = meshData?.texcoords || new Float32Array();
		this.indices = meshData?.indices || new Uint16Array();
	}

	async loadFromUrl(url: string): Promise<void> {
		const response = await fetch(url);
		const jsonString = await response.text();
		this.parse(jsonString);
	}

	private parse(jsonString: string): void {
		const meshData: MeshData = JSON.parse(jsonString);
		this.version = meshData.version;
		this.vertices = new Float32Array(meshData.vertices);
		this.colors = new Float32Array(meshData.colors);
		this.texcoords = new Float32Array(meshData.texcoords);
		this.indices = new Uint16Array(meshData.indices);
	}
}

