import { useMutation, useQuery } from "react-query";
import { UseMutationOptions } from "react-query/types/react/types";
import { API_BASE_URL } from "../helpers/config.helper";
import { fetchJson } from "../helpers/fetch.helper";
import { UserDto } from "./user.service";

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
  ROLE_ADMIN = "ROLE_ADMIN",
  ROLE_MODERATOR = "ROLE_MODERATOR",
  ROLE_USER = "ROLE_USER",
}

const login = async (loginRequest: LoginRequest): Promise<LoginResponse> => {
  const response = await fetchJson<LoginResponse>({
    path: `${SECURITY_BASE_URL}/login`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginRequest),
  });

  localStorage.setItem(TOKEN_LOCAL_STORAGE_KEY, response.token);

  return response;
};

export const useLogin = () => {
  return useMutation<LoginResponse, Error, LoginRequest>(login);
};

interface RegisterRequest {
  username: string;
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
  return fetchJson<RegisterResponse>({
    path: `${SECURITY_BASE_URL}/register`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registerRequest),
  });
};

export const useRegister = (
  options?: UseMutationOptions<RegisterResponse, Error, RegisterRequest>,
) => {
  return useMutation<RegisterResponse, Error, RegisterRequest>(
    register,
    options,
  );
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_LOCAL_STORAGE_KEY);
};

export const logout = () => {
  localStorage.removeItem(TOKEN_LOCAL_STORAGE_KEY);
};

const getCurrentUser = async (): Promise<UserDto> => {
  return fetchJson<UserDto>({
    path: `${SECURITY_BASE_URL}/current`,
    secure: true,
  });
};

export const useGetCurrentUser = () => {
  return useQuery<UserDto, Error>("getCurrentUser", getCurrentUser, {
    retry: 1,
    retryDelay: 0,
  });
};
