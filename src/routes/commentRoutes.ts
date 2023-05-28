import { Router } from 'express';
import commentController from '../controllers/commentController'
import auth from '../middlewares/t-auth';

class CommentRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }
    
    config() {
        this.router.get("/own", auth, commentController.showOwn);
        this.router.post("/register", auth, commentController.registerOwn);
        this.router.get("/all", commentController.showAll);
        this.router.get("/single/:alias", commentController.showSingle);
        this.router.delete("/single/:uid", commentController.deleteSingle);
        this.router.put("/single/:uid", commentController.updateSingle);
        this.router.post("/single", commentController.createSingle);
    }
}
const commentRoutes = new CommentRoutes();
export default commentRoutes.router;