import { Request, Response } from 'express';
import { getClient } from '../database/database.'
import { MongoClient } from 'mongodb';
import { CompleteUserModel } from '../models/completeUser'
import axios from 'axios'
import { randomInt } from 'crypto';

class UserController {

    public static trimUser(user: CompleteUserModel): CompleteUserModel {
        let trimmed: CompleteUserModel = {}
        Object.keys(user).forEach((key) => {
            if (user[key] !== undefined) {
                trimmed[key] = user[key];
            }
        });
        return trimmed
    }

    public static async isAliasTagUsed(alias: string, tag: number): Promise<boolean> {
        const client: MongoClient = getClient()
        var result = true
        try {
            const database = client.db('database');
            const users = database.collection('user');
            const usersResult = await users.findOne({ alias: alias, tag: tag });
            if (usersResult)
                result = true
            else
                result = false
        } catch (e) {
            console.error(e)
        } finally {
            client.close()
        }
        return result
    }

    public async showInfo(req: Request, res: Response) {
        res.status(500).json({ msg: "Not implemented yet" })
    }

    public async showOwn(req: Request, res: Response) {
        //@ts-ignore
        const uid = req.uid

        const client: MongoClient = getClient()
        try {
            const database = client.db('database');
            const users = database.collection('user');
            const usersResult = await users.findOne({ uid: uid });
            if (usersResult)
                res.status(200).json({ msg: "Done", result: usersResult })
            else
                throw new Error('usersResult.length != 1.')
        } catch (e) {
            console.error(e)
            res.status(500).json({ msg: "Error while trying to access to database." })
        } finally {
            client.close()
        }

    }

    public async isAdminOwn(req: Request, res: Response) {
        //@ts-ignore
        const uid = req.uid

        const client: MongoClient = getClient()
        try {
            const database = client.db('database');
            const users = database.collection('user');
            const usersResult = await users.findOne({ uid: uid });
            if (usersResult?.admin)
                res.status(200).json({ msg: "Done", result: usersResult.admin })
            else
                res.status(403).json({ msg: "Not an admin", result: false })
        } catch (e) {
            console.error(e)
            res.status(500).json({ msg: "Error while trying to access to database." })
        } finally {
            client.close()
        }
    }

    public async registerOwn(req: Request, res: Response) {
        //@ts-ignore
        const uid = req.uid
        //@ts-ignore
        const token = req.token

        const client: MongoClient = getClient()
        try {
            const database = client.db('database');
            const users = database.collection('user');
            var userToAdd: CompleteUserModel = {
                uid: uid,
                name: req.body.name,
                tag: req.body.tag,
                lastname: req.body.lastname,
                alias: req.body.alias,
                ppic: req.body.ppic,
                newsletter: req.body.newsletter,
                phone: req.body.phone,
                birthday: req.body.birthday
            }

            await axios.get(`${process.env.AUTHSERVER}:${process.env.AUTHPORT}/v1/user`, { data: { token: token } })
                .then(function (response) {
                    if (typeof (response) !== 'string') {
                        userToAdd.alias = response.data.user.username
                    }
                })
                .catch(function (error) {
                })
                .finally(function () {
                    // always executed
                });

            if (userToAdd.alias)
                if (userToAdd.tag == undefined) {
                    userToAdd.tag = randomInt(99999)
                    for (let i = 0; i < 99990; i++)
                        if (await UserController.isAliasTagUsed(userToAdd.alias, userToAdd.tag))
                            userToAdd.tag = randomInt(99999)
                        else
                            break
                }
                else
                    if (typeof (userToAdd.tag = Number(userToAdd.tag)) === 'number' && await UserController.isAliasTagUsed(userToAdd.alias, userToAdd.tag)) {
                        res.status(400).json({ msg: "The alias:tag is already in use, leave it in blank to autocomplete." })
                    }
                    else {
                        console.log(typeof userToAdd.tag)
                        userToAdd = UserController.trimUser(userToAdd)

                        const result = await users.insertOne(userToAdd);
                        console.log(result)
                        if (result.insertedId)
                            res.status(201).json({ msg: "User created" })
                        else
                            throw new Error('result.insertedId == null.')
                    }
            else
                res.status(401).json({ msg: "The token is not valid." })

        } catch (e) {
            console.error(e)
            res.status(500).json({ msg: "Error while trying to access to database." })
        } finally {
            client.close()
        }

    }

