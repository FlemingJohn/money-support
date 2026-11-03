import { Injectable } from "@nestjs/common";
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { AppConfiguration } from "../configuration/services/AppConfiguration";

@Injectable()
export class EncryptionService {
  private readonly algorithm = "aes-256-gcm";
  private readonly key: Buffer;

  constructor(appConfiguration: AppConfiguration) {
    this.key = Buffer.from(appConfiguration.encryptionKey, "base64");
  }

  encrypt(plainText: string): string {
    const initializationVector = randomBytes(12);
    const cipher = createCipheriv(this.algorithm, this.key, initializationVector);
    const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
    return [initializationVector, cipher.getAuthTag(), encrypted].map((part) => part.toString("base64")).join(".");
  }

  decrypt(sealedText: string): string {
    const [initializationVector, authenticationTag, encrypted] = sealedText.split(".").map((part) => Buffer.from(part, "base64"));
    const decipher = createDecipheriv(this.algorithm, this.key, initializationVector);
    decipher.setAuthTag(authenticationTag);
    return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
  }
}
