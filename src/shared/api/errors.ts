import { ApiErrorKind, ApiErrorPayload } from '@/shared/types';

export class ApiError extends Error {
  public readonly kind: ApiErrorKind;
  public readonly statusCode?: number;
  public readonly fieldErrors?: Record<string, string[]>;
  public readonly timestamp: string;
  public readonly code?: string;

  constructor(payload: ApiErrorPayload) {
    super(payload.message);
    this.name = 'ApiError';
    this.kind = payload.kind;
    this.statusCode = payload.statusCode;
    this.fieldErrors = payload.fieldErrors;
    this.timestamp = payload.timestamp;
    this.code = payload.code;
  }

  static network(message = 'Network connection failed. Please check your internet connection.'): ApiError {
    return new ApiError({
      kind: 'NETWORK',
      message,
      timestamp: new Date().toISOString(),
    });
  }

  static timeout(message = 'The request timed out. Please try again.'): ApiError {
    return new ApiError({
      kind: 'NETWORK',
      message,
      timestamp: new Date().toISOString(),
    });
  }

  static fromHttp(status: number, data?: { message?: string; errors?: Record<string, string[]>; code?: string }): ApiError {
    let kind: ApiErrorKind = 'UNKNOWN';
    if (status === 400) kind = 'VALIDATION';
    else if (status === 401) kind = 'UNAUTHORIZED';
    else if (status === 403) kind = 'FORBIDDEN';
    else if (status === 404) kind = 'NOT_FOUND';
    else if (status === 409) kind = 'CONFLICT';
    else if (status === 429) kind = 'RATE_LIMIT';
    else if (status >= 500) kind = 'SERVER';

    return new ApiError({
      kind,
      statusCode: status,
      message: data?.message || `Request failed with status code ${status}`,
      fieldErrors: data?.errors,
      code: data?.code,
      timestamp: new Date().toISOString(),
    });
  }
}
