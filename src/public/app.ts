import "./app.scss";
import { Canvas } from "../modules/canvas/Canvas.js";
import { Display } from "../modules/display/Display.js";
import { LoopModel } from "../modules/loop/Loop.js";
import { degreeToRadian } from "../modules/maths/Trigonometry.js";
import { Matrix } from "../modules/matrix/Matrix.js";
import { InstanceRenderer } from "../modules/instance/InstanceRenderer.js";
import { Texture } from "../modules/texture/Texture.js";
import { DepthStencil } from "../modules/depthstencil/DepthStencil.js";
import { MatrixBindModel } from "../modules/matrix/MatrixBind.js";
import { Vector } from "../modules/vector/Vector.js";
import { Camera } from "../modules/camera/Camera.js";
import { Mesh } from "../modules/mesh/Mesh.js";
import { Input } from "../modules/input/Input.js";
import { Shader } from "../modules/shader/Shader.js";
import { Frustum } from "../modules/frustum/Frustum.js";
import { VoxelSpace } from "../modules/voxel/VoxelSpace.js";

let loopModel: LoopModel;

declare global {
    interface Window {
        cmd: (command: string) => void;
    }
}

window.cmd = function(command: string): void {
	const parts = command.split(" ");
	switch (parts[0]) {
		case "pause":
			if (parts[1] === "true") {

				loopModel.pause();
				console.info("Pausing the loop");
			} else {
				loopModel.resume();
				console.info("Resuming the loop");
			}
			break;
		default:
			console.info("Unknown command");
	}
};

