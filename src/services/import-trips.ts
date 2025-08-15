import {
  ImportGtmFilterParams,
  ImportGtm,
  ImportGtms,
  ImportGtmsResponse,
} from "@/interfaces/import-trips";
import axios from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

interface ImportedGtm {
  tripGTMS: ImportGtms & { fileName?: string };
  tripGTMSDetails: ImportGtm[];
}

export const fetchAllGtms = async ({
  args,
}: {
  args: ImportGtmFilterParams;
}): Promise<ImportGtmsResponse> => {
  const params = {
    startDate: args.startDate,
    endDate: args.endDate,
    locationGroupCode: args.locationGroupCode,
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

export const fetchGtmById = async ({ id }: { id: string }) => {
  try {
    const response = await axios.get(`/GetGTMS/?Id=${id}`);
    const data = response.data;
    return data as ImportedGtm;
  } catch (error) {
    console.error(error);
    throw new Error((error as Error)?.message);
  }
};
