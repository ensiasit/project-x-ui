import { useMutation, useQuery } from "react-query";
import {
  UseMutationOptions,
  UseQueryOptions,
} from "react-query/types/react/types";
import { API_BASE_URL } from "../helpers/config.helper";
import { fetchJson } from "../helpers/fetch.helper";

const USER_BASE_URL = `${API_BASE_URL}/users`;

export interface UserDto {
  id: number;
  username: string;
  email: string;
  password: string;
  admin: boolean;
}

const updateUser = async (userDto: UserDto): Promise<UserDto> => {
  return fetchJson<UserDto>({
    path: USER_BASE_URL,
    method: "PUT",
    secure: true,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userDto),
  });
};

const getAll = async (): Promise<UserDto[]> => {
  return fetchJson<UserDto[]>({
    path: USER_BASE_URL,
    secure: true,
  });
};

const deleteOne = async (id: number): Promise<UserDto> => {
  return fetchJson<UserDto>({
    path: `${USER_BASE_URL}/${id}`,
    method: "DELETE",
    secure: true,
  });
};

const getOne = async (id: number): Promise<UserDto> => {
  return fetchJson<UserDto>({
    path: `${USER_BASE_URL}/${id}`,
    secure: true,
  });
};

const updateById = async (payload: UserDto): Promise<UserDto> => {
  return fetchJson<UserDto>({
    path: `${USER_BASE_URL}/${payload.id}`,
    method: "PUT",
    secure: true,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};

const addOne = async (payload: UserDto): Promise<UserDto> => {
  return fetchJson<UserDto>({
    path: USER_BASE_URL,
    method: "POST",
    secure: true,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};

export const useUpdateUser = (
  options?: UseMutationOptions<UserDto, Error, UserDto>,
) => {
  return useMutation<UserDto, Error, UserDto>(updateUser, options);
};

export const useUsers = (options?: UseQueryOptions<UserDto[], Error>) => {
  return useQuery<UserDto[], Error>("getUsers", getAll, options);
};

export const useDeleteUser = (
  options?: UseMutationOptions<UserDto, Error, number>,
) => {
  return useMutation<UserDto, Error, number>(deleteOne, options);
};

export const useGetUser = (
  id: number,
  options?: UseQueryOptions<UserDto, Error>,
) => {
  return useQuery<UserDto, Error>(["getUser", id], () => getOne(id), options);
};

export const useUpdateUserById = (
  options?: UseMutationOptions<UserDto, Error, UserDto>,
) => {
  return useMutation<UserDto, Error, UserDto>(updateById, options);
};

export const useCreateUser = (
  options?: UseMutationOptions<UserDto, Error, UserDto>,
) => {
  return useMutation<UserDto, Error, UserDto>(addOne, options);
};
