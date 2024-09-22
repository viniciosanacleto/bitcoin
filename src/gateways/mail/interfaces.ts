import { SendEmailDTO } from "./dtos/send-email";

export interface MailControllerInterface {
  dispatch: (email: SendEmailDTO, skipQueue?: false) => Promise<void>;
}

export interface MailGatewayInterface {
  send: (email: SendEmailDTO) => Promise<void>;
}
