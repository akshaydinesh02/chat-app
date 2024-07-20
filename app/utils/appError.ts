export default class AppError extends Error {
  status?: string;
  statusCode?: number;
  isOperational?: boolean;

  constructor(message: string, statusCode: number, isOperational?: boolean) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = isOperational ?? true;

    Error.captureStackTrace(this, this.constructor);
  }
}
