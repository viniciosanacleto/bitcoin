export interface MailGatewayInterface {
  send: (
    email: string,
    subject: string,
    text: string,
    html?: string
  ) => Promise<void>;
}
