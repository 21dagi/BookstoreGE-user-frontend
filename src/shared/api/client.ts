import { LIMITS, STORAGE_KEYS } from '@/shared/constants';
import { safeStorage } from '@/shared/lib';
import { ApiError } from './errors';

export interface RequestOptions extends RequestInit {
  idempotencyKey?: string;
  timeoutMs?: number;
  params?: Record<string, string | number | boolean | undefined>;
}

export class ApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || (import.meta.env.VITE_API_BASE_URL as string) || '';
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { idempotencyKey, timeoutMs = LIMITS.REQUEST_TIMEOUT_MS, params, ...customConfig } = options;

    let url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += (url.includes('?') ? '&' : '?') + queryString;
      }
    }

    const headers = new Headers(customConfig.headers || {});
    if (!headers.has('Content-Type') && !(customConfig.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }
    headers.set('Accept', 'application/json');

    // Auth & Telegram Headers
    const token = safeStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const initData = typeof window !== 'undefined' ? window.Telegram?.WebApp?.initData : undefined;
    if (initData) {
      headers.set('X-Telegram-Init-Data', initData);
    }

    if (idempotencyKey) {
      headers.set(LIMITS.IDEMPOTENCY_HEADER, idempotencyKey);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...customConfig,
        headers,
        signal: controller.signal,
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          // Non-JSON error body
        }
        throw ApiError.fromHttp(response.status, errorData);
      }

      if (response.status === 204) {
        return undefined as unknown as T;
      }

      return (await response.json()) as T;
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        throw err;
      }
      if (err instanceof DOMException && err.name === 'AbortError') {
        throw ApiError.timeout();
      }
      if (err instanceof TypeError) {
        throw ApiError.network(err.message);
      }
      throw new ApiError({
        kind: 'UNKNOWN',
        message: err instanceof Error ? err.message : 'An unexpected error occurred',
        timestamp: new Date().toISOString(),
      });
    } finally {
      clearTimeout(timeoutId);
    }
  }

  get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
