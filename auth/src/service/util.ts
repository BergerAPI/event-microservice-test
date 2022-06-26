import {Request, Response} from "express";

export function makeSure(request: Request, response: Response, func: (...args: any) => any) {
    // Checking if the request has all the required body-parameter
    const requiredParams = func.toString().match(/\(([^)]+)\)/)[1].split(",").map(x => x.trim());
    const missingParams = requiredParams.filter(x => !(x in request.body));

    if (missingParams.length > 0)
        return response.status(400).json({error: true});

    return func(...requiredParams.map(x => request.body[x])).then(result => {
        response.status(result.status).json(result.content);
    });
}