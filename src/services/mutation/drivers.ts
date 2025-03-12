import { useMutation } from "@tanstack/react-query";
import api from "../configs/api";
import { queryClient } from "../configs/provider";

const resource = "/Drivers";

interface DriverReleaseMutationPayload {
  driverRequestId: string;
  flgStatus: string;
}
export const useDriverReleaseMutation = () => {
  return useMutation({
    mutationFn: async (payload: DriverReleaseMutationPayload) => {
      console.log(payload);

      try {
        const response = await api.post(`${resource}/driverrequeststatus`, {
          driverRequestId: payload.driverRequestId,
          flgStatus: payload.flgStatus,
        });
        console.log("response", response);
        return response.data;
      } catch (error) {
        console.error(error);
        return error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["driver-request"] });
    },
  });
};
