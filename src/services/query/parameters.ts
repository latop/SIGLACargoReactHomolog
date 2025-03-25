import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import api from "../configs/api";

export interface Timezone {
  code: string;
  description: string;
  id: string;
}

export const useTimezoneQuery = (
  options?: UseQueryOptions<Timezone[], Error>,
) => {
  return useQuery<Timezone[]>({
    queryKey: ["timezone"],
    queryFn: async () => {
      try {
        const {
          data: { data },
        } = await api.get("/Timezone");

        return data;
      } catch (error) {
        console.error(error);
        return error;
      }
    },
    staleTime: 0,
    ...options,
  });
};

export interface JustificationResponse {
  code: string;
  description: string;
  responsibleSectorId: string;
  type: string;
  id: string;
  createAt: string;
  updateAt: string;
  userIdCreate: string;
  userIdUpdate: string;
}

export const useJustificationQuery = () => {
  return useQuery<JustificationResponse[]>({
    queryKey: ["justification"],
    queryFn: async () => {
      try {
        const {
          data: { data },
        } = await api.get("/Justification?perPage=1000");

        return data;
      } catch (error) {
        console.error(error);
        return error;
      }
    },
    staleTime: 0,
  });
};