(async (): Promise<void> => {
	try {
		const canvas: Canvas = new Canvas();
		const display: Display = new Display(canvas);
		await display.initialize();

		const projectionMatrix: Matrix = new Matrix();

		const texture: Texture = new Texture();
		await texture.loadTexture("/textures/dirt-1.webp", display.getDevice());

		const texture2: Texture = new Texture();
		await texture2.loadTexture("/textures/grass-1.webp", display.getDevice());

		const texture3: Texture = new Texture();
		await texture3.loadTexture("/textures/rock-1.webp", display.getDevice());

		const texture4: Texture = new Texture();
		await texture4.loadTexture("/textures/sand-1.webp", display.getDevice());

		const texture5: Texture = new Texture();
		await texture5.loadTexture("/textures/water-1.webp", display.getDevice());

		const shader: Shader = new Shader();
		await shader.loadShader("/shaders/shader1.wgsl", display);

		const mesh = new Mesh();
		await mesh.loadFromUrl("/meshes/cube.json");

		const matrixBindModel1: MatrixBindModel = new MatrixBindModel(display.getDevice());
		const render = new InstanceRenderer(display, "clear");
		render.initialize([
			matrixBindModel1.getBindGroupLayout(),
			texture.getBindGroupLayout()
		], mesh, shader);

		const positions1: Vector[] = [
			new Vector(-1, 0, -5),
			new Vector(1, 0, -5),
			new Vector(0, 1, -5),
			new Vector(0, -1, -5)
		];

		const instanceManager1 = render.getInstanceManager();
		await instanceManager1.setInstances(positions1);

		//		const voxelManagerInput = {
		//			display,
		//			mesh,
		//			shader,
		//			textures: [texture, texture2, texture3],
		//			position: new Vector(-5, -10, -5)
		//		};


		const voxelSpaceInput = {
			display,
			mesh,
			shader,
			textures: [texture, texture2, texture3, texture4, texture5],
			position: new Vector(0, 0, 0),
			loadDistance: new Vector(64, 32, 64),
			unloadDistance: new Vector(64, 32, 64)
		};

		const voxelSpace = new VoxelSpace(voxelSpaceInput);

		//		const voxelManager = new VoxelRegion(voxelManagerInput);
		//		await voxelManager.initialize();


		const modelMatrix: Matrix = new Matrix();
		const viewMatrix: Matrix = new Matrix();

		const depthStencil: DepthStencil = new DepthStencil(
			display.getDevice(),
			canvas,
			"clear"
		);

		const camera = new Camera();
		camera.identity();
		voxelSpace.setPosition(camera.position);

		const input = new Input((x: number, y: number): void => {
			camera.yaw(-x / 100);
			if (!camera.pitchLimit(-y / 100)) {
				camera.pitch(-y / 100);
			}
		}, (key: string): void => {
			if (key === "]") {
				input.toggleFullscreen();
			}
		});

		let rotationX: number = 0;
		let rotationY: number = 0;
		let counter = 0;

		const renderFpsElement = document.getElementById("renderfps") as HTMLElement;
		const updateFpsElement = document.getElementById("updatefps") as HTMLElement;
		const positionElement = document.getElementById("position") as HTMLElement;

		let renderFrameCount = 0;
		let updateFrameCount = 0;
		let lastRenderTime = performance.now();
		let lastUpdateTime = performance.now();

		const appLoop = async (): Promise<void> => {
			updateFrameCount++;
			const now = performance.now();
			const deltaTime = now - lastUpdateTime;

			if (deltaTime >= 1000) {
				const updateFps = (updateFrameCount / deltaTime) * 1000;
				updateFpsElement.textContent = `Update FPS: ${Math.round(updateFps)}`;
				updateFrameCount = 0;
				lastUpdateTime = now;
			}


			counter += 1;
			if (counter === 100) {
				counter = 0;
			}

			rotationX += 0.005;
			rotationY += 0.01;

			if (counter === 25) {
			//	positions1.push(new Vector(0, 0, -5));
			//	instanceManager1.addInstance(new Vector(0, 0, -5));
			//	instanceManager2.removeInstance(new Vector(0, 0, -5));
			//	await render.setInstancePositions(positions1);
			//	await instanceManager2.commitUpdates();
			}

			if (counter === 75) {
			//	instanceManager2.addInstance(new Vector(0, 0, -5));
			//	instanceManager1.removeInstance(new Vector(0, 0, -5));
			//	await instanceManager1.commitUpdates();
			//	await instanceManager2.commitUpdates();
			}
		};

		const renderLoop = async (): Promise<void> => {
			renderFrameCount++;
			const now = performance.now();
			const deltaTime = now - lastRenderTime;

			if (deltaTime >= 1000) {
				const renderFps = (renderFrameCount / deltaTime) * 1000;
				renderFpsElement.textContent = `Render FPS: ${Math.round(renderFps)}`;
				renderFrameCount = 0;
				lastRenderTime = now;
			}

			positionElement.textContent = `Position: ${camera.position.toString()}`;

			if (input.isMouseDown("left")) {
				input.requestPointerLock();
			}

			if (input.isKeyDown("Escape")) {
				input.releasePointerLock();
			}

			if (input.isKeyDown("ArrowLeft")) {
				camera.yaw(0.025);
			}

			if (input.isKeyDown("ArrowRight")) {
				camera.yaw(-0.025);
			}

			if (input.isKeyDown("ArrowUp")) {
				if (!camera.pitchLimit(0.025)) {
					camera.pitch(0.025);
				}
			}

			if (input.isKeyDown("ArrowDown")) {
				if (!camera.pitchLimit(-0.025)) {
					camera.pitch(-0.025);
				}
			}

			if (input.isKeyDown("w") || input.isKeyDown("W")) {
				camera.move(-0.05);
			}

			if (input.isKeyDown("s") || input.isKeyDown("S")) {
				camera.move(0.05);
			}

			if (input.isKeyDown("a") || input.isKeyDown("A")) {
				camera.strafe(-0.05);
			}

			if (input.isKeyDown("d") || input.isKeyDown("D")) {
				camera.strafe(0.05);
			}

			camera.setUpright();

			voxelSpace.setPosition(camera.position);

			const cameraMatrix = camera.getViewMatrix();

			projectionMatrix.setPerspective(degreeToRadian(60), canvas.getAspectRatio(), 0.1, 1000);

			// Render the rotating cubes
			modelMatrix.setRotation(new Vector(0, 1, 0), rotationY);
			modelMatrix.concatenate(new Matrix().setRotation(new Vector(1, 0, 0), rotationX));
			modelMatrix.translate(new Vector(0, 0, 0));

			viewMatrix.set(cameraMatrix);
			viewMatrix.concatenate(modelMatrix);

			let pvMatrix = new Matrix().set(projectionMatrix).concatenate(viewMatrix);

			matrixBindModel1.bind(display.getDevice(), pvMatrix);

			const encoder: GPUCommandEncoder = display.createCommandEncoder();
			const view: GPUTextureView = display.createView();

			depthStencil.setDepthLoadOp("clear");
			render.render(encoder, view, [
				matrixBindModel1.getBindGroup(),
				texture.getBindGroup()
			], depthStencil);

			// Render the voxel manager
			modelMatrix.setRotation(new Vector(0, 0, 0), 0);
			modelMatrix.translate(new Vector(0, 0, 0));

			viewMatrix.set(cameraMatrix);

			pvMatrix = new Matrix().set(projectionMatrix).concatenate(viewMatrix);

			const frustum = new Frustum(pvMatrix);

			//depthStencil.setDepthLoadOp("load");


			const voxelSpaceRenderInput = {
				matrix: pvMatrix,
				encoder,
				view,
				depthStencil,
				frustum
			};
			voxelSpace.render(voxelSpaceRenderInput);
			//voxelManager.render(pvMatrix, encoder, view, depthStencil, frustum);

			display.submitCommandEncoder(encoder);



			//	const ray = new Ray(new Vector(0, 0, 0), new Vector(1, 1, 1));
			//	const voxel = new Voxel(new Vector(1, 1, 1));

			//	const intersection = voxel.intersectsRay(ray);

			//	if (intersection !== null) {
			//		console.log(`Ray intersects voxel at distance: ${intersection}`);
			//	} else {
			//		console.log("Ray does not intersect voxel");
			//	}
		};

		loopModel = new LoopModel(display, appLoop, renderLoop);
	} catch (error) {
		console.error(error);
		alert(error);
	}
})();
