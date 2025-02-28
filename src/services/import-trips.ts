import {
  FetchImportTripsParams,
  ImportTripsResponses,
} from "@/interfaces/import-trips";
import axios from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

export const fetchImportTrips = async ({
  args,
}: {
  args: FetchImportTripsParams;
}): Promise<ImportTripsResponses> => {
  const params = {
    startDate: args.startDate,
    endDate: args.endDate,
  };

  try {
    const response = await axios.get("/GetAllGTMS", { params });
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    throw new Error((error as Error)?.message);
  }
};
