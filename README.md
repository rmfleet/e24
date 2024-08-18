# E24 - WebGPU Experiment 3D Rendering Engine

E24 is an experimental voxel rendering engine written in TypeScript, utilizing the WebGPU API.

## Current WebGPU Support

https://caniuse.com/webgpu

## Setup

1. Install Node 20.10.0 or compatible. If using Node Version Manager (nvm) run `nvm use` to use the version defined in `.nvmrc`.
2. Install NPM package manager.
3. From the root of the project directory run `npm install` to install all the dependencies.
4. Run `npm run build` to create the application distributable.
5. Run `npm start` to run the application server.

The server will start by default on port `6502`. To configure the application to run under a different port, copy the `.env.sample` file and create a `.env` file. Change the `PORT=6502` to a different value.

For automatic reload when modifying source files, run `npm run watch` instead of `npm start` which will rebuild the distributable on each file save and start the server.

## Running Tests
This project uses Vitest for testing. The testing configuration is defined in <b>vitest.config.js</b>.

The following npm scripts are available:

### Run all tests:

`npm run test`

Runs all test files in the project using the configuration specified in vitest.config.js.

### Run tests with UI and coverage:

`npm run test:ui`

Opens the Vitest UI for an interactive testing experience, while also generating a coverage report in HTML format.

### Generate coverage report:

`npm run test:coverage`

Runs all tests and generates a detailed code coverage report.

## Controls

Use `w a s d` to move forward/back and strafe left/right
Use `Arrow Left` and `Arrow Right` to yaw left/right
Use `Arrow Up` and `Arrow Down` to pitch up/down

Optionally click the mouse or trackpad to capture the pointing device to yaw/pitch. Press `Escape` to release the pointer device.

## Features
- WebGPU rendering
- Indirect indexed rendering
- Voxel occlusion culling
- AABB volume frustum culling
- Instance voxel rendering
- Backface removal
- Unit tests for models


## Future
- Level of detail
- Texture mip mapping
