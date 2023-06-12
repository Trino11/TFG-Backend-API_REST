
import express, { Application, request, response, Router } from 'express';
import session from 'express-session';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import infoRoutes from './routes/infoRoutes';
import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';
import msgRoutes from './routes/msgRoutes';
import commentRoutes from './routes/commentRoutes';

import configureIO from './webSocket';
import { init as dbinit } from './database/database.'

require('dotenv').config()

class Server {

    private app: Application;
    private isHttp: boolean = false;

    private server: any;
    private io: any;

    constructor() {
        this.app = express();
        this.server = require('http').Server(this.app)
        this.io = require("socket.io")(this.server, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST', 'DELETE', 'PUT'],
                allowedHeaders: ['Authorization', 'Content-Type'],
                credentials: true
            }
        })
        this.config();
        configureIO(this.io)
        this.routes();

    }

    config() { //Express configuration
        this.app.set("port", process.env.PORT || 3000);

        console.log("Using database on " + process.env.DBHOST + ":" + process.env.DBPORT + " with user " + process.env.DBUSER)

        const swaggerDocument = YAML.load('./swagger.yaml');

        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(session({
            secret: String(process.env.KEYSSN),
            resave: false,
            saveUninitialized: true
        }))

        dbinit()

    }

    routes() { //Express routes configuration
        let router: Router = Router()

        router.use("/info", infoRoutes);
        router.use("/user", userRoutes);
        router.use("/post", postRoutes);
        router.use("/comment", commentRoutes);
        router.use("/msg", msgRoutes);

        this.app.use("/v1", router); //Mount all routes on /v1

    }

    start() {
        //this.app.listen(this.app.get("port"), () => console.log("Server started using http. Listening on port ", this.app.get("port"))); //express server
        this.server.listen(this.app.get("port"), () => console.log("Server started using http. Listening on port ", this.app.get("port"))); //http server
    }
}
let fullserver = new Server();
fullserver.start();


