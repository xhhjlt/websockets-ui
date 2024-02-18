import { MessageTypes } from "../lib/messageTypes";

export class AppError extends Error {
  type: MessageTypes;
  constructor(type: MessageTypes, message: string) {
    super(message);
    this.type = type;
  }
}