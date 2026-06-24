import type { ApiEnvelope, ApiErrorEnvelope } from "@blaze/shared";

const defaultApiUrl = "http://localhost:4000/api";
const apiUrl = (import.meta.env.VITE_API_URL ?? defaultApiUrl).replace(/\/$/, "");
export const apiOrigin = apiUrl;
const requestTimeoutMs = 15_000;

export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly retryable: boolean
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

export async function getApiData<T>(path: string, signal?: AbortSignal): Promise<T> {
  let response: Response;
  const requestSignal = createRequestSignal(signal);

  try {
    response = await fetch(`${apiUrl}${path}`, {
      credentials: "include",
      headers: {
        Accept: "application/json"
      },
      signal: requestSignal.signal
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      if (signal?.aborted) throw error;
      throw new ApiClientError("Your creator intelligence is taking longer than expected. Please try again.", 0, false);
    }

    throw new ApiClientError("Your creator intelligence is temporarily unavailable.", 0, true);
  } finally {
    requestSignal.dispose();
  }

  if (!response.ok) {
    const payload = await parseJson<ApiErrorEnvelope>(response);
    const message = payload?.error?.message ?? "Your creator intelligence is temporarily unavailable.";

    if (response.status === 401 && !path.startsWith("/auth/")) {
      const returnTo = `${window.location.pathname}${window.location.search}`;
      window.location.assign(`/login?returnTo=${encodeURIComponent(returnTo)}`);
    }
    throw new ApiClientError(message, response.status, response.status >= 500 || response.status === 429);
  }

  const payload = await parseJson<ApiEnvelope<T>>(response);

  if (!payload || !("data" in payload)) {
    throw new ApiClientError("Your latest creator data could not be prepared.", response.status, false);
  }

  return payload.data;
}

export async function postApi(path: string): Promise<void> {
  const requestSignal = createRequestSignal();
  let response: Response;
  try {
    response = await fetch(`${apiUrl}${path}`, {
      method: "POST",
      credentials: "include",
      headers: { Accept: "application/json" },
      signal: requestSignal.signal
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiClientError("That action is taking longer than expected. Please try again.", 0, false);
    }
    throw new ApiClientError("That action could not be completed. Please try again.", 0, true);
  } finally {
    requestSignal.dispose();
  }
  if (!response.ok) {
    const payload = await parseJson<ApiErrorEnvelope>(response);
    throw new ApiClientError(payload?.error?.message ?? "That action could not be completed. Please try again.", response.status, response.status >= 500);
  }
}

function createRequestSignal(signal?: AbortSignal) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), requestTimeoutMs);
  const abort = () => controller.abort();
  signal?.addEventListener("abort", abort, { once: true });

  return {
    signal: controller.signal,
    dispose: () => {
      window.clearTimeout(timeout);
      signal?.removeEventListener("abort", abort);
    }
  };
}

async function parseJson<T>(response: Response): Promise<T | undefined> {
  try {
    return (await response.json()) as T;
  } catch {
    return undefined;
  }
}
