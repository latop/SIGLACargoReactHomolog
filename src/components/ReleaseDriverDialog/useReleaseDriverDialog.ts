import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useReleaseDriver } from "@/hooks/useReleaseDriver/useReleaseDriver";
import { ReleaseDriverInterface } from "@/interfaces/release-driver";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export function useReleaseDriverDialog() {
  const [hash] = useHash();
  const [create] = useFetch();

  const match = (hash as string)?.match(/#releaseDriverId-(.+)/);
  const releaseDriverId = match?.[1];

  const { drivers, isLoading, error, mutate } = useReleaseDriver();

  const loading = isLoading && !error;

  const driverAndTruckToRelase = drivers.find(
    (driver) => driver.dailyTripSectionId === releaseDriverId,
  );

  const methods = useForm();

  const updateReleaseDriver = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body: any,
    options?: {
      onSuccess?: () => void;
      onError?: () => void;
    },
  ) => {
    return create("/Journey/ReleaseDriverCheck", body, {
      onSuccess: options?.onSuccess,
      onError: options?.onError,
    });
  };

  const normalizeData = (data: ReleaseDriverInterface) => {
    const defaultValues = {
      saida: data?.saida,
      entrega: data?.entrega,
      demanda: data?.demanda,
      destino: data?.destino,
      motoristaPlan: data?.motoristaPlan,
      veiculoPlan: data?.veiculoPlan,
      motoristaLiberado: data?.motoristaLiberado,
      veiculoLiberado: data?.veiculoLiberado,
      dtCheckList: dayjs().format(),
      mdfe: data?.mdfe,
      cte: data?.cte,
      obs: data?.obs,
      presentationDate: data?.presentationDate,
      issueDate: data?.issueDate,
      issueResponsible: data?.issueResponsible,
      palletInvoice: data?.palletInvoice,
      productInvoice: data?.productInvoice,
      isReturnLoaded: data?.isReturnLoaded,
      licensePlateTrailer: data?.licensePlateTrailer,
    };
    return defaultValues;
  };

  useEffect(() => {
    if (driverAndTruckToRelase) {
      // eslint-disable-next-line react-hooks/exhaustive-deps, @typescript-eslint/ban-ts-comment
      // @ts-ignore
      methods.reset(normalizeData(driverAndTruckToRelase));
    }
  }, [driverAndTruckToRelase]);

  return {
    releaseDriverId,
    methods,
    driverAndTruckToRelase,
    loading,
    updateReleaseDriver,
    mutate,
    drivers,
  };
}
