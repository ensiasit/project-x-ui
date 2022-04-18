import { useMutation, useQuery } from "react-query";
import {
  UseMutationOptions,
  UseQueryOptions,
} from "react-query/types/react/types";
import { DateTime } from "luxon";
import { API_BASE_URL } from "../helpers/config.helper";
import { Role } from "./security.service";
import { fetchJson } from "../helpers/fetch.helper";

const CONTESTS_BASE_URL = `${API_BASE_URL}/contests`;

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

export const useDeleteContest = () => {
  return useMutation<ContestDto, Error, number>(deleteContest);
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
