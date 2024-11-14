import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useToast } from "@/hooks/useToast";
import { Driver } from "@/interfaces/driver";
import { fetchDriverById } from "@/services/drivers";
import { FieldValues, useForm } from "react-hook-form";
import useSWR from "swr";

export function useDriverDialog() {
  const [hash] = useHash();
  const isToAddDriverToAdd = !!(hash as string)?.match(/#add-driver/)?.[0];
  const driverToUpdate = (hash as string)?.match(/#driver-id-(.+)/);
  const driverId = driverToUpdate?.[1];

  const getKey = () => {
    if (!driverId || isToAddDriverToAdd) return null;
    return {
      id: driverId,
      url: "/Driver",
    };
  };

  const { data: driverData, isLoading: isLoadingDriver } = useSWR<Driver>(
    getKey,
    fetchDriverById,
    {
      onSuccess: (data) => {
        if (isToAddDriverToAdd) return;
        methods.reset(getDefaultValues(data, driverId));
      },
    },
  );

  const getDefaultValues = (
    data: Driver | undefined,
    driverId: string | undefined,
  ) => {
    const mapWithDriverId = (items: object[] | undefined) =>
      items?.map((item) => ({ ...item, driverId }));

    return {
      ...data,
      driverAttributions: mapWithDriverId(data?.driverAttributions) ?? [],
      driverBases: mapWithDriverId(data?.driverBases) ?? [],
      driverFleets: mapWithDriverId(data?.driverFleets) ?? [],
      driverPositions: mapWithDriverId(data?.driverPositions) ?? [],
      driverVacations: mapWithDriverId(data?.driverVacations) ?? [],
    };
  };

  const methods = useForm<Driver>({
    defaultValues: getDefaultValues(driverData, driverId),
  });
  console.log(methods.getValues());
  const { addToast } = useToast();
  const [handleFetch, { loading: loadingCreate }] = useFetch();
  const [, setHash] = useHash();

  const handleUpdateDriver = async (data: FieldValues, body: FieldValues) => {
    await handleFetch("/updatedriver", body, {
      onSuccess: () => {
        addToast("Motorista atualizado com sucesso!", { type: "success" });
        setHash("");
        methods.reset({});
      },
      onError: (error) => addToast(error.message, { type: "error" }),
    });
  };

  const handleAddDriver = async (data: FieldValues, body: FieldValues) => {
    await handleFetch("/Driver", body, {
      onSuccess: () => {
        addToast("Motorista adicionado com sucesso!", { type: "success" });
        setHash("");
        methods.reset({});
      },
      onError: (error) => addToast(error.message, { type: "error" }),
    });
  };

  const handleSubmit = async (data: FieldValues) => {
    const body = {};

    if (!isToAddDriverToAdd && !!driverId) {
      await handleUpdateDriver(data, body);
      return;
    }
    await handleAddDriver(data, body);
  };

  return {
    methods,
    handleSubmit,
    loadingCreate,
    isLoadingDriver: isLoadingDriver && !driverData,
    isToAddDriverToAdd,
    isToUpdateDriver: !!driverId,
    driverData,
    driverId,
  };
}
