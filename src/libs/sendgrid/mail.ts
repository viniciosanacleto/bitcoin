import sgMail, { MailDataRequired } from "@sendgrid/mail";
import { MailGatewayInterface } from "../../gateways/mail/interfaces";
import { SendEmailDTO } from "../../gateways/mail/dtos/send-email";

export class SendgridMail implements MailGatewayInterface {
  public async send(emailObj: SendEmailDTO) {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      throw new Error("No sendgrid api key");
    }

    const sender = process.env.SENDGRID_SENDER;
    if (!sender) {
      throw new Error("No sendgrid sender email");
    }

    sgMail.setApiKey(apiKey);

    const message: MailDataRequired = {
      from: sender,
      to: emailObj.email,
      subject: emailObj.subject,
      text: emailObj.text,
      html: emailObj.html,
    };
    try {
      await sgMail.send(message);
    } catch (e) {
      console.log(e);
      throw new Error("Failed to send email");
    }
  }
}
