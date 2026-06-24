import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { config } from "../config.js";

const encryptionKey = createHash("sha256").update(config.TOKEN_ENCRYPTION_KEY).digest();

export function randomToken(bytes = 32) {
  return randomBytes(bytes).toString("base64url");
}

export function hashToken(value: string) {
  return createHash("sha256").update(`${config.SESSION_SECRET}:${value}`).digest("hex");
}

export function encrypt(value: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey, iv);
  const ciphertext = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  return [iv, cipher.getAuthTag(), ciphertext].map((part) => part.toString("base64url")).join(".");
}

export function decrypt(value: string) {
  const [iv, tag, ciphertext] = value.split(".").map((part) => Buffer.from(part, "base64url"));
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
}

export function parseCookies(header = "") {
  return Object.fromEntries(header.split(";").map((item) => item.trim().split("=")).filter(([key]) => key).map(([key, value]) => [key, decodeURIComponent(value ?? "")]));
}
