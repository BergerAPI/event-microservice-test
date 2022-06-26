import * as jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import {AppDataSource, Express} from "../data-source";
import {User} from "../entity/User";
import {ServiceResponse} from "./types";
import {makeSure} from "./util";

/**
 * Generating a token for a person to automatically authenticate
 * @param username what the user is called
 * @param password a factor to verify that an account belongs to a person
 */
export async function login(username: string, password: string): Promise<ServiceResponse> {
    const user = await AppDataSource.getRepository(User).findOne({
        where: {username}
    });

    if (user === undefined || user === null || !(await bcrypt.compare(password, user.password)))
        return {status: 400, content: {error: true}}

    // Generating the jwt-token
    const token = jwt.sign({
        id: user.id,
        username: user.username
    }, process.env.JWT_SECRET, {
        expiresIn: "3h"
    })

    return {status: 200, content: {error: false, token}}
}

/**
 * This creates a new user and writes it to the database
 * @param username what the user is called
 * @param password a factor to verify that an account belongs to a person
 */
export async function register(username: string, password: string): Promise<ServiceResponse> {
    const user = await AppDataSource.getRepository(User).findOne({
        where: {username}
    });

    if (user !== null)
        return {status: 400, content: {error: true}}

    // Creating the user-instance which will be written to the database
    const instance = new User()
    instance.username = username;
    instance.password = await bcrypt.hash(password, 10);
    await AppDataSource.getRepository(User).save(instance)

    return {status: 200, content: {error: false}}
}

/**
 * Initializing every route
 */
export function initService() {
    Express.post("/auth/login", (req, res) => {
        return makeSure(req, res, login);
    })

    Express.post("/auth/register", (req, res) => {
        return makeSure(req, res, register);
    });
}