/* eslint-disable max-depth */
import express, {
	type Express,
	type Request,
	type Response
} from "express";
import path from "path";
import { Vector } from "../vector/Vector.js";

import { createNoise3D } from "simplex-noise";



const noise3D = createNoise3D();

function generateBaseHeight(x: number, z: number): number {
	const frequency = 0.01;
	const amplitude = 20;
	const baseNoiseValue = noise3D(x * frequency, 0, z * frequency);
	return baseNoiseValue * amplitude;
}

function generateDetailHeight(x: number, z: number): number {
	const frequency = 0.05;  // Higher frequency for smaller features
	const amplitude = 5;     // Smaller amplitude for detail
	const detailNoiseValue = noise3D(x * frequency, 100, z * frequency);
	return detailNoiseValue * amplitude;
}

function classifyVoxel(globalX: number, globalY: number, globalZ: number, baseHeight: number, detailHeight: number): number {
	const seaLevel = 0; // Define the sea level height inside the function
	const totalHeight = baseHeight + detailHeight;
	const dirtDepth = 4;

	// Stone layer for lower regions
	if (globalY < totalHeight - dirtDepth) {
		return 2; // Stone
	}

	// Water layer at or below sea level but above the terrain
	if (globalY <= seaLevel && globalY > totalHeight) {
		return 4; // Water
	}

	// Transition zone near sea level
	const sandTransitionStart = seaLevel - 2; // Where sand starts appearing
	const sandTransitionEnd = seaLevel + 1;   // Just above sea level

	if (globalY >= sandTransitionStart && globalY <= sandTransitionEnd) {
		if (globalY > totalHeight) {
			return 4; // Shallow Water
		} else if (globalY >= totalHeight - 1) {
			return 3; // Sand
		}
	}

	// Grass on top
	if (globalY === Math.floor(totalHeight)) {
		return 1; // Grass
	}

	// Dirt below grass
	if (globalY > totalHeight - dirtDepth && globalY < totalHeight) {
		return 0; // Dirt
	}

	// Default to air above terrain
	return -1; // Air
}


export class Server {
	expressServer: Express;

	constructor(public port: number) {
		this.expressServer = express();
		this.expressServer.use(express.static(path.resolve(process.cwd(), "dist", "public")));

		this.expressServer.get("/region/:x/:y/:z", (request: Request, response: Response) => {
			const regionPosition = new Vector(
				parseInt(request.params.x),
				parseInt(request.params.y),
				parseInt(request.params.z)
			);

			const data: number[] = [];
			for (let x = 0; x < 32; x++) {
				for (let y = 0; y < 32; y++) {
					for (let z = 0; z < 32; z++) {
						const globalX = regionPosition.x + x;
						const globalY = regionPosition.y + y;
						const globalZ = regionPosition.z + z;

						const baseHeight = generateBaseHeight(globalX, globalZ);
						const detailHeight = generateDetailHeight(globalX, globalZ);

						// Classify the voxel based on combined height data
						const voxelType = classifyVoxel(globalX, globalY, globalZ, baseHeight, detailHeight);
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
