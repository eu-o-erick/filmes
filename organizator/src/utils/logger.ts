export class Logger {
  public info(message: string): void {
    console.log(`\x1b[36m${message}\x1b[0m`); // Cyan
  }

  public success(message: string): void {
    console.log(`\x1b[32m${message}\x1b[0m`); // Green
  }

  public warn(message: string): void {
    console.log(`\x1b[33m${message}\x1b[0m`); // Yellow
  }

  public error(message: string): void {
    console.log(`\x1b[31m${message}\x1b[0m`); // Red
  }
}
