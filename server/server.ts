import bodyParser from "body-parser";
import express, { Router } from "express";
import expressSession from "express-session";
import helmet from "helmet";
import http from "http";
import Mongoose from "mongoose";
import { environment } from "../common/environment";
import { handleError } from "./error.handler";

export class Server {
    public server!: http.Server;
    private application!: express.Application;

    public async bootstrap(routers: Router[] = []): Promise<Server> {
        return this.initializeDb().then(() =>
            this.initRoutes(routers).then(() => this)
        );
    }

    public shutdown() {
        return Mongoose.disconnect().then(() => this.server.close());
    }

    private initializeDb(): Promise<typeof Mongoose> {
        (Mongoose as any).Promise = global.Promise;
        return Mongoose.connect(
            environment.db.url,
            {
                useNewUrlParser: true
            }
        );
    }

    private initRoutes(routers: Router[]): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                this.application = express();
                this.server = new http.Server(this.application);
                this.application.use(helmet());
                const sessionStore = new expressSession.MemoryStore();
                this.application.use(expressSession({
                    secret: environment.security.sessionSecret as string,
                    resave: true,
                    saveUninitialized: true,
                    store: sessionStore
                }));
                this.application.use(bodyParser.json());
                this.application.use(bodyParser.urlencoded({ extended: true }));
                this.application.use(handleError);

                // Not Found Middleware
                this.application.use((req, res, next) => {
                    res.status(404)
                      .type("text")
                      .send("Not Found");
                  });
                this.server.listen(environment.server.port, () => {
                    resolve(this.server);
                });
            } catch (err) {
                reject(err);
            }
        });
    }
}
