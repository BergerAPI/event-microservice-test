import * as amqp from "amqplib"

/**
 * This class deals with rabbitmq communication
 */
export default class MessageBroker {

    /**
     * Global singleton instance of the Message Broker
     */
    public static instance: MessageBroker;

    /**
     * A list of functions that listen to a specific queue
     */
    public queueConsumer: { queue: string, func: (...args: any[]) => any }[] = [];

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

    constructor(public connection: amqp.Connection, public channel: amqp.Channel) {
        this.listenForFunctionCall("auth", "t", (_) => ("Hello World!")).then(_ => {
            /* */
        })
    }

    /**
     * This function is used to allow multiple functions to listen to a queue without
     * having to requiring multiple consumer.
     * @param queue The queue to listen to
     * @param func The function to call when a message is received
     * @private
     */
    private addConsumer(queue: string, func: (msg: amqp.ConsumeMessage) => any) {
        // If there is no consumer for this queue, we create one
        if (this.queueConsumer.find(c => c.queue === queue) === undefined)
            this.channel.consume(queue, (msg) => {
                if (msg !== null) {
                    this.queueConsumer.forEach(c => {
                        if (c.queue === queue)
                            c.func(msg)
                    })

                    this.channel.ack(msg)
                } else console.log('Consumer cancelled by server');
            }).then(_ => {
                /* */
            })

        this.queueConsumer.push({queue, func})
    }

    /**
     * This function is used to listen to a queue and reply to request (function class)
     * @see https://www.enterpriseintegrationpatterns.com/patterns/messaging/RequestReply.html
     * @param queue
     * @param name
     * @param func
     */
    async listenForFunctionCall(queue: string, name: string, func: (msg: any) => any) {
        await this.channel.assertQueue(queue, {durable: true});

        this.addConsumer(queue, (msg) => {
            const {correlationId} = msg.properties;

            try {
                const json = JSON.parse(msg.content.toString())

                if (!json.name || json.name !== name)
                    return;

                this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(func(json))), {correlationId})
            } catch (_) {
            }
        });
    }

    /**
     * Send message to queue
     * @param {String} queue Queue name
     * @param {Object} msg Message as Buffer
     * @param {Object} properties Message properties
     */
    async send(queue: string, msg: any, properties: any = {}) {
        await this.channel.assertQueue(queue, {durable: true});
        this.channel.sendToQueue(queue, Buffer.from(msg), properties)
    }

}