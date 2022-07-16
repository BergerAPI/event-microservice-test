import * as jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { AppDataSource, Express } from "../data-source";
import { User } from "../entity/User";
import { Requirement, ServiceResponse } from "./types";

/**
 * Generating a token for a person to automatically authenticate
 * @param username what the user is called
 * @param password a factor to verify that an account belongs to a person
 */
export async function login(username: string, password: string): Promise<ServiceResponse> {
    const user = await AppDataSource.getRepository(User).findOne({
        where: { username }
    });

    if (user === undefined || user === null || !(await bcrypt.compare(password, user.password)))
        return { status: 400, content: { error: true } }

    // Generating the jwt-token
    const token = jwt.sign({
        accountId: user.id,
    }, process.env.JWT_SECRET, {
        expiresIn: "3h"
    })

    return { status: 200, content: { error: false, token } }
}

/**
 * This creates a new user and writes it to the database
 * @param username what the user is called
 * @param password a factor to verify that an account belongs to a person
 */
export async function register(username: string, password: string): Promise<ServiceResponse> {
    const user = await AppDataSource.getRepository(User).findOne({
        where: { username }
    });

    if (user !== null)
        return { status: 400, content: { error: true } }

    // Creating the user-instance which will be written to the database
    const instance = new User()
    instance.username = username;
    instance.password = await bcrypt.hash(password, 10);
    await AppDataSource.getRepository(User).save(instance)

    return { status: 200, content: { error: false } }
}

/**
 * This function is used to verify that a token is valid
 * @param token the token to verify
 */
export async function checkToken(token: string): Promise<ServiceResponse> {
    try {
        jwt.verify(token, process.env.JWT_SECRET);
        return { status: 200, content: { error: false } }
    } catch (error) {
        return { status: 400, content: { error: true } }
    }
}

/**
 * Getting a user from the database by its id
 * @param token
 */
export async function getUser(token: string): Promise<ServiceResponse> {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: number, username: string }
    const user = await AppDataSource.getRepository(User).findOne({
        where: { id: decoded.id }
    })

    if (user === null)
        return { status: 400, content: { error: true } }

    return { status: 200, content: { error: false, user } }
}

/**
 * Initializing every route
 */
export function initService() {
    Express.post("/login", (req, res) => {
        const result = new Requirement(req.body)
            .check("username", "password")
            .bind((body: any) => login(body.username, body.password))
            .getValue()

        result === null ?
            res.status(400).json({ error: true }) :
            res.status(result.status).json(result.content)
    })

    Express.post("/register", (req, res) => {
        const result = new Requirement(req.body)
            .check("username", "password")
            .bind((body: any) => register(body.username, body.password))
            .getValue()

        result === null ?
            res.status(400).json({ error: true }) :
            res.status(result.status).json(result.content)
    });

    Express.get("/get-user", (req, res) => {
        const result = new Requirement(req.query)
            .check("token")
            .bind((queries: any) => getUser(queries.token))
            .getValue()

        result === null ?
            res.status(400).json({ error: true }) :
            res.status(result.status).json(result.content)
    });
}