    public async showAll(req: Request, res: Response) {

        const client: MongoClient = getClient()
        try {
            const database = client.db('database');
            const users = database.collection('user');
            const usersResult = await users.find({}).project({ _id: 0, uid: 1, alias: 1, tag: 1 }).toArray();
            res.status(200).json({ msg: "Done", result: usersResult })
        } catch (e) {
            console.error(e)
            res.status(500).json({ msg: "Error while trying to access to database." })
        } finally {
            client.close()
        }

    }
    public async showSingleByAlias(req: Request, res: Response) {
        const splited = req.params.alias.split("_")
        const alias = splited[0]
        const tag = parseInt(splited[1])
        const client: MongoClient = getClient()
        try {
            const database = client.db('database');
            const users = database.collection('user');
            const usersResult = await users.findOne({ alias: alias, tag: tag });
            if (usersResult)
                res.status(200).json({ msg: "Done", result: usersResult })
            else
                res.status(404).json({ msg: "Error, user not found", result: [] })
        } catch (e) {
            console.error(e)
            res.status(500).json({ msg: "Error while trying to access to database." })
        } finally {
            client.close()
        }

    }
    public async showSingleByUid(req: Request, res: Response) {

        const client: MongoClient = getClient()
        try {
            const database = client.db('database');
            const users = database.collection('user');
            const usersResult = await users.findOne({ uid: req.params.uid }, { projection: { password: 0 } });
            if (usersResult)
                res.status(200).json({ msg: "Done", result: usersResult })
            else
                res.status(404).json({ msg: "Error, user not found", result: [] })
        } catch (e) {
            console.error(e)
            res.status(500).json({ msg: "Error while trying to access to database." })
        } finally {
            client.close()
        }

    }
    public async deleteSingle(req: Request, res: Response) { //cambiar a uid que ahora pilla alias

        const client: MongoClient = getClient()
        try {
            const database = client.db('database');
            const users = database.collection('user');
            const result = await users.deleteOne({ alias: req.params.uid });

            if (result.deletedCount == 1)
                res.status(200).json({ msg: "User deleted" })
            else if (result.deletedCount == 0)
                res.status(404).json({ msg: "Error, user not found" })
            else
                throw new Error('usersResult.length != 1.')

        } catch (e) {
            console.error(e)
            res.status(500).json({ msg: "Error while trying to access to database." })
        } finally {
            client.close()
        }

    }
    public async updateSingle(req: Request, res: Response) {

        const client: MongoClient = getClient()
        try {
            const database = client.db('database');
            const users = database.collection('user');
            var userToUpate: CompleteUserModel = {
                name: req.body.name,
                lastname: req.body.lastname,
                alias: req.body.alias,
                tag: parseInt(req.body.tag),
                ppic: req.body.ppic,
                newsletter: req.body.newsletter,
                phone: req.body.phone,
                birthday: req.body.birthday
            }

            userToUpate = UserController.trimUser(userToUpate)
            const result = await users.updateOne({ uid: req.params.uid }, { $set: userToUpate });

            if (result.modifiedCount == 1)
                res.status(200).json({ msg: "User modified" })
            else if (result.modifiedCount == 0)
                res.status(404).json({ msg: "Error, user not found" })
            else
                throw new Error('result.modifiedCount != 1.')

        } catch (e) {
            console.error(e)
            res.status(500).json({ msg: "Error while trying to access to database." })
        } finally {
            client.close()
        }

    }
    public async createSingle(req: Request, res: Response) {

        const client: MongoClient = getClient()
        try {
            const database = client.db('database');
            const users = database.collection('user');
            var userToAdd: CompleteUserModel = {
                nombre: req.body.nombre,
                apellidos: req.body.apellidos,
                alias: req.body.alias,
                foto: req.body.foto,
                etiqueta: req.body.etiqueta,
                newsletter: req.body.newsletter,
                telefono: req.body.telefono,
                fecha_nacimiento: req.body.fecha_nacimiento
            }

            userToAdd = UserController.trimUser(userToAdd)

            const result = await users.insertOne(userToAdd);
            console.log(result)
            if (result.insertedId)
                res.status(201).json({ msg: "User created" })
            else
                throw new Error('result.insertedId == null.')

        } catch (e) {
            console.error(e)
            res.status(500).json({ msg: "Error while trying to access to database." })
        } finally {
            client.close()
        }

    }

}
const userController = new UserController();
export default userController;