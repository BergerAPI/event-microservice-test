import * as amqp from "amqplib"

/**
 * This class deals with rabbitmq communication
 */
export default class MessageBroker {

    /**
     * Global singleton instance of the Message Broker
     */
    public static instance: MessageBroker;

    constructor(public connection: amqp.Connection, public channel: amqp.Channel) {
        // Starting to listen
        channel.consume("auth", (msg) => {
            if (msg !== null) {
                console.log("<Received> " + msg.content.toString());
                channel.ack(msg);
            } else console.log('Consumer cancelled by server');
        }).then(_ => {
            /* */
        })
    }

     /**
     * Initializing a new instance of the MessageBroker
     */
    static async init(): Promise<MessageBroker> {

        if (MessageBroker.instance !== undefined)
            throw new Error("MessageBroker already in initialized.")

        const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
        const channel = await connection.createChannel();

        return MessageBroker.instance = new MessageBroker(connection, channel);
    }

    /**
     * Send message to queue
     * @param {String} queue Queue name
     * @param {Object} msg Message as Buffer
     */
    async send(queue: string, msg: any) {
        await this.channel.assertQueue(queue, {durable: true});
        this.channel.sendToQueue(queue, Buffer.from(msg))
    }

}