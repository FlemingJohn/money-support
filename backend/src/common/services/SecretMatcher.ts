import { Injectable } from "@nestjs/common";
import { timingSafeEqual } from "node:crypto";

@Injectable()
export class SecretMatcher {
  matches(received: string | undefined, expected: string): boolean {
    if (!received) return false;
    const receivedBytes = Buffer.from(received);
    const expectedBytes = Buffer.from(expected);
    if (receivedBytes.length !== expectedBytes.length) return false;
    return timingSafeEqual(receivedBytes, expectedBytes);
  }
}
