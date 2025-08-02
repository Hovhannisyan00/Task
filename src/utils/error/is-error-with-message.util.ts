import { IErrorInterface } from 'src/interfaces/error/IErrorInterface';

export function isErrorWithMessage(error: unknown): error is IErrorInterface {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message: string }).message === 'string'
  );
}
