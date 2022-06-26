import "reflect-metadata"
import { DataSource } from "typeorm"
import * as dotenv from "dotenv"
import express from "express"
import {User} from "./entity/User";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DEFAULT,
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
})

export const Express = express();