import { Router } from 'express';
import userController from '../controllers/userController'
import auth from '../middlewares/t-auth';

class UserRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }
    
    config() {//User routes
        this.router.get("/own", auth, userController.showOwn); //Returns own user info from token
        this.router.get("/own/admin", auth, userController.isAdminOwn); //Returns if the user is admin
        this.router.post("/register", auth, userController.registerOwn); //Register an user from login token
        this.router.get("/all", userController.showAll); //Get all users info
        this.router.get("/single/alias/:alias", userController.showSingleByAlias); //Get user info from alias_tag
        this.router.get("/single/uid/:uid", userController.showSingleByUid); //Get user info from uid
        this.router.delete("/single/:uid", userController.deleteSingle); //Delete user info from uid
        this.router.put("/single/:uid", userController.updateSingle); //Update user info from uid
        this.router.post("/single", userController.createSingle); //Create a user
    }
}
const userRoutes = new UserRoutes();
export default userRoutes.router;