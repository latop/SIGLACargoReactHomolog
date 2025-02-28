"use client";

import { useGetPublishJourneyQuery } from "@/services/query/schedule";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useDialog } from "../useDialog/useDialog";
import { Box, CircularProgress } from "@mui/material";
import { useToast } from "../useToast";

export const usePublishJourney = () => {
  const params = useSearchParams();
  const publishJourney = useGetPublishJourneyQuery({
    dtPublish: params.get("dtPublish")
      ? dayjs(params.get("dtPublish")).format("YYYY-MM-DD")
      : dayjs().format("YYYY-MM-DD"),
    LocationGroupId: params.get("locationGroupId") || "",
  });

  const { openDialog, closeDialog } = useDialog();
  const { addToast } = useToast();

  useEffect(() => {
    if (publishJourney.isLoading) {
      openDialog({
        title: "Publicacão",
        body: (
          <Box display="flex" alignItems="center" justifyContent="center">
            <CircularProgress />
          </Box>
        ),
      });
      return;
    }
    if (publishJourney.isSuccess) {
      openDialog({
        title: "Publicacão",
        body: (
          <Box display="flex" alignItems="center" justifyContent="center">
            {publishJourney?.data as string}
          </Box>
        ),
        onConfirm: () => {
          closeDialog();
        },
        onCancel: () => {
          closeDialog();
        },
      });
      return;
    }

    if (publishJourney.isError) {
      closeDialog();
      addToast("Erro ao publicar viagem", { type: "error" });
    }
  }, [publishJourney.status, publishJourney.isLoading, publishJourney.isError]);

  return {
    ...publishJourney,
  };
};
