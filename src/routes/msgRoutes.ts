import { Router } from 'express';
import msgController from '../controllers/msgController'
import auth from '../middlewares/t-auth';

class MsgRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }
    
    config() { //Message routes
        this.router.get("/ownAll", auth, msgController.showAllOwn); //Get all own chats and messages
    }
}
const msgRoutes = new MsgRoutes();
export default msgRoutes.router;