import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import dayjs, { Dayjs } from "dayjs";

type FormFields = {
  nickName?: string;
  integrationCode?: string;
  admission: Dayjs | null | string;
  registration?: string;
  positionId?: string;
  fleetGroupId?: string;
  locationGroupId?: string;
};

const schema = z.object({
  nickName: z.string().optional(),
  integrationCode: z.string().optional(),
  admission: z.coerce.string().optional(),
  registration: z.string().optional(),
  positionId: z.string().optional(),
  fleetGroupId: z.string().optional(),
  locationGroupId: z.string().optional(),
});

export function useDriversFilterBar() {
  const router = useRouter();
  const params = useSearchParams();
  const defaultValues: FormFields = {
    admission: params.get("admission")
      ? dayjs(params.get("admission"))
      : dayjs(),
    integrationCode: params.get("integrationCode") || "",
    nickName: params.get("nickName") || "",
    registration: params.get("registration") || undefined,
    fleetGroupId: params.get("fleetGroupId") || undefined,
    locationGroupId: params.get("locationGroupId") || undefined,
    positionId: params.get("positionId") || undefined,
  };

  const methods = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = (data: FieldValues) => {
    const params = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      if (value === "Invalid Date") return params.append("admission", "");
      if (value) {
        params.append(key, value);
      }
    });
    router.push(`/drivers?${params.toString()}`);
  };

  const onClearParams = () => {
    methods.reset({
      admission: dayjs(),
      integrationCode: "",
      nickName: "",
      registration: "",
      fleetGroupId: "",
      locationGroupId: "",
      positionId: "",
    });
    router.push(`/drivers`);
    setTimeout(() => window.location.reload(), 500);
  };

  return {
    methods,
    onSubmit: methods.handleSubmit(onSubmit),
    onClearParams,
  };
}
