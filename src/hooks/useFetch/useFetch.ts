import { useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

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

      if (method === "post") {
        response = await axios.post<T>(url, body, { headers, responseType });
      } else if (method === "get") {
        response = await axios.get<T>(url, {
          headers,
          params: body,
          responseType,
        });
      } else if (method === "put") {
        response = await axios.put<T>(url, body, { headers });
      } else if (method === "delete") {
        response = await axios.delete<T>(url, { data: body, headers });
      } else {
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
