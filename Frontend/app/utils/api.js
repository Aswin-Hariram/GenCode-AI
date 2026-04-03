const DEFAULT_API_BASE_URL = "http://localhost:8000";
export const QUESTION_REQUEST_TIMEOUT_MS = 45000;
export const SUBMIT_REQUEST_TIMEOUT_MS = 120000;

const DEFAULT_ENDPOINTS = {
  getQuestion: "/get_dsa_question",
  submit: "/submit",
  compile: "/compiler",
  changeLanguage: "/changeLanguage",
  askHelp: "/api/ask-help-to-ai",
};

function normalizePath(path, fallback) {
  const value = path || fallback;
  return value.startsWith("/") ? value : `/${value}`;
}

function buildApiUrl(path, params) {
  const url = new URL(`${getApiBaseUrl()}${path}`);

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
}

function getErrorMessage(response, body) {
  if (body && typeof body === "object") {
    return (
      body.message ||
      body.error ||
      body.details ||
      `Request failed with status ${response.status}`
    );
  }

  if (typeof body === "string" && body.trim()) {
    return body;
  }

  return `Request failed with status ${response.status}`;
}

export function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL;
}

export function getQuestionUrl(topic) {
  const path = normalizePath(
    process.env.NEXT_PUBLIC_GET_QUESTION_ENDPOINT,
    DEFAULT_ENDPOINTS.getQuestion
  );
  return buildApiUrl(path, topic ? { topic } : undefined);
}

export function getSubmitUrl() {
  return `${getApiBaseUrl()}${normalizePath(
    process.env.NEXT_PUBLIC_SUBMIT_ENDPOINT,
    DEFAULT_ENDPOINTS.submit
  )}`;
}

export function getCompilerUrl() {
  return `${getApiBaseUrl()}${normalizePath(
    process.env.NEXT_PUBLIC_COMPILER_ENDPOINT,
    DEFAULT_ENDPOINTS.compile
  )}`;
}

export function getChangeLanguageUrl() {
  return `${getApiBaseUrl()}${normalizePath(
    process.env.NEXT_PUBLIC_CHANGE_LANGUAGE_ENDPOINT,
    DEFAULT_ENDPOINTS.changeLanguage
  )}`;
}

export function getAskHelpUrl() {
  return `${getApiBaseUrl()}${normalizePath(
    process.env.NEXT_PUBLIC_ASK_HELP_ENDPOINT,
    DEFAULT_ENDPOINTS.askHelp
  )}`;
}

export async function requestJson(url, options = {}) {
  const { timeoutMs = 20000, ...fetchOptions } = options;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });

    const contentType = response.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const body = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      throw new Error(getErrorMessage(response, body));
    }

    return body;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("The request timed out. Please try again.");
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
