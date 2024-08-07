import "./app.scss";
import { Canvas } from "../modules/canvas/canvas.js";
import { Display } from "../modules/display/display.js";
import { LoopModel } from "../modules/loop/loop.js";
import { degreeToRadian } from "../modules/maths/index.js";
import { Matrix } from "../modules/matrix/matrix.js";
import { Render } from "../modules/render/render.js";
import { Texture } from "../modules/texture/texture.js";
import { DepthStencil } from "../modules/depthstencil/depthstencil.js";
import { MatrixBindModel } from "../modules/matrix/matrixBind.js";
import { Vector } from "../modules/vector/vector.js";
import { Camera } from "../modules/camera/camera.js";
import { Mesh } from "../modules/mesh/mesh.js";
import { Input } from "../modules/input/input.js";

(async (): Promise<void> => {
	try {
		const canvas: Canvas = new Canvas();
		const display: Display = new Display(canvas);
		await display.initialize();

		const projectionMatrix: Matrix = new Matrix();

		const texture: Texture = new Texture();
		await texture.loadTexture("/textures/wood_planks.jpg", display.getDevice());

		const texture2: Texture = new Texture();
		await texture2.loadTexture("/textures/tiles.jpg", display.getDevice());

		const matrixBindModel1: MatrixBindModel = new MatrixBindModel(display.getDevice());
		const matrixBindModel2: MatrixBindModel = new MatrixBindModel(display.getDevice());

		const mesh = new Mesh();
		await mesh.loadFromUrl("/meshes/cube.json");

		const render = new Render(display, "clear");
		await render.initialize([
			matrixBindModel1.getBindGroupLayout(),
			texture.getBindGroupLayout()
		], mesh);


		await mesh.loadFromUrl("/meshes/cube.json");

		const renderModel2 = new Render(display, "load");
		await renderModel2.initialize([
			matrixBindModel2.getBindGroupLayout(),
			texture2.getBindGroupLayout()
		], mesh);

		const modelMatrix: Matrix = new Matrix();
		const viewMatrix: Matrix = new Matrix();

		const depthStencil: DepthStencil = new DepthStencil(
			display.getDevice(),
			canvas,
			"clear"
		);

		const camera = new Camera();
		camera.identity();

		const input = new Input((x: number, y: number): void => {
			camera.yaw(-x / 100);
			camera.pitch(-y / 100);
		});

		let rotationX: number = 0;
		let rotationY: number = 0;

		const appLoop = async (): Promise<void> => {
			rotationX += 0.005;
			rotationY += 0.01;
		};

		const renderLoop = async (): Promise<void> => {
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

			if (input.isKeyDown("w")) {
				camera.walk(0.05);
			}

			if (input.isKeyDown("s")) {
				camera.walk(-0.05);
			}

			if (input.isKeyDown("a")) {
				camera.strafe(0.05);
			}

			if (input.isKeyDown("d")) {
				camera.strafe(-0.05);
			}

			camera.setUpright();
			const cameraMatrix = camera.getViewMatrix();

			modelMatrix.setRotation(new Vector(0, 1, 0), rotationY);
			modelMatrix.concatenate(new Matrix().setRotation(new Vector(1, 0, 0), rotationX));
			modelMatrix.translate(new Vector(0, 0, 0));

			viewMatrix.set(cameraMatrix);
			viewMatrix.concatenate(modelMatrix);

			projectionMatrix.setPerspective(degreeToRadian(60), canvas.getAspectRatio(), 0.1, 1000);
			projectionMatrix.concatenate(viewMatrix);

			matrixBindModel1.bind(display.getDevice(), projectionMatrix);

			const encoder: GPUCommandEncoder = display.createCommandEncoder();
			const view: GPUTextureView = display.createView();

			depthStencil.setDepthLoadOp("clear");
			render.render(encoder, view, [
				matrixBindModel1.getBindGroup(),
				texture.getBindGroup()
			], depthStencil);

			modelMatrix.setRotation(new Vector(0, 0, 0), 0);
			modelMatrix.translate(new Vector(1, 0, -5));

			viewMatrix.set(cameraMatrix);
			viewMatrix.concatenate(modelMatrix);

			projectionMatrix.setPerspective(degreeToRadian(60), canvas.getAspectRatio(), 0.1, 1000);
			projectionMatrix.concatenate(viewMatrix);

			matrixBindModel2.bind(display.getDevice(), projectionMatrix);
			depthStencil.setDepthLoadOp("load");
			renderModel2.render(encoder, view, [
				matrixBindModel2.getBindGroup(),
				texture2.getBindGroup()
			], depthStencil);

			display.submitCommandEncoder(encoder);
		};

		new LoopModel(display, appLoop, renderLoop);
	} catch (error) {
		console.error(error);
		alert(error);
	}
})();
