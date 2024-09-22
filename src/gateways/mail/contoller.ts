import { QueuePublisherInterface } from "../../infrastructure/queues/interfaces";
import { SendEmailDTO } from "./dtos/send-email";
import { MailControllerInterface, MailGatewayInterface } from "./interfaces";

export class MailController implements MailControllerInterface {
  constructor(
    private mailQueuePublisher: QueuePublisherInterface,
    private mailGateway: MailGatewayInterface
  ) {}

  public async dispatch(email: SendEmailDTO, skipQueue?: false): Promise<void> {
    if (!skipQueue) {
      try {
        await this.mailQueuePublisher.publish(email);
        return;
      } catch (e) {
        console.log(
          "Failed to dispatch message to the queue. Continuing directly"
        );
      }
    }

    await this.mailGateway.send(email);
  }
}
