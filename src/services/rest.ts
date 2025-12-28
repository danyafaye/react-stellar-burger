import { baseUrl } from '@utils/constants.ts';

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
): Promise<T> => {
  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorMessage = `Ошибка ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const data = (await response.json()) as T;

    if (typeof data === 'object' && data !== null && 'success' in data) {
      const responseWithSuccess = data as T & { success: boolean };
      if (!responseWithSuccess.success) {
        throw new Error('API вернул неуспешный ответ');
      }
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(handleApiError(error));
  }
};
