export class ApplicationError extends Error {
  public status: number | undefined;

  constructor(
    message: string = 'Ocorreu um erro. Tente novamente mais tarde',
    status?: number
  ) {
    super(message);
    this.status = status;
  }
}