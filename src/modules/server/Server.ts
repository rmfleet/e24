/* eslint-disable max-depth */
import express, {
	type Express,
	type Request,
	type Response
} from "express";
import path from "path";
import { Vector } from "../vector/Vector.js";

import { createNoise3D } from "simplex-noise";
import { VoxelType } from "../voxel/Voxel.js";

const seed = 0;

const noise3D = createNoise3D(() => seed);

function generateBaseHeight(v: Vector): number {
	const frequency = 0.01;
	const amplitude = 20;
	const baseNoiseValue = noise3D(v.x * frequency, 0, v.z * frequency);
	return baseNoiseValue * amplitude;
}

function generateDetailHeight(v: Vector): number {
	const frequency = 0.025;
	const amplitude = 5;
	const detailNoiseValue = noise3D(v.x * frequency, 100, v.z * frequency);
	return detailNoiseValue * amplitude;
}

function classifyVoxel(global: Vector, baseHeight: number, detailHeight: number): number {
	const seaLevel = 0;
	const totalHeight = baseHeight + detailHeight;
	const dirtDepth = 4;

	if (global.y < totalHeight - dirtDepth) {
		return VoxelType.Stone;
	}

	if (global.y <= seaLevel && global.y > totalHeight) {
		return VoxelType.Water;
	}

	const sandTransitionStart = seaLevel - 2;
	const sandTransitionEnd = seaLevel + 1;

	if (global.y >= sandTransitionStart && global.y <= sandTransitionEnd) {
		if (global.y > totalHeight) {
			return VoxelType.Water;
		} else if (global.y >= totalHeight - 1) {
			return VoxelType.Sand;
		}
	}

	if (global.y === Math.floor(totalHeight)) {
		return VoxelType.Grass;
	}

	if (global.y > totalHeight - dirtDepth && global.y < totalHeight) {
		return VoxelType.Dirt;
	}

	return VoxelType.Air;
}


export class Server {
	expressServer: Express;

	constructor(public port: number) {
		this.expressServer = express();
		this.expressServer.use(express.static(path.resolve(process.cwd(), "dist", "public")));

		this.expressServer.get("/region", (request: Request, response: Response) => {
			const regionPosition = new Vector(
				parseInt(request.query.x as string),
				parseInt(request.query.y as string),
				parseInt(request.query.z as string)
			);

			const data: number[] = [];
			for (let x = 0; x < 32; x++) {
				for (let y = 0; y < 32; y++) {
					for (let z = 0; z < 32; z++) {
						const global = new Vector(x, y, z).add(regionPosition);
						const baseHeight = generateBaseHeight(global);
						const detailHeight = generateDetailHeight(global);

						const voxelType = classifyVoxel(global, baseHeight, detailHeight);
						data.push(voxelType);
					}
				}
			}
			response.status(200).json(data);
		});

		this.expressServer.delete("*", (request: Request, response: Response) => {
			response.status(404).send("DELETE route does not exist at this location");
		});

		this.expressServer.post("*", (request: Request, response: Response) => {
			response.status(404).send("POST route does not exist at this location");
		});

		this.expressServer.put("*", (request: Request, response: Response) => {
			response.status(404).send("PUT route does not exist at this location");
		});
	}

	listen (): Promise<void> {
		return new Promise((resolve, reject) => {
			try {
				this.expressServer.listen(this.port, () => {
					resolve();
				});
			} catch (error: unknown) {
				reject(error);
			}
		});
	}
}
