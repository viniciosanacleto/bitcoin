export default class Logger {
  private identification: string;

  constructor(identification: string) {
    this.identification = identification;
  }

  public log(str: string) {
    const now = new Date();
    console.log(`[${now.toISOString()}][${this.identification}] ${str}`);
  }
}
