import { Router } from 'express';
import postController from '../controllers/postController'
import auth from '../middlewares/t-auth';

class PostRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }
    
    config() { //Post routes
        this.router.get("/all", postController.showAll); //Get all posts
        this.router.get("/path", postController.showPath); //Get all posts from path
        this.router.get("/path/:path", postController.showPath); //Get all posts from path with route
        this.router.get("/single/:pid", postController.showPost); //Get post info from pid
        this.router.get("/user/:uid", postController.showPostsFromUser); //Get user posts from uid
        this.router.post("/single", auth, postController.createSingle); //Create post to a user from token
        this.router.put("/single/:pid", auth, postController.updateSingle); //Update post from pid
        this.router.delete("/single/:pid", auth, postController.deleteSingle); //Delete post from pid
        this.router.post("/single/:post/comment", auth, postController.createComment); //Create comment on post from postid and token
        this.router.post("/folder", postController.createFolder); //Create folder
    }
}
const postRoutes = new PostRoutes();
export default postRoutes.router;