import api from "@/services/configs/api";
import { useState } from "react";
import { AxiosError, AxiosResponse } from "axios";

type useFetchOptions<T> = {
  onSuccess?: (response: AxiosResponse<T>) => void;
  onError?: (error: AxiosError) => void;
  method?: "post" | "put" | "delete" | "get";
  headers?: Record<string, string>;
  responseType?: "json" | "blob";
};

export function useFetch<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const doFetch = async (
    url: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body: any,
    options?: useFetchOptions<T>,
  ) => {
    setLoading(true);
    setData(null);
    setError(null);
    const method = options?.method || "post";
    const headers = options?.headers || {};
    const responseType = options?.responseType || "json";

    try {
      let response: AxiosResponse<T>;

      switch (method) {
        case "post":
          response = await api.post<T>(url, body, { headers, responseType });
          break;
        case "get":
          response = await api.get<T>(url, {
            headers,
            params: body,
            responseType,
          });
          break;
        case "put":
          response = await api.put<T>(url, body, { headers });
          break;
        case "delete":
          response = await api.delete<T>(url, { data: body, headers });
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }

      setData(response.data);

      if (options?.onSuccess) {
        options.onSuccess(response);
      }
    } catch (err) {
      const error = err as AxiosError;
      setError(error.message);

      if (options?.onError) {
        options.onError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return [doFetch, { data, loading, error }] as const;
}
