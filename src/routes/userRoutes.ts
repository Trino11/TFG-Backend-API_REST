import { Router } from 'express';
import userController from '../controllers/userController'
import auth from '../middlewares/t-auth';

class UserRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }
    
    config() {
        this.router.get("/own", auth, userController.showOwn);
        this.router.get("/own/admin", auth, userController.isAdminOwn);
        this.router.post("/register", auth, userController.registerOwn);
        this.router.get("/all", userController.showAll);
        this.router.get("/single/alias/:alias", userController.showSingleByAlias);
        this.router.get("/single/uid/:uid", userController.showSingleByUid);
        this.router.delete("/single/:uid", userController.deleteSingle);
        this.router.put("/single/:uid", userController.updateSingle);
        this.router.post("/single", userController.createSingle);
    }
}
const userRoutes = new UserRoutes();
export default userRoutes.router;