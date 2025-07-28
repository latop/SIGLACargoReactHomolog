"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/pt-br";
import { useFetch } from "../useFetch";
import { useDialog } from "../useDialog/useDialog";
import { useToast } from "../useToast";
import { Box, Button } from "@mui/material";

dayjs.extend(customParseFormat);

type FormFields = {
  locationGroupId: string;
  dtPublish?: Dayjs | null | undefined;
};

const dateOrDayjsSchema = z
  .union([
    z.instanceof(Date),
    z.custom((val) => dayjs.isDayjs(val), { message: "Invalid date format" }),
  ])
  .or(z.string().optional());

const schema = z.object({
  dtPublish: dateOrDayjsSchema.optional(),
  locationGroupId: z.string().min(1, "*Obrigatório").optional(),
});

export function usePublishJourneyFilterBar() {
  const [getPublishJourney, { loading: isLoading }] = useFetch();

  const methods = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      dtPublish: dayjs(),
    },
  });

  const { openDialog, closeDialog } = useDialog();
  const { addToast } = useToast();

  const onSubmit = async (data: FormFields) => {
    const params = {
      dtPublish: data.dtPublish?.format("YYYY-MM-DD"),
      LocationGroupId: data.locationGroupId,
    };

    if (!data.locationGroupId?.length) {
      methods.setError("locationGroupId", {
        type: "min",
        message: "*Obrigatório",
      });
      return;
    }

    return await getPublishJourney("/Journey/PublishJourney", params, {
      method: "get",
      onSuccess: (publishJourney) => {
        openDialog({
          title: "Publicação",
          body: (
            <Box
              display="flex"
              alignItems="flex-end"
              justifyContent="flex-end"
              flexDirection="column"
              gap="16px"
            >
              {publishJourney?.data as string}
              <Button onClick={closeDialog} variant="contained">
                Fechar
              </Button>
            </Box>
          ),
        });
      },
      onError: (error) => {
        console.error(error);
        closeDialog();
        addToast("Erro ao publicar viagem", { type: "error" });
      },
    });
  };

  return {
    methods,
    onSubmit,
    isLoading,
  };
}
