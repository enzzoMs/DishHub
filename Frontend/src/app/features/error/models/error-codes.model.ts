export enum ErrorCode {
  NetworkError = 0,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  Conflict = 409,
  InternalServerError = 500,
}

export function getErrorCode(code: number): ErrorCode | null {
  if (Object.values(ErrorCode).includes(code)) {
    return code as ErrorCode;
  }
  return null;
}
