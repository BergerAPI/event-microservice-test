import "reflect-metadata"
import { DataSource } from "typeorm"
import * as dotenv from "dotenv"
import express from "express"
import {User} from "./entity/User";

dotenv.config();

const hostPort = process.env.DB_HOST.split(":")

export const AppDataSource = new DataSource({
    type: "postgres",
    host: hostPort[0],
    port: Number(hostPort[1]),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
})

export const Express = express();