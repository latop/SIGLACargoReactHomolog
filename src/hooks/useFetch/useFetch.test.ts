import { renderHook, act } from "@testing-library/react";
import { AxiosError, AxiosResponse, AxiosRequestConfig } from "axios";
import { useFetch } from "./useFetch";

// Mock the api service
jest.mock("@/services/configs/api", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

import api from "@/services/configs/api";
const mockedApi = api as jest.Mocked<typeof api>;

// Mock process.env
const originalEnv = process.env;
beforeEach(() => {
  process.env = { ...originalEnv, NEXT_PUBLIC_API_URL: "https://api.test.com" };
});

afterEach(() => {
  process.env = originalEnv;
  jest.clearAllMocks();
});

describe("useFetch", () => {
  const mockSuccessResponse: AxiosResponse = {
    data: { id: 1, name: "test" },
    status: 200,
    statusText: "OK",
    headers: {},
    config: {
      url: "/test",
      method: "post",
    } as AxiosRequestConfig,
    request: {},
  };

  const mockError: AxiosError = {
    message: "Network Error",
    name: "AxiosError",
    code: "NETWORK_ERROR",
    config: {
      url: "/test",
      method: "post",
    } as AxiosRequestConfig,
    isAxiosError: true,
    toJSON: () => ({}),
  };

  describe("initialization", () => {
    it("should initialize with correct default state", () => {
      const { result } = renderHook(() => useFetch());
      const [, state] = result.current;

      expect(state.data).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe("POST requests", () => {
    it("should make a successful POST request", async () => {
      mockedApi.post.mockResolvedValueOnce(mockSuccessResponse);

      const { result } = renderHook(() => useFetch());
      const [doFetch] = result.current;

      await act(async () => {
        await doFetch("/test", { name: "test" });
      });

      const [, state] = result.current;

      expect(mockedApi.post).toHaveBeenCalledWith(
        "/test",
        { name: "test" },
        { headers: {}, responseType: "json" },
      );
      expect(state.data).toEqual(mockSuccessResponse.data);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it("should handle POST request errors", async () => {
      mockedApi.post.mockRejectedValueOnce(mockError);

      const { result } = renderHook(() => useFetch());
      const [doFetch] = result.current;

      await act(async () => {
        await doFetch("/test", { name: "test" });
      });

      const [, state] = result.current;

      expect(state.data).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.error).toBe("Network Error");
    });
  });

  describe("GET requests", () => {
    it("should make a successful GET request", async () => {
      mockedApi.get.mockResolvedValueOnce(mockSuccessResponse);

      const { result } = renderHook(() => useFetch());
      const [doFetch] = result.current;

      await act(async () => {
        await doFetch("/test", { param: "value" }, { method: "get" });
      });

      const [, state] = result.current;

      expect(mockedApi.get).toHaveBeenCalledWith("/test", {
        headers: {},
        params: { param: "value" },
        responseType: "json",
      });
      expect(state.data).toEqual(mockSuccessResponse.data);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe("PUT requests", () => {
    it("should make a successful PUT request", async () => {
      mockedApi.put.mockResolvedValueOnce(mockSuccessResponse);

      const { result } = renderHook(() => useFetch());
      const [doFetch] = result.current;

      await act(async () => {
        await doFetch("/test", { name: "updated" }, { method: "put" });
      });

      const [, state] = result.current;

      expect(mockedApi.put).toHaveBeenCalledWith(
        "/test",
        { name: "updated" },
        { headers: {} },
      );
      expect(state.data).toEqual(mockSuccessResponse.data);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe("DELETE requests", () => {
    it("should make a successful DELETE request", async () => {
      mockedApi.delete.mockResolvedValueOnce(mockSuccessResponse);

      const { result } = renderHook(() => useFetch());
      const [doFetch] = result.current;

      await act(async () => {
        await doFetch("/test", { id: 1 }, { method: "delete" });
      });

      const [, state] = result.current;

      expect(mockedApi.delete).toHaveBeenCalledWith("/test", {
        data: { id: 1 },
        headers: {},
      });
      expect(state.data).toEqual(mockSuccessResponse.data);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe("loading states", () => {
    it("should set loading to true during request", async () => {
      let resolvePromise: (value: AxiosResponse) => void;
      const promise = new Promise<AxiosResponse>((resolve) => {
        resolvePromise = resolve;
      });
      mockedApi.post.mockReturnValueOnce(promise);

      const { result } = renderHook(() => useFetch());
      const [doFetch] = result.current;

      act(() => {
        doFetch("/test", {});
      });

      // Check loading state immediately after starting request
      const [, stateWhileLoading] = result.current;
      expect(stateWhileLoading.loading).toBe(true);
      expect(stateWhileLoading.data).toBeNull();
      expect(stateWhileLoading.error).toBeNull();

      // Resolve the promise
      await act(async () => {
        resolvePromise!(mockSuccessResponse);
        await promise;
      });

      const [, finalState] = result.current;
      expect(finalState.loading).toBe(false);
    });

    it("should reset data and error when starting new request", async () => {
      mockedApi.post
        .mockResolvedValueOnce({ ...mockSuccessResponse, data: { id: 1 } })
        .mockRejectedValueOnce(mockError);

      const { result } = renderHook(() => useFetch());
      const [doFetch] = result.current;

      // First successful request
      await act(async () => {
        await doFetch("/test", {});
      });

      expect(result.current[1].data).toEqual({ id: 1 });

      // Second request that fails - should reset data and error
      await act(async () => {
        await doFetch("/test", {});
      });

      const [, finalState] = result.current;
      expect(finalState.data).toBeNull();
      expect(finalState.error).toBe("Network Error");
    });
  });

  describe("options", () => {
    it("should call onSuccess callback on successful request", async () => {
      mockedApi.post.mockResolvedValueOnce(mockSuccessResponse);
      const onSuccess = jest.fn();

      const { result } = renderHook(() => useFetch());
      const [doFetch] = result.current;

      await act(async () => {
        await doFetch("/test", {}, { onSuccess });
      });

      expect(onSuccess).toHaveBeenCalledWith(mockSuccessResponse);
    });

    it("should call onError callback on failed request", async () => {
      mockedApi.post.mockRejectedValueOnce(mockError);
      const onError = jest.fn();

      const { result } = renderHook(() => useFetch());
      const [doFetch] = result.current;

      await act(async () => {
        await doFetch("/test", {}, { onError });
      });

      expect(onError).toHaveBeenCalledWith(mockError);
    });

    it("should use custom headers", async () => {
      mockedApi.post.mockResolvedValueOnce(mockSuccessResponse);
      const customHeaders = { Authorization: "Bearer token" };

      const { result } = renderHook(() => useFetch());
      const [doFetch] = result.current;

      await act(async () => {
        await doFetch("/test", {}, { headers: customHeaders });
      });

      expect(mockedApi.post).toHaveBeenCalledWith(
        "/test",
        {},
        {
          headers: customHeaders,
          responseType: "json",
        },
      );
    });

    it("should use custom responseType", async () => {
      mockedApi.get.mockResolvedValueOnce(mockSuccessResponse);

      const { result } = renderHook(() => useFetch());
      const [doFetch] = result.current;

      await act(async () => {
        await doFetch("/test", {}, { method: "get", responseType: "blob" });
      });

      expect(mockedApi.get).toHaveBeenCalledWith("/test", {
        headers: {},
        params: {},
        responseType: "blob",
      });
    });
  });

  describe("unsupported method", () => {
    it("should throw error for unsupported HTTP method", async () => {
      const { result } = renderHook(() => useFetch());
      const [doFetch] = result.current;

      await act(async () => {
        await doFetch(
          "/test",
          {},
          { method: "patch" as "post" | "put" | "delete" | "get" },
        );
      });

      const [, state] = result.current;
      expect(state.error).toBe("Unsupported method: patch");
      expect(state.data).toBeNull();
      expect(state.loading).toBe(false);
    });
  });

  describe("api configuration", () => {
    it("should verify environment variable is set for tests", () => {
      expect(process.env.NEXT_PUBLIC_API_URL).toBe("https://api.test.com");
    });
  });
});
