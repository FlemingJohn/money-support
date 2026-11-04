import type { HandOffEmail } from "../types/HandOffEmail";

export abstract class HandOffMailer {
  abstract send(email: HandOffEmail): Promise<void>;
}
