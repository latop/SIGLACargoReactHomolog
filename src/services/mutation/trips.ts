import { useMutation } from "@tanstack/react-query";
import api from "../configs/api";
import { queryClient } from "../configs/provider";

export const useDeleteLocationMution = () => {
  return useMutation({
    mutationKey: ["locations"],
    mutationFn: async (id: string) => {
      await api.delete(`/Location/${id}`);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["locations"],
      });
    },
  });
};

export const useCreateLocationMution = () => {
  return useMutation({
    mutationKey: ["locations"],
    mutationFn: async (data: unknown) => {
      await api.post(`/Location`, data);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["locations"],
      });
    },
  });
};

export const useEditLocationMution = () => {
  return useMutation({
    mutationKey: ["locations"],
    mutationFn: async (data: unknown) => {
      await api.put(`/Location`, data);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["locations"],
      });
    },
  });
};
