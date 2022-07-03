import {NextFunction, Response} from "express";
import * as jwt from "jsonwebtoken";

export default async function authMiddleware(req: any, res: Response, next: NextFunction) {
    if (!req.headers.authorization)
        return res.status(401).json({error: true, message: "No authorization header"});

    const [, token] = req.headers.authorization.split(" ");

    if (token === undefined)
        return res.status(400).json({error: true, message: "No token provided"});

    const decoded = await jwt.verify(token, process.env.JWT_SECRET) as any;

    if (decoded === undefined || decoded.accountId === undefined)
        return res.status(401).json({error: true, message: "Invalid token"});

    req.user = decoded;

    next();
}