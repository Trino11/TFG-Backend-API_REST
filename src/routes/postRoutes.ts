import { Router } from 'express';
import postController from '../controllers/postController'
import auth from '../middlewares/t-auth';

class PostRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }
    
    config() {
        this.router.get("/all", postController.showAll);
        this.router.get("/path", postController.showPath);
        this.router.get("/path/:path", postController.showPath);
        this.router.get("/single/:pid", postController.showPost);
        this.router.get("/user/:uid", postController.showPostsFromUser);
        this.router.post("/single", auth, postController.createSingle);
        this.router.put("/single/:pid", auth, postController.updateSingle);
        this.router.delete("/single/:pid", auth, postController.deleteSingle);
        this.router.post("/single/:post/comment", auth, postController.createComment);
        this.router.post("/folder", postController.createFolder);
    }
}
const postRoutes = new PostRoutes();
export default postRoutes.router;