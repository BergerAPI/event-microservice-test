import {Express} from "./data-source";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import {initService} from "./service/service";

/**
 * Entry point
 */
(async function main() {

    // Initializing some express-middleware
    Express.use(express.json())
    Express.use(helmet())
    Express.use(cors())

    initService();

    Express.listen(3000, () => {
        console.log("Express is listening.")
    });
})().then(() => {
    /* */
});