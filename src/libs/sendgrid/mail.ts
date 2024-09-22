import sgMail, { MailDataRequired } from "@sendgrid/mail";

export class SendgridMail {
  public async send(
    email: string,
    subject: string,
    text: string,
    html?: string
  ) {
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
      to: email,
      subject,
      text,
      html,
    };
    try {
      await sgMail.send(message);
    } catch (e) {
      console.log(e);
      throw new Error("Failed to send email");
    }
  }
}
