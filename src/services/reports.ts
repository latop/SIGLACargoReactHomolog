import { ReportsResponse } from "@/interfaces/reports";
import axios from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchReports(): Promise<ReportsResponse[]> {
  try {
    const response = await axios.get("/api/Report/GetReports");
    const data = response.data;
    return data;
  } catch (error) {
    throw new Error((error as Error)?.message);
  }
}
export async function fetchReportsDownload(
  body: object,
): Promise<{ blob: Blob; filename: string }> {
  try {
    const response = await axios.post("/api/Report/Report", body, {
      responseType: "blob",
      headers: {
        "access-control-expose-headers": "x-pagination",
      },
      onDownloadProgress: (progressEvent) => {
        console.log(
          "Download progress: " +
            Math.round(
              (progressEvent.loaded / (progressEvent.total ?? 1)) * 100,
            ) +
            "%",
        );
      },
    });

    const contentDisposition = response?.headers["content-disposition"];
    let filename = "report.xlsx";
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="(.+)"/);
      if (match && match[1]) {
        filename = match[1];
      }
    }

    return {
      blob: response.data,
      filename,
    };
  } catch (error) {
    console.error(error);
    throw new Error((error as Error)?.message);
  }
}
