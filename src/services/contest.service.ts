import { useMutation, useQuery } from "react-query";
import {
  UseMutationOptions,
  UseQueryOptions,
} from "react-query/types/react/types";
import { DateTime } from "luxon";
import { API_BASE_URL } from "../helpers/config.helper";
import { Role } from "./security.service";
import { fetchJson } from "../helpers/fetch.helper";
import { UserDto } from "./user.service";

const CONTESTS_BASE_URL = `${API_BASE_URL}/contests`;

const CURRENT_CONTEST_LOCAL_STORAGE_KEY = "CURRENT_CONTEST_LOCAL_STORAGE_KEY";

export interface ContestDto {
  id: number;
  name: string;
  startTime: DateTime;
  endTime: DateTime;
  freezeTime: DateTime;
  unfreezeTime: DateTime;
  publicScoreboard: boolean;
}

const getContests = async (): Promise<ContestDto[]> => {
  return fetchJson<ContestDto[]>({ path: CONTESTS_BASE_URL });
};

export const useGetContests = (
  options?: UseQueryOptions<ContestDto[], Error>,
) => {
  return useQuery<ContestDto[], Error>("getContests", getContests, options);
};

export interface UserContestRole {
  role: Role;
  user: UserDto;
  contest: ContestDto;
}

const getUserContests = async (): Promise<UserContestRole[]> => {
  return fetchJson<UserContestRole[]>({
    path: `${CONTESTS_BASE_URL}/current`,
    secure: true,
  });
};

export const useGetUserContests = (
  options?: UseQueryOptions<UserContestRole[], Error>,
) => {
  return useQuery<UserContestRole[], Error>(
    "getUserContests",
    getUserContests,
    options,
  );
};

const createContest = async (contestDto: ContestDto): Promise<ContestDto> => {
  return fetchJson<ContestDto>({
    path: `${CONTESTS_BASE_URL}`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    secure: true,
    body: JSON.stringify(contestDto),
  });
};

export const useCreateContest = (
  options?: UseMutationOptions<ContestDto, Error, ContestDto>,
) => {
  return useMutation<ContestDto, Error, ContestDto>(createContest, options);
};

const deleteContest = async (id: number): Promise<ContestDto> => {
  return fetchJson<ContestDto>({
    path: `${CONTESTS_BASE_URL}/${id}`,
    method: "DELETE",
    secure: true,
  });
};

export const useDeleteContest = (
  options?: UseMutationOptions<ContestDto, Error, number>,
) => {
  return useMutation<ContestDto, Error, number>(deleteContest, options);
};

const getContest = async (contestId: number): Promise<ContestDto> => {
  return fetchJson<ContestDto>({
    path: `${CONTESTS_BASE_URL}/${contestId}`,
    secure: true,
  });
};

export const useGetContest = (
  contestId: number,
  options?: UseQueryOptions<ContestDto, Error>,
) => {
  return useQuery<ContestDto, Error>(
    ["getContest", contestId],
    () => getContest(contestId),
    options,
  );
};

const updateContest = async (contestDto: ContestDto): Promise<ContestDto> => {
  return fetchJson<ContestDto>({
    path: `${CONTESTS_BASE_URL}/${contestDto.id}`,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    secure: true,
    body: JSON.stringify(contestDto),
  });
};

export const useUpdateContest = (
  options?: UseMutationOptions<ContestDto, Error, ContestDto>,
) => {
  return useMutation<ContestDto, Error, ContestDto>(
    (contestDto: ContestDto) => updateContest(contestDto),
    options,
  );
};

const getContestUsers = async (id: number): Promise<UserContestRole[]> => {
  return fetchJson<UserContestRole[]>({
    path: `${CONTESTS_BASE_URL}/${id}/users`,
    secure: true,
  });
};

export const useContestUsers = (
  id: number,
  options?: UseQueryOptions<UserContestRole[], Error>,
) => {
  return useQuery<UserContestRole[], Error>(
    ["getContestUsers", id],
    () => getContestUsers(id),
    options,
  );
};

interface UpdateUserContestRoleProps {
  contestId: number;
  userId: number;
  role: Role;
}

const updateUserContestRole = async ({
  contestId,
  userId,
  role,
}: UpdateUserContestRoleProps): Promise<UserContestRole> => {
  return fetchJson<UserContestRole>({
    path: `${CONTESTS_BASE_URL}/${contestId}/users/${userId}/${role}`,
    method: "PUT",
    secure: true,
  });
};

export const useUpdateUserContestRole = (
  options?: UseMutationOptions<
    UserContestRole,
    Error,
    UpdateUserContestRoleProps
  >,
) => {
  return useMutation<UserContestRole, Error, UpdateUserContestRoleProps>(
    updateUserContestRole,
    options,
  );
};

export const getLocalStorageCurrentContest = (): UserContestRole | null => {
  if (localStorage.getItem(CURRENT_CONTEST_LOCAL_STORAGE_KEY) === null) {
    return null;
  }

  return JSON.parse(
    localStorage.getItem(CURRENT_CONTEST_LOCAL_STORAGE_KEY) as string,
  );
};

export const setLocalStorageCurrentContest = (
  contestRole: UserContestRole | null,
) => {
  if (contestRole === null) {
    localStorage.removeItem(CURRENT_CONTEST_LOCAL_STORAGE_KEY);
  } else {
    localStorage.setItem(
      CURRENT_CONTEST_LOCAL_STORAGE_KEY,
      JSON.stringify(contestRole),
    );
  }
};
