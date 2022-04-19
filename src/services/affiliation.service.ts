import { useMutation, useQuery } from "react-query";
import {
  UseMutationOptions,
  UseQueryOptions,
} from "react-query/types/react/types";
import { API_BASE_URL } from "../helpers/config.helper";
import { fetchJson } from "../helpers/fetch.helper";

export const AFFILIATION_BASE_URL = `${API_BASE_URL}/affiliations`;

interface AffiliationRequest {
  id: number;
  name: string;
  country: string;
  logo: File | null;
}

interface AffiliationResponse {
  id: number;
  name: string;
  country: string;
  logo: Uint8Array;
}

const getAll = (): Promise<AffiliationResponse[]> => {
  return fetchJson<AffiliationResponse[]>({ path: AFFILIATION_BASE_URL });
};

const getOne = (id: number): Promise<AffiliationResponse> => {
  return fetchJson<AffiliationResponse>({
    path: `${AFFILIATION_BASE_URL}/${id}`,
    secure: true,
  });
};

const deleteOne = (id: number): Promise<AffiliationResponse> => {
  return fetchJson<AffiliationResponse>({
    path: `${AFFILIATION_BASE_URL}/${id}`,
    method: "DELETE",
    secure: true,
  });
};

const postOne = (payload: AffiliationRequest): Promise<AffiliationResponse> => {
  const formData = new FormData();

  Object.entries(payload)
    .filter(([_key, value]) => !!value)
    .forEach(([key, value]) => formData.append(key, value));

  return fetchJson<AffiliationResponse>({
    path: AFFILIATION_BASE_URL,
    method: "POST",
    secure: true,
    body: formData,
  });
};

const updateOne = (
  payload: AffiliationRequest,
): Promise<AffiliationResponse> => {
  const formData = new FormData();

  Object.entries(payload)
    .filter(([_key, value]) => !!value)
    .forEach(([key, value]) => formData.append(key, value));

  return fetchJson<AffiliationResponse>({
    path: `${AFFILIATION_BASE_URL}/${payload.id}`,
    method: "PUT",
    secure: true,
    body: formData,
  });
};

export const useGetAffiliations = (
  options?: UseQueryOptions<AffiliationResponse[], Error>,
) => {
  return useQuery<AffiliationResponse[], Error>(
    "getAffiliations",
    getAll,
    options,
  );
};

export const useGetAffiliation = (
  id: number,
  options?: UseQueryOptions<AffiliationResponse, Error>,
) => {
  return useQuery<AffiliationResponse, Error>(
    ["getAffiliation", id],
    () => getOne(id),
    options,
  );
};

export const useDeleteAffiliation = (
  options?: UseMutationOptions<AffiliationResponse, Error, number>,
) => {
  return useMutation<AffiliationResponse, Error, number>(
    "deleteAffiliation",
    deleteOne,
    options,
  );
};

export const useCreateAffiliation = (
  options?: UseMutationOptions<AffiliationResponse, Error, AffiliationRequest>,
) => {
  return useMutation<AffiliationResponse, Error, AffiliationRequest>(
    postOne,
    options,
  );
};

export const useUpdateAffiliation = (
  options?: UseMutationOptions<AffiliationResponse, Error, AffiliationRequest>,
) => {
  return useMutation<AffiliationResponse, Error, AffiliationRequest>(
    updateOne,
    options,
  );
};
