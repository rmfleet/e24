# E24 - WebGPU Experiment 3D Rendering Engine

E24 is an experimental rendering engine written in TypeScript, utilizing the WebGPU API.

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
