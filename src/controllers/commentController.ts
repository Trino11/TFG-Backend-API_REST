import { Request, Response } from 'express';
import { getClient } from '../database/database.'
const uuid = require('uuid');
import { MongoClient } from 'mongodb';
import { CompleteUserModel } from '../models/completeUser'
import axios from 'axios'
import { randomInt } from 'crypto';

class CommentController {


}
const commentController = new CommentController();
export default commentController;