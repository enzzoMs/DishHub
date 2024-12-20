export enum ErrorCode {
  NotFound = 404,
}

export function getErrorCode(code: number): ErrorCode | null {
  if (Object.values(ErrorCode).includes(code)) {
    return code as ErrorCode;
  }
  return null;
}
