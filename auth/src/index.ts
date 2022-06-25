import { AppDataSource } from "./data-source"
import MessageBroker from "./broker";

AppDataSource.initialize().then(async () => {

    await (await MessageBroker.init()).send("auth", "Test123")

}).catch(error => console.log(error))
