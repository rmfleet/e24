import express, {
	type Express,
	type Request,
	type Response
} from "express";
import path from "path";

export class Server {
	expressServer: Express;

	constructor(public port: number) {
		this.expressServer = express();
		this.expressServer.use(express.static(path.resolve(process.cwd(), "dist", "public")));

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
