import { Request, Response } from 'express';
import { getClient } from '../database/database.'
const uuid = require('uuid');
import { MongoClient } from 'mongodb';
import { CompleteUserModel } from '../models/completeUser'
import axios from 'axios'
import { randomInt } from 'crypto';

class CommentController {

    public async showInfo(req: Request, res: Response) {
        res.status(500).json({ msg: "Not implemented yet" })
    }

    public async showOwn(req: Request, res: Response) {
        res.status(500).json({ msg: "Not implemented yet" })

    }

    public async registerOwn(req: Request, res: Response) {
        res.status(500).json({ msg: "Not implemented yet" })

    }

    public async showAll(req: Request, res: Response) {
        res.status(500).json({ msg: "Not implemented yet" })


    }
    public async showSingle(req: Request, res: Response) {
        res.status(500).json({ msg: "Not implemented yet" })

    }
    public async deleteSingle(req: Request, res: Response) {
        res.status(500).json({ msg: "Not implemented yet" })

    }
    public async updateSingle(req: Request, res: Response) {
        res.status(500).json({ msg: "Not implemented yet" })


    }
    public async createSingle(req: Request, res: Response) {
        res.status(500).json({ msg: "Not implemented yet" })

    }

}
const commentController = new CommentController();
export default commentController;