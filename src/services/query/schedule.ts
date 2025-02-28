import { QueryOptions, useQuery, QueryClient } from "@tanstack/react-query";
import api from "../configs/api";

type GetPublishJourneyParams = {
  dtPublish: string;
  LocationGroupId: string;
  options?: QueryOptions & QueryClient;
};

export const useGetPublishJourneyQuery = ({
  dtPublish,
  LocationGroupId,
  options,
}: GetPublishJourneyParams) => {
  return useQuery({
    queryKey: ["publish_journey", dtPublish, LocationGroupId],
    queryFn: async () => {
      try {
        const response = await api.get("/Journey/PublishJourney", {
          params: {
            dtPublish,
            LocationGroupId,
          },
        });
        return response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes in milliseconds,
    ...options,
  });
};
