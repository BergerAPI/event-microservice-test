import {AppDataSource, Express} from "./data-source"
import {initService} from "./service/service";
import MessageBroker from "./broker";
import express from "express";
import helmet from "helmet";
import cors from "cors";

AppDataSource.initialize().then(async () => {

    // Initializing the MessageBroker, so we can use it
    // to communicate with the other services
    await MessageBroker.init()

    // Initializing some express-middleware
    Express.use(express.json())
    Express.use(helmet())
    Express.use(cors())

    // Initializing the service-routes
    initService();

    Express.listen(3000, () => {
        console.log("Express is listening.")
    })

}).catch(error => console.log(error))
