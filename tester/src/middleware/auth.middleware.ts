import {NextFunction, Request, Response} from "express";
import axios from "axios";

export default async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization)
        return res.status(401).json({error: true, message: "No authorization header"});

    const [, token] = req.headers.authorization.split(" ");

    if (token === undefined)
        return res.status(400).json({error: true, message: "No token provided"});

    axios.post(`${process.env.API_GATEWAY}/auth/check-token`, {
        token
    }).then(response => {
        if (response.data.error)
            return res.status(400).json({error: true, message: "Invalid token"});

        next();
    }).catch(error => {
        console.log(error)
        return res.status(400).json({error: true, message: "Invalid token"});
    });
}