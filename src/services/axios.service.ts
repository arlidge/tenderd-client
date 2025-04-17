import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";
import { backOff } from "exponential-backoff";
import { config } from "../config/config";

type RetryConfig = {
  retries?: number;
  delayFirstAttempt?: boolean;
};

const defaultRetryConfig: Required<RetryConfig> = {
  retries: 3,
  delayFirstAttempt: false,
};

export class AxiosClient {
  private static instances: Map<string, AxiosClient> = new Map();

  private axiosInstance: AxiosInstance;
  private retryConfig: Required<RetryConfig>;

  private constructor(baseURL: string, retryConfig?: RetryConfig) {
    this.retryConfig = { ...defaultRetryConfig, ...retryConfig };
    this.axiosInstance = axios.create({ baseURL });
  }

  static getInstance(baseURL: string, retryConfig?: RetryConfig): AxiosClient {
    if (!AxiosClient.instances.has(baseURL)) {
      AxiosClient.instances.set(baseURL, new AxiosClient(baseURL, retryConfig));
    }
    return AxiosClient.instances.get(baseURL)!;
  }

  private async requestWithRetry<T>(config: AxiosRequestConfig): Promise<T> {
    return backOff(
      async () => {
        const response = await this.axiosInstance.request<T>(config);
        return response.data;
      },
      {
        numOfAttempts: this.retryConfig.retries,
        delayFirstAttempt: this.retryConfig.delayFirstAttempt,
        retry: (err: any) => {
          if (!axios.isAxiosError(err)) return false;

          const status = err.response?.status;
          const isNetworkError = !err.response;

          // Only retry on network error or HTTP 5xx
          return (
            isNetworkError ||
            (status !== undefined && status >= 500 && status < 600)
          );
        },
      }
    );
  }

  get<T = any>(url: string, config?: AxiosRequestConfig) {
    return this.requestWithRetry<T>({ ...config, method: "GET", url });
  }

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.requestWithRetry<T>({ ...config, method: "POST", url, data });
  }

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.requestWithRetry<T>({ ...config, method: "PUT", url, data });
  }

  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.requestWithRetry<T>({ ...config, method: "PATCH", url, data });
  }

  delete<T = any>(url: string, config?: AxiosRequestConfig) {
    return this.requestWithRetry<T>({ ...config, method: "DELETE", url });
  }
}

export const apiClient = AxiosClient.getInstance(config.apiUrl, {
  retries: 3,
  delayFirstAttempt: true,
});
