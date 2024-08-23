import useSWR from "swr";
import { fetchImportTrips } from "@/services/import-trips";
import { useSearchParams } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetch } from "../useFetch";
import { useToast } from "../useToast";

const schema = z.object({
  Locationcode: z.string().min(1, {
    message: "Obrigatório*",
  }),
  File: z.custom<FileList>((value) => value instanceof FileList, {
    message: "Must be a file",
  }),
});

type ImportTripsForm = z.infer<typeof schema>;

export const useImportTrips = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [postFile, { error: postError, loading: loadingPostFile }] = useFetch();
  const { addToast } = useToast();

  const formMethods = useForm<ImportTripsForm>({
    resolver: zodResolver(schema),
  });

  const searchParams = useSearchParams();
  const params = {
    startDate: searchParams.get("startDate"),
    endDate: searchParams.get("endDate"),
  };

  const hasParamsToSearch = Boolean(Object.entries(params).length);

  const { data, error, isLoading, mutate, isValidating } = useSWR(
    {
      url: "/import-trips",
      args: params,
    },
    fetchImportTrips,
  );

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
  };

  const onSubmit = async (data: ImportTripsForm) => {
    const body = {
      File: data.File[0],
      Locationcode: data.Locationcode,
    };
    console.log(body);
    await postFile("/importGTMS", body, {
      headers: { "Content-Type": "multipart/form-data" },
      onSuccess: () => {
        addToast("Arquivo enviado com sucesso!", { type: "success" });
        handleClearFile();
      },
      onError: () => {
        addToast("Falha ao enviar arquivo" + postError, { type: "error" });
      },
    });
  };

  const currentFile = selectedFile?.name;

  return {
    data,
    error,
    isLoading,
    mutate,
    isValidating,
    handleFileChange,
    formMethods,
    selectedFile,
    currentFile,
    hasParamsToSearch,
    handleClearFile,
    loadingPostFile,
    onSubmit,
  };
};
