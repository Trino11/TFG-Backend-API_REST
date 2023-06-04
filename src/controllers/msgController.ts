import { Request, Response } from 'express';
import { getClient } from '../database/database.'
const uuid = require('uuid');
import { MongoClient, ObjectId } from 'mongodb';
import { CompleteUserModel } from '../models/completeUser'
import axios from 'axios'
import { randomInt } from 'crypto';

class CommentController {

    public async showAllOwn(req: Request, res: Response) {
        //@ts-ignore
        const uid = req.uid
        const client: MongoClient = getClient()
        try {
            const database = client.db('database');
            const users = database.collection('user');
            const msgs = database.collection('msg');
            const chats = database.collection('chat');

            const usersResult = await users.findOne({ uid: uid }, { projection: { _id: 1 } });

            const chatsResult = await chats.find({ persons: usersResult?._id }).toArray();

            for (const chat of chatsResult) {
                const msgsResult = await msgs.find({ parent: chat._id }).toArray();
                chat.msgs = msgsResult

                for (const person of chat.persons) {
                    if (person.toString() != usersResult?._id) { chat.persons = await users.findOne({ _id: person }); break; };
                }
                if(chat.persons.uid == undefined)
                chat.persons = await users.findOne({ _id: usersResult?._id })
            }


            res.status(200).json({ msg: "Done", result: chatsResult })
        } catch (e) {
            console.error(e)
            res.status(500).json({ msg: "Error while trying to access to database." })
        } finally {
            client.close()
        }

    }
}
const commentController = new CommentController();
export default commentController;