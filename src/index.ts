
import express, { Application, request, response, Router } from 'express';
import cors from 'cors';
import session from 'express-session';
import {init} from './database/database.'

import infoRoutes from './routes/infoRoutes';
import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';
import auth from './middlewares/t-auth';

require('dotenv').config()

class Server {

    private app: Application;
    private isHttp: boolean = false;

    // private optionsProxy = {
    //     target: hass,
    //     ws: true
    // }

    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    config() { //Express configuration
        this.app.set("port", process.env.PORT || 3000);

        console.log("Using database on " + process.env.DBHOST + ":" + process.env.DBPORT + " with user " + process.env.DBUSER)

        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(session({
            secret: String(process.env.KEYSSN),
            resave: false,
            saveUninitialized: true
        }))

        init()
    }

    async routes() { //Express routes configuration
        let router: Router = Router()

        router.use("/info", auth, infoRoutes);
        router.use("/user", userRoutes);
        router.use("/post", postRoutes);
        router.use("/comment", commentRoutes);

        this.app.use("/v1", router);

    }


    start() {
        this.app.listen(this.app.get("port"), () => console.log("Server started using http. Listening on port ", this.app.get("port"))); //http server
    }
}
let server = new Server();
server.start();