import { Request, Response } from 'express';
import { getClient } from '../database/database.'
import { v4 as uuidv4 } from 'uuid';
import { MongoClient, ObjectId } from 'mongodb';
import axios from 'axios'
import { randomInt } from 'crypto';
import { PostDocument } from '../models/postDocument';
import { PostsFolder } from '../models/postsFolder';
import { CommentDocument } from '../models/commentDocument';

class PostController {

    public async showAll(req: Request, res: Response) {

        const client: MongoClient = getClient()
        try {
            const database = client.db('database');
            const post = database.collection('post');
            const postsResult = await post.find({}).toArray();
            res.status(200).json({ msg: "Done", result: postsResult })
        } catch (e) {
            console.error(e)
            res.status(500).json({ msg: "Error while trying to access to database." })
        } finally {
            client.close()
        }
    }

    public async showPath(req: Request, res: Response) {
        let folderPath: string = ""
        if (req.params.path)
            folderPath = req.params.path.replace(/_/g, "/").replace(/%20/g, "\\_").replace(/ /g, "\\_")
        const client: MongoClient = getClient()
        try {
            const database = client.db('database');
            const folder = database.collection('folder');
            const post = database.collection('post');

            if (folderPath != "") {
                const folderResult = await folder.findOne({ name: folderPath });

                const childrenFoldersResult = await folder.find({ parent: folderResult?._id }).toArray();
                const childrenPostsResult = await post.find({ parent: folderResult?._id }).toArray();
                for (const folder of childrenFoldersResult) {
                    folder.name = folder.name.replace(/\\_/g, " ")
                }
                for (const post of childrenPostsResult) {
                    post.title = post.title.replace(/\\_/g, " ")
                }
                res.status(200).json({ msg: "Done", result: { current: folderResult, folders: childrenFoldersResult, posts: childrenPostsResult } })
            } else {
                const childrenFoldersResult = await folder.find({ parent: null }).toArray();
                const childrenPostsResult = await post.find({ parent: null }).toArray();
                for (const folder of childrenFoldersResult) {
                    folder.name = folder.name.replace(/\\_/g, " ")
                }
                for (const post of childrenPostsResult) {
                    post.title = post.title.replace(/\\_/g, " ")
                }
                res.status(200).json({ msg: "Done", result: { folders: childrenFoldersResult, posts: childrenPostsResult } })
            }

        } catch (e) {
            console.error(e)
            res.status(500).json({ msg: "Error while trying to access to database." })
        } finally {
            client.close()
        }
    }

    public async showPost(req: Request, res: Response) {
        let pid: string = req.params.pid.replace(/_/g, "\\_").replace(/%20/g, "\\_").replace(/ /g, "\\_")

        const client: MongoClient = getClient()
        try {
            const database = client.db('database');
            const post = database.collection('post');
            const user = database.collection('user');
            const comments = database.collection('comment');

            const childrenPostsResult = await post.findOne({ title: pid });

            if (childrenPostsResult?._id) {
                const authorPostsResult = await user.findOne({ _id: childrenPostsResult.author });
                const commentsPostsResult = await comments.find({ parent: childrenPostsResult._id }).toArray();
                childrenPostsResult.author = authorPostsResult
                childrenPostsResult.comments = commentsPostsResult

                for (const comment of childrenPostsResult.comments) {
                    const authorCommentResult = await user.findOne({ _id: comment.author });
                    comment.author = authorCommentResult
                }

                childrenPostsResult.title = childrenPostsResult.title.replace(/\\_/g, " ")
                res.status(200).json({ msg: "Done", result: childrenPostsResult })
            }
            else
                res.status(200).json({ msg: "Error, the post does not exists or there was an error while trying to find it." })


        } catch (e) {
            console.error(e)
            res.status(500).json({ msg: "Error while trying to access to database." })
        } finally {
            client.close()
        }
    }

    public async showPostsFromUser(req: Request, res: Response) {
        const uid: string = req.params.uid

        const client: MongoClient = getClient()
        try {
            const database = client.db('database');
            const post = database.collection('post');
            const user = database.collection('user');

            const userResult = await user.findOne({ uid: uid });
            const childrenPostsResult = await post.find({ author: userResult?._id }).toArray();

            for (const post of childrenPostsResult) {
                post.title = post.title.replace(/\\_/g, " ")
            }

            if (childrenPostsResult.length > 0) {
                res.status(200).json({ msg: "Done", result: childrenPostsResult })
            }
            else
                res.status(200).json({ msg: "Error, the post does not exists or there was an error while trying to find it." })


        } catch (e) {
            console.error(e)
            res.status(500).json({ msg: "Error while trying to access to database." })
        } finally {
            client.close()
        }
    }

