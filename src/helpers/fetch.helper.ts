import { getToken } from "../services/security.service";

interface FetchJsonProps {
  path: string;
  method?: string;
  headers?: Record<string, string>;
  body?: string;
  secure?: boolean;
}

export const fetchJson = async <R>({
  path,
  method = "GET",
  headers,
  body,
  secure = false,
}: FetchJsonProps): Promise<R> => {
  let secureHeaders: Record<string, string> | undefined = headers;

  if (secure) {
    const token = getToken();

    if (!token) {
      throw new Error("No token available");
    }

    secureHeaders = { ...headers, Authorization: `Bearer ${token}` };
  }

  const response = await fetch(path, { method, headers: secureHeaders, body });
  const responseJson = await response.json();

  if (response.status >= 400) {
    throw new Error(responseJson.message);
  }

  return responseJson;
};
