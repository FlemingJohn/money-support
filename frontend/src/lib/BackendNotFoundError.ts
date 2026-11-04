export class BackendNotFoundError extends Error {
  constructor(path: string) {
    super(`The backend has nothing at ${path}`);
  }
}
