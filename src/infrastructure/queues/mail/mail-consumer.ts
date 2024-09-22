import { SendEmailDTO } from "../../../gateways/mail/dtos/send-email";
import { MailGatewayInterface } from "../../../gateways/mail/interfaces";
import Logger from "../../../shared/utils/logger";
import { QueueConsumerInterface } from "../interfaces";
import { QUEUE_NAME } from "./contants";
import amqplib from "amqplib";

export class MailConsumer implements QueueConsumerInterface {
  private logger = new Logger("MailConsumer");

  constructor(private mailSender: MailGatewayInterface) {}

  public async consume(): Promise<void> {
    const qUrl = process.env.MESSAGING_URL || null;
    if (!qUrl) {
      throw new Error("Messaging system is not set");
    }

    const qConnection = await amqplib.connect(qUrl);
    const qChannel = await qConnection.createConfirmChannel();
    await qChannel.assertQueue(QUEUE_NAME, { durable: true });
    qChannel.prefetch(1);

    qChannel.consume(
      QUEUE_NAME,
      async (msg) => {
        if (!msg) {
          return;
        }

        try {
          const msgContent = msg.content.toString();
          const emailObj = JSON.parse(msgContent) as SendEmailDTO;

          await this.mailSender.send(emailObj);

          await qChannel.ack(msg);
          this.logger.log(`Processed email: ${JSON.stringify(emailObj)}`);
        } catch (e) {
          console.log("Failed to process: ", e);
          await qChannel.nack(msg);
        }
      },
      { noAck: false }
    );
  }
}
