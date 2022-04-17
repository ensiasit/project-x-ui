import { useQuery } from "react-query";
import { UseQueryOptions } from "react-query/types/react/types";
import { API_BASE_URL } from "../helpers/config.helper";
import { Role } from "./security.service";
import { fetchJson } from "../helpers/fetch.helper";

const CONTESTS_BASE_URL = `${API_BASE_URL}/contests`;

export interface ContestDto {
  id: number;
  name: string;
}

const getContests = async (): Promise<ContestDto[]> => {
  return fetchJson<ContestDto[]>({ path: CONTESTS_BASE_URL });
};

export const useGetContests = (
  options?: Omit<UseQueryOptions<ContestDto[], Error>, "queryKey" | "queryFn">,
) => {
  return useQuery<ContestDto[], Error>("getContests", getContests, options);
};

interface UserContestRole {
  role: Role;
  contest: ContestDto;
}

const getUserContests = async (): Promise<UserContestRole> => {
  return fetchJson<UserContestRole>({
    path: `${CONTESTS_BASE_URL}/current`,
    secure: true,
  });
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
