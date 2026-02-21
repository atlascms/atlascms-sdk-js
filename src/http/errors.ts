export class AtlasHttpError extends Error {
  public readonly status: number;
  public readonly code?: string;
  public readonly details?: unknown;
  public readonly requestId?: string;
  public readonly raw?: unknown;

  public constructor(params: {
    message: string;
    status: number;
    code?: string;
    details?: unknown;
    requestId?: string;
    raw?: unknown;
  }) {
    super(params.message);
    this.name = "AtlasHttpError";
    this.status = params.status;
    this.code = params.code;
    this.details = params.details;
    this.requestId = params.requestId;
    this.raw = params.raw;
  }
}

export class AtlasNetworkError extends Error {
  public readonly cause?: unknown;

  public constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "AtlasNetworkError";
    this.cause = cause;
  }
}

export class AtlasTimeoutError extends Error {
  public readonly timeoutMs: number;

  public constructor(timeoutMs: number) {
    super(`Request timeout after ${timeoutMs}ms`);
    this.name = "AtlasTimeoutError";
    this.timeoutMs = timeoutMs;
  }
}

export function normalizeApiError(status: number, payload: unknown, fallbackMessage: string, requestId?: string): AtlasHttpError {
  if (isObject(payload)) {
    const message =
      readString(payload, "message") ??
      readString(payload, "title") ??
      readString(payload, "error") ??
      fallbackMessage;

    return new AtlasHttpError({
      message,
      status,
      code: readString(payload, "code"),
      details: readUnknown(payload, "details") ?? readUnknown(payload, "errors"),
      requestId,
      raw: payload
    });
  }

  return new AtlasHttpError({
    message: fallbackMessage,
    status,
    requestId,
    raw: payload
  });
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readString(payload: Record<string, unknown>, key: string): string | undefined {
  const value = payload[key];
  return typeof value === "string" ? value : undefined;
}

function readUnknown(payload: Record<string, unknown>, key: string): unknown {
  return payload[key];
}
