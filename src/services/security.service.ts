import { useMutation } from "react-query";
import { API_BASE_URL } from "./config.service";

const SECURITY_BASE_URL = `${API_BASE_URL}/auth`;

const TOKEN_LOCAL_STORAGE_KEY = "TOKEN_LOCAL_STORAGE_KEY";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

export enum Role {
  ROLE_ADMIN,
  ROLE_MODERATOR,
  ROLE_USER,
}

const login = async (loginRequest: LoginRequest): Promise<LoginResponse> => {
  const response = await fetch(`${SECURITY_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginRequest),
  });
  const responseJson = await response.json();

  if (response.status >= 400) {
    throw new Error(responseJson.message);
  }

  localStorage.setItem(TOKEN_LOCAL_STORAGE_KEY, responseJson.token);

  return responseJson;
};

export const useLogin = () => {
  return useMutation<LoginResponse, Error, LoginRequest>(login);
};

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  contestId: string;
  role: Role;
}

interface RegisterResponse {
  email: string;
}

const register = async (
  registerRequest: RegisterRequest,
): Promise<RegisterResponse> => {
  const response = await fetch(`${SECURITY_BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registerRequest),
  });
  const responseJson = await response.json();

  if (response.status >= 400) {
    throw new Error(responseJson.message);
  }

  return responseJson;
};

export const useRegister = () => {
  return useMutation<RegisterResponse, Error, RegisterRequest>(register);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_LOCAL_STORAGE_KEY);
};

export const logout = () => {
  localStorage.removeItem(TOKEN_LOCAL_STORAGE_KEY);
};
