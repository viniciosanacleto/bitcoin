import { SendEmailDTO } from "../../../gateways/mail/dtos/send-email";
import { QueuePublisherInterface } from "../interfaces";
import amqplib from "amqplib";
import { QUEUE_NAME } from "./contants";

export class MailPublisher implements QueuePublisherInterface {
  public async publish(message: SendEmailDTO): Promise<void> {
    const qUrl = process.env.MESSAGING_URL || null;
    if (!qUrl) {
      throw new Error("Messaging system is not set. Check .env MESSAGING_URL");
    }

    const qConnection = await amqplib.connect(qUrl);
    const qChannel = await qConnection.createConfirmChannel();
    await qChannel.assertQueue(QUEUE_NAME, { durable: true });

    const sentAck = qChannel.sendToQueue(
      QUEUE_NAME,
      Buffer.from(JSON.stringify(message))
    );
    if (!sentAck) {
      throw new Error("Failed to send message to queue");
    }

    await qChannel.waitForConfirms();
    await qConnection.close();
  }
}
