import bcrypt from "bcrypt";

export function encryptPass(
  plainText: string,
  saltRounds: number = 10
): string {
  return bcrypt.hashSync(plainText, saltRounds);
}
