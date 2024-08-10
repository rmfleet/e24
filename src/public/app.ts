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
import { Shader } from "../modules/shader/shader.js";

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

		const shader: Shader = new Shader();
		await shader.loadShader("/shaders/shader1.wgsl", display);

		const mesh = new Mesh();
		await mesh.loadFromUrl("/meshes/cube.json");

		const matrixBindModel1: MatrixBindModel = new MatrixBindModel(display.getDevice());
		const render = new Render(display, "clear");
		render.initialize([
			matrixBindModel1.getBindGroupLayout(),
			texture.getBindGroupLayout()
		], mesh, shader);

		const instanceManager1 = render.getInstanceManager();

		instanceManager1.addInstance(new Vector(-1, 0, -5));
		instanceManager1.addInstance(new Vector(1, 0, -5));
		instanceManager1.addInstance(new Vector(0, 1, -5));
		instanceManager1.addInstance(new Vector(0, -1, -5));
		await instanceManager1.commitUpdates();


		await mesh.loadFromUrl("/meshes/cube.json");

		const matrixBindModel2: MatrixBindModel = new MatrixBindModel(display.getDevice());
		const renderModel2 = new Render(display, "load");
		renderModel2.initialize([
			matrixBindModel2.getBindGroupLayout(),
			texture2.getBindGroupLayout()
		], mesh, shader);

		const instanceManager2 = renderModel2.getInstanceManager();
		instanceManager2.addInstance(new Vector(-1, 0, -5));
		instanceManager2.addInstance(new Vector(1, 0, -5));
		instanceManager2.addInstance(new Vector(0, 1, -5));
		instanceManager2.addInstance(new Vector(0, -1, -5));
		await instanceManager2.commitUpdates();


		const matrixBindModel3: MatrixBindModel = new MatrixBindModel(display.getDevice());
		const renderModel3 = new Render(display, "load");
		renderModel3.initialize([
			matrixBindModel3.getBindGroupLayout(),
			texture2.getBindGroupLayout()
		], mesh, shader);

		const instanceManager3 = renderModel3.getInstanceManager();
		for (let x = 0; x < 200; x++) {
			for (let z = 0; z < 200; z++) {
				instanceManager3.addInstance(new Vector(x, 0, z));
			}
		}

		await instanceManager3.commitUpdates();




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
			if (!camera.pitchLimit(-y / 100)) {
				camera.pitch(-y / 100);
			}
		});

		let rotationX: number = 0;
		let rotationY: number = 0;
		let counter = 0;

		const appLoop = async (): Promise<void> => {
			counter += 1;
			if (counter === 100) {
				counter = 0;
			}

			rotationX += 0.005;
			rotationY += 0.01;

			if (counter === 25) {
				instanceManager1.addInstance(new Vector(0, 0, -5));
				instanceManager2.removeInstance(new Vector(0, 0, -5));
				await instanceManager1.commitUpdates();
				await instanceManager2.commitUpdates();
			}

			if (counter === 75) {
				instanceManager2.addInstance(new Vector(0, 0, -5));
				instanceManager1.removeInstance(new Vector(0, 0, -5));
				await instanceManager1.commitUpdates();
				await instanceManager2.commitUpdates();
			}
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

			if (input.isKeyDown("w") || input.isKeyDown("W")) {
				camera.walk(0.05);
			}

			if (input.isKeyDown("s") || input.isKeyDown("S")) {
				camera.walk(-0.05);
			}

			if (input.isKeyDown("a") || input.isKeyDown("A")) {
				camera.strafe(0.05);
			}

			if (input.isKeyDown("d") || input.isKeyDown("D")) {
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

			modelMatrix.setRotation(new Vector(0, 0, 0), 0);
			modelMatrix.translate(new Vector(0, 0, 0));

			viewMatrix.set(cameraMatrix);
			viewMatrix.concatenate(modelMatrix);

			projectionMatrix.setPerspective(degreeToRadian(60), canvas.getAspectRatio(), 0.1, 1000);
			projectionMatrix.concatenate(viewMatrix);

			matrixBindModel3.bind(display.getDevice(), projectionMatrix);
			depthStencil.setDepthLoadOp("load");
			renderModel3.render(encoder, view, [
				matrixBindModel3.getBindGroup(),
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
