export class NeverError extends Error {
  constructor(item: never) {
    super(`This error should never be reached. Received unhandled item: ${item}`);
  }
}
