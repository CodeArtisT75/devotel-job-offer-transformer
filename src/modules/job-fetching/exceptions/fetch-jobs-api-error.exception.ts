export class FetchJobsApiErrorException extends Error {
  public provider: string;
  public message: string;

  constructor(provider: string, message: string = '') {
    super();

    this.provider = provider;
    this.message = message;
  }
}
