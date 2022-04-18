import { useMutation } from "react-query";
import { API_BASE_URL } from "../helpers/config.helper";
import { fetchJson } from "../helpers/fetch.helper";

const USER_BASE_URL = `${API_BASE_URL}/users`;

export interface UserDto {
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

export const useUpdateUser = () => {
  return useMutation<UserDto, Error, UserDto>(updateUser);
};
