/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { fetchReportsDownload } from "@/services/reports";
import { FieldValues, useForm } from "react-hook-form";

import axios from "axios";

import { useToast } from "@/hooks/useToast";
import dayjs from "dayjs";
import { ReportsResponse } from "@/interfaces/reports";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

export const useReportDynamicForm = (data: ReportsResponse) => {
  const { addToast } = useToast();
  const [isDownloadAvailable, setDownloadAvailable] =
    React.useState<boolean>(false);
  const [blobFile, setBlobFile] = React.useState<Blob>();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const methods = useForm();

  const onSubmit = async (data: FieldValues) => {
    const parameter = Object.entries(data)
      .map(([key, value]) => {
        if (key.includes("reportCode")) return;
        return value;
      })
      .filter((value) => value != undefined || value != null || value == "");
    const body = {
      reportCode: data.reportCode,
      parameter,
      fileType: "XLS",
    };
    await getReport(body);
  };

  const getReport = async (body: any) => {
    setIsLoading(true);

    try {
      const { blob } = await fetchReportsDownload(body);
      setDownloadAvailable(true);
      setBlobFile(blob);

      if (blobFile) return;
      addToast("Relatório pronto para download", { type: "success" });
    } catch (error) {
      console.log(error);
      addToast(`${(error as Error).message}`, { type: "error" });
      setDownloadAvailable(false);
    } finally {
      setIsLoading(false);
    }
  };
  const handleDownload = (index: string) => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blobFile as Blob);

    const filename = `Report_${data.code}_${dayjs().format(
      "YYYYMMDDHHmm",
    )}.xlsx`;

    link.setAttribute("download", filename as string);
    const downloadReport = document.getElementById(`downloadReport-${index}`);
    downloadReport?.appendChild(link);
    link.click();
    downloadReport?.removeChild(link);
  };

  const isFileAvailable = !isLoading && isDownloadAvailable;

  return {
    methods,
    onSubmit,
    isFileAvailable,
    handleDownload,
    isLoading,
  };
};
