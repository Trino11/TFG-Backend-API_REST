
import axios from 'axios';
import { MongoClient } from 'mongodb';
import { Socket } from 'socket.io';
import { getClient } from './database/database.';

const clients: {
    socket: Socket,
    uid: string
}[] = []

function configureIO(io: any) {
    io.on('connection', (socket: Socket) => {
        console.log('Cliente conectado');

        const { token } = socket.handshake.query;

        axios.get(`${process.env.AUTHSERVER}:${process.env.AUTHPORT}/v1/verify`, { data: { token: token } })
            .then(function (response) {
                if (typeof (response) !== 'string') {
                    console.log("Cliente verificado",)
                    clients.push({ socket: socket, uid: response.data.uid })
                }
            })
            .catch(function (error) {
                console.log("Cliente no verificado")
                socket.disconnect();
                return;
            })
            .finally(function () {
            });

        socket.on('message', async (data: any) => {
            try {
                const dataP = JSON.parse(data)
                console.log('Mensaje recibido:', dataP);

                const client: MongoClient = getClient()
                try {
                    const database = client.db('database');
                    const users = database.collection('user');
                    const msgs = database.collection('msg');
                    const chats = database.collection('chat');


                    const usersAuthorResult = await users.findOne({ uid: dataP.author }, { projection: { _id: 1 } });
                    const usersToResult = await users.findOne({ uid: dataP.to }, { projection: { _id: 1 } });

                    const chatsResult = await chats.findOne({
                        persons: {
                            $all: [usersToResult?._id, usersAuthorResult?._id]
                        }
                    })
                    if (!chatsResult?._id) {
                        const chatInsert = await chats.insertOne({ persons: [usersToResult?._id, usersAuthorResult?._id] })
                        await msgs.insertOne({ parent: chatInsert.insertedId, msg: dataP.msg, time: new Date() });
                    }
                    else {
                        await msgs.insertOne({ parent: chatsResult._id, msg: dataP.msg, time: new Date(), author: usersAuthorResult?._id });
                    }
                } catch (e) {
                    console.error(e)
                } finally {
                    client.close()
                }

                clients.forEach(client => {
                    if (client.uid == dataP.to) client.socket.emit('message', JSON.stringify({ from: dataP.author, msg: dataP.msg }))
                })
            } catch (e) {
                console.log('ERROR: ', e);
            }
        });

        socket.on('newchat', async (data: any) => {
            try {
                const dataP = JSON.parse(data)
                console.log('Creando chat:', dataP);

                const client: MongoClient = getClient()
                try {
                    const database = client.db('database');
                    const users = database.collection('user');
                    const chats = database.collection('chat');

                    const usersAuthorResult = await users.findOne({ uid: dataP.author });
                    const usersToResult = await users.findOne({ uid: dataP.to }, { projection: { _id: 1 } });

                    const chatsResult = await chats.findOne({
                        persons: {
                            $all: [usersAuthorResult?._id, usersToResult?._id]
                        }
                    })

                    if (!chatsResult?._id) {
                        await chats.insertOne({ persons: [usersToResult?._id, usersAuthorResult?._id] })
                    }

                    clients.forEach(client => {
                        if (client.uid == dataP.to) client.socket.emit('newchat', JSON.stringify({ from: usersAuthorResult }))
                    })
                } catch (e) {
                    console.error(e)
                } finally {
                    client.close()
                }

            } catch (e) {
                console.log('ERROR: ', e);
            }
        });

        socket.emit('message', { msg: "hola" });
    });
}
export default configureIO


