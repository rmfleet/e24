import { Server } from "./modules/server/Server.js";
import dotenv from "dotenv";

const getPort = (): number => {
	const port: string | undefined = process.env.PORT;

	if (!port) {
		return 6502;
	}

	const parsedPort: number = parseInt(port, 10);

	if (isNaN(parsedPort)) {
		return 6502;
	}

	return parsedPort;
};

export const main = async (): Promise<void> => {
	dotenv.config();
	const server: Server = new Server(getPort());
	await server.listen();
	console.info(`Server listening on port ${server.port}`);
};
