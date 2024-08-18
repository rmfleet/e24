import { main } from "./main.js";

(async (): Promise<void> => {
	try {
		await main();
	} catch (error: unknown) {
		console.error(error);
	}
})();
