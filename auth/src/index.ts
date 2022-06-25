import {AppDataSource, Express} from "./data-source"
import MessageBroker from "./broker";

AppDataSource.initialize().then(async () => {

    // Initializing the MessageBroker, so we can use it
    // to communicate with the other services
    await MessageBroker.init()

    Express.listen(3000, () => {
        console.log("Express is listening.")
    })

}).catch(error => console.log(error))
