import { Router } from 'express';
import infoController from '../controllers/infoController'

class InfoRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }
    
    config() { //Info routes
        this.router.get("/", infoController.showInfo); //Returns info about server status
    }
}
const infoRoutes = new InfoRoutes();
export default infoRoutes.router;