import { Router } from "express";
import axios from 'axios'

const auth = (req: any, res: any, next: Function) => { //Auth module middleware

    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if (token?.includes("Bearer "))
        token = token?.slice(7, token.length) //Trim the "Bearer " text in the header token
    if (!token) { //If dont have a token header send a 401 and a msg
        res.status(401).json({ error: "you dont have a token" })
        return
    }
    if (typeof (token) === 'string') //Ts need this line to know that token is a string and not a string[]
        axios.get(`${process.env.AUTHSERVER}:${process.env.AUTHPORT}/v1/verify`, { data: { token:token} })
            .then(function (response) {
                if (typeof (response) !== 'string') {
                    req.uid = response.data.uid //Store the userId on memory in the request
                    req.token = token //Store the token on memory in the request
                    next()
                }
            })
            .catch(function (error) {
                res.status(401).json({ msg: "Token is invalid or expired" })
            })
            .finally(function () {
                // always executed
            });

}

export default auth