    public async createSingle(req: Request, res: Response) {
        //@ts-ignore
        const uid = req.uid
        const folderPath: string = req.body.folder
        const client: MongoClient = getClient()
        try {
            const database = client.db('database');
            const folder = database.collection('folder');
            const post = database.collection('post');

            const user = database.collection('user');
            const userFound = await user.findOne({ uid: uid })

            var postToAdd: PostDocument = {
                pid: uuidv4(),
                title: req.body.title.replace(/ /g, "\\_"),
                body: req.body.body,
                plain_body: req.body.plain_body,
                public_date: new Date(),
                edit_date: undefined,
                tags: req.body.tags,
                edited: false,
                author: userFound?._id
            }

            if (folderPath && folderPath.length > 0) {
                const foldersResult = await folder.findOne({ name: folderPath });
                if (foldersResult)
                    postToAdd.parent = foldersResult._id
            }

            const postResult = await post.insertOne(postToAdd);

            if (postToAdd.parent) {
                const updateResult = await folder.updateOne(
                    { _id: postToAdd.parent },
                    { $push: { posts: postResult.insertedId } }
                );
            }

            if (postResult.insertedId)
                res.status(201).json({ msg: "Post created successfully." })
        } catch (e) {
            console.error(e)
            res.status(500).json({ msg: "Error while trying to access to database." })
        } finally {
            client.close()
        }
    }

    public async updateSingle(req: Request, res: Response) {
        //@ts-ignore
        const uid = req.uid
        const client: MongoClient = getClient()
        try {
            const database = client.db('database');
            const post = database.collection('post');

            var postToUpdate: PostDocument = {
                title: req.body.title.replace(/ /g, "\\_"),
                body: req.body.body,
                plain_body: req.body.plain_body,
                edit_date: new Date(),
                edited: true,
            }
            let updateResult
            updateResult = await post.updateOne(
                { pid: req.params.pid },
                { $set: postToUpdate });

            res.status(201).json({ msg: "Post updated successfully." })
        } catch (e) {
            console.error(e)
            res.status(500).json({ msg: "Error while trying to access to database." })
        } finally {
            client.close()
        }
    }

    public async deleteSingle(req: Request, res: Response) {
        //@ts-ignore
        const uid = req.uid
        const client: MongoClient = getClient()
        try {
            const database = client.db('database');
            const post = database.collection('post');
            const comment = database.collection('comment');

            const postResult = await post.findOne({ pid: req.params.pid })
            const commentResult = await comment.deleteMany({ parent: postResult?._id })

            const deleteResult = await post.deleteOne({ pid: req.params.pid });



            res.status(201).json({ msg: "Post deleted successfully." })
        } catch (e) {
            console.error(e)
            res.status(500).json({ msg: "Error while trying to access to database." })
        } finally {
            client.close()
        }
    }

    public async createComment(req: Request, res: Response) {
        //@ts-ignore
        const uid = req.uid
        const postFather: string = req.params.post.replace(/_/g, "\\_").replace(/%20/g, "\\_").replace(/ /g, "\\_")
        const client: MongoClient = getClient()
        try {
            const database = client.db('database');
            const comment = database.collection('comment');

            const user = database.collection('user');
            const userFound = await user.findOne({ uid: uid })

            const post = database.collection('post');
            const postFound = await post.findOne({ title: postFather })

            var commentToAdd: CommentDocument = {
                cid: uuidv4(),
                body: req.body.body,
                plain_body: req.body.plain_body,
                public_date: new Date(),
                edit_date: undefined,
                edited: false,
                author: userFound?._id,
                parent: postFound?._id
            }

            const commentResult = await comment.insertOne(commentToAdd);

            if (commentResult.insertedId)
                res.status(201).json({ msg: "Comment created successfully." })
            else
                res.status(500).json({ msg: "Error creating the comment." })

        } catch (e) {
            console.error(e)
            res.status(500).json({ msg: "Error while trying to access to database." })
        } finally {
            client.close()
        }
    }

    public async createFolder(req: Request, res: Response) {
        const folderPath: string = req.body.folder
        const client: MongoClient = getClient()
        try {
            const database = client.db('database');
            const folder = database.collection('folder');
            var nameF
            (folderPath) ? nameF = `${folderPath}/${req.body.name}` : nameF = req.body.name
            var folderToAdd: PostsFolder = {
                fid: uuidv4(),
                name: nameF
            }

            if (req.body.info)
                folderToAdd.info = req.body.info

            if (folderPath && folderPath.length > 0) {
                const foldersResult = await folder.findOne({ name: folderPath });
                if (foldersResult)
                    folderToAdd.parent = foldersResult._id
            }

            const folderInserted = await folder.insertOne(folderToAdd);

            if (folderToAdd.parent) {
                const updateResult = await folder.updateOne(
                    { _id: folderToAdd.parent },
                    { $push: { folders: folderInserted.insertedId } }
                );
            }

            if (folderInserted.insertedId)
                res.status(201).json({ msg: "Folder created successfully." })


        } catch (e) {
            console.error(e)
            res.status(500).json({ msg: "Error while trying to access to database." })
        } finally {
            client.close()
        }
    }

}
const postController = new PostController();
export default postController;