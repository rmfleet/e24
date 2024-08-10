# E24 - WebGPU Experiment 3D Rendering Engine

E24 is an experimental voxel rendering engine written in TypeScript, utilizing the WebGPU API.


## Setup

1. Install Node 20.10.0 or compatible. If using Node Version Manager (nvm) run `nvm use` to use the version defined in `.nvmrc`.
2. Install NPM package manager.
3. From the root of the project directory run `npm install` to install all the dependencies.
4. Run `npm run build` to create the application distributable.
5. Run `npm start` to run the application server.

The server will start by default on port `6502`. To configure the application to run under a different port, copy the `.env.sample` file and create a `.env` file. Change the `PORT=6502` to a different value.

For automatic reload when modifying source files, run `npm run watch` instead of `npm start` which will rebuild the distributable on each file save and start the server.

## Controls

Use `w a s d` to move forward/back and strafe left/right
Use `Arrow Left` and `Arrow Right` to yaw left/right
Use `Arrow Up` and `Arrow Down` to pitch up/down

Optionally click the mouse or trackpad to capture the pointing device to yaw/pitch. Press `Escape` to release the pointer device.

## Rendering Method

The WebGPU pipeline is designed to render voxel cubes using a textured triangle mesh with indexed drawing. Each voxel undergoes counter-clockwise (ccw) back-face culling for efficient rendering.

Voxel types are organized into separate Render classes, each corresponding to a specific texture. Each Render class is paired with an InstanceManager, which is responsible for maintaining the positions of the voxels to be rendered.

Voxels can be dynamically added to or removed from the InstanceManager. After all voxel additions and removals are performed, the InstanceManager commits these changes to GPU memory, ensuring efficient data transfer and minimal overhead. This is achieved using a staging buffer that allows for efficient and asynchronous updates.

To further optimize the rendering process, each Render class uses an IndirectBufferManager to manage an indirect buffer. This indirect buffer stores draw parameters (such as the number of indices and instances) and allows the GPU to fetch these parameters directly from the buffer during the rendering pass. This approach eliminates the need to pass draw parameters explicitly each frame, reducing CPU-GPU synchronization overhead.

When the instance count changes (due to voxels being added or removed), the InstanceManager triggers an update to the indirect buffer via a callback to the Render class. The IndirectBufferManager then updates the indirect buffer with the new instance count, ensuring that the rendering process remains efficient.

Once the instance data is committed and the indirect buffer is updated, the Render class handles the rendering of these instances. Each Render class manages its own GPU buffers for vertex coordinates, colors, texture coordinates, and indices. During the render pass, these buffers, along with the instance data managed by the InstanceManager, are used to draw the voxel cubes with the correct textures and positions.

The rendering process is thus streamlined by the use of indirect drawing, which leverages the indirect buffer managed by the IndirectBufferManager, ensuring that the pipeline remains efficient even as the number of instances changes dynamically.

## Future
- Create a bounding spacial data structure to perform mass culling of voxels.
- Implement frustum culling of the spacial structures to remove large volumes of voxels.
- Implement occlusion culling of spacial volumes when other volumes completely occlude them.
- Level of detail
- Texture mip mapping
