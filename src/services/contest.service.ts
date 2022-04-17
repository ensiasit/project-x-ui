import { useQuery } from "react-query";
import { UseQueryOptions } from "react-query/types/react/types";
import { API_BASE_URL } from "./config.service";
import { getToken, Role } from "./security.service";

const CONTESTS_BASE_URL = `${API_BASE_URL}/contests`;

export interface ContestDto {
  id: number;
  name: string;
}

const getContests = async (): Promise<ContestDto[]> => {
  const response = await fetch(CONTESTS_BASE_URL);
  const responseJson = await response.json();

  if (response.status >= 400) {
    throw new Error(responseJson.message);
  }

  return responseJson;
};

export const useGetContests = () => {
  return useQuery<ContestDto[], Error>("getContests", getContests);
};

interface UserContestRole {
  role: Role;
  contest: ContestDto;
}

const getUserContests = async (): Promise<UserContestRole> => {
  const token = getToken();

  if (!token) {
    throw new Error("No token available");
  }

  const response = await fetch(`${CONTESTS_BASE_URL}/current`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const responseJson = await response.json();

  if (response.status >= 400) {
    throw new Error(responseJson.message);
  }

  return responseJson;
};

export const useGetUserContests = (
  options?: Omit<
    UseQueryOptions<UserContestRole, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<UserContestRole, Error>("getUserContests", getUserContests, {
    ...options,
  });
};
