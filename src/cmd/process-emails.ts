import dotenv from "dotenv";
import { MailConsumer } from "../infrastructure/queues/mail/mail-consumer";
import { SendgridMail } from "../libs/sendgrid/mail";

dotenv.config();

(async () => {
  const emailConsumer = new MailConsumer(new SendgridMail());

  await emailConsumer.consume();
})();
