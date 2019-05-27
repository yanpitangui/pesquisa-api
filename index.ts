import { Server } from "./server/server";
const server = new Server();
server.bootstrap([]).then((serverReturned) => {
    console.log(`Server is listening on ${(serverReturned.server.address() as any).port}`);
}).catch((error) => {
    console.log("Server failed to start.");
    console.error(error);
    process.exit(1);
});
