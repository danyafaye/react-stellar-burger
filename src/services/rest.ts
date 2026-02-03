import { baseUrl } from '@utils/constants.ts';
import { setCookie } from '@utils/cookie.ts';

export type TServerResponse<T> = T & {
  success: boolean;
  message?: string;
};

export const handleApiError = (error: unknown): string => {
  if (error instanceof TypeError) {
    return 'Ошибка сети: проверьте подключение к интернету';
  }
  if (error instanceof SyntaxError) {
    return 'Ошибка парсинга данных от сервера';
  }
  return error instanceof Error ? error.message : 'Произошла неизвестная ошибка';
};

export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<TServerResponse<T>> => {
  const { headers, ...restOptions } = options;

  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...restOptions,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });

  const data = (await response.json()) as TServerResponse<T>;

  if (!response.ok) {
    throw new Error(data.message ?? `Ошибка ${response.status}`);
  }

  if (!data.success) {
    throw new Error(data.message ?? 'API вернул неуспешный ответ');
  }

  return data;
};

export const refreshToken = (): Promise<
  TServerResponse<{ accessToken: string; refreshToken: string }>
> =>
  apiRequest<{ accessToken: string; refreshToken: string }>('/auth/token', {
    method: 'POST',
    body: JSON.stringify({ token: localStorage.getItem('refreshToken') }),
  });

export const fetchWithRefresh = async <T>(
  endpoint: string,
  options: RequestInit
): Promise<TServerResponse<T>> => {
  try {
    return await apiRequest<T>(endpoint, options);
  } catch (err) {
    if (err instanceof Error && err.message === 'jwt expired') {
      const refreshData = await refreshToken();

      localStorage.setItem('refreshToken', refreshData.refreshToken);
      setCookie('accessToken', refreshData.accessToken);

      const headers = {
        ...(options.headers as Record<string, string>),
        authorization: refreshData.accessToken,
      };

      return await apiRequest<T>(endpoint, { ...options, headers });
    }

    throw err;
  }
};
