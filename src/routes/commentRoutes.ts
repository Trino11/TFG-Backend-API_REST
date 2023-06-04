import { Router } from 'express';
import commentController from '../controllers/commentController'
import auth from '../middlewares/t-auth';

class CommentRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }
    
    config() {
    }
}
const commentRoutes = new CommentRoutes();
export default commentRoutes.router;