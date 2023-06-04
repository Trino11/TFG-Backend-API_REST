import { Router } from 'express';
import msgController from '../controllers/msgController'
import auth from '../middlewares/t-auth';

class MsgRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }
    
    config() {
        this.router.get("/ownAll", auth, msgController.showAllOwn);
    }
}
const msgRoutes = new MsgRoutes();
export default msgRoutes.router;