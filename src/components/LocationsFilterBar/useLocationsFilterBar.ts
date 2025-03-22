import { getOperationValue } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

import { z } from "zod";

const schema = z.object({
  locationTypeId: z.string().optional(),
  locationTypeCode: z.string().optional(),
  locationCode: z.string().optional(),
  locationGroupId: z.string().optional(),
  locationGroupCode: z.string().optional(),
  integrationCode: z.string().optional(),
  integrationCode2: z.string().optional(),
  isOperation: z.boolean().nullable(),
});

export type FormFields = z.infer<typeof schema>;

export const useLocationsFilterBar = () => {
  const router = useRouter();
  const params = useSearchParams();
  const methods = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      locationTypeId: params.get("locationTypeId") || "",
      locationTypeCode: params.get("locationTypeCode") || "",
      locationCode: params.get("locationCode") || "",
      locationGroupId: params.get("locationGroupId") || "",
      locationGroupCode: params.get("locationGroupCode") || "",
      integrationCode: params.get("integrationCode") || "",
      integrationCode2: params.get("integrationCode2") || "",
      isOperation: getOperationValue(params.get("isOperation")),
    },
  });

  const onSubmit = (data: FormFields) => {
    const params = new URLSearchParams();
    let hasValues = false;

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        if (key === "isOperation" && value !== null) {
          params.append(key, String(value));
          hasValues = true;
        } else if (typeof value === "string" && value.trim() !== "") {
          params.append(key, value);
          hasValues = true;
        }
      }
    });

    if (!hasValues) {
      params.append("submitted", "true");
    }

    router.push(`/locations?${params.toString()}`);
  };

  const onClearParams = () => {
    methods.reset({});
    router.push("/locations");
    setTimeout(() => window.location.reload(), 500);
  };

  return {
    methods,
    onClearParams,
    onSubmit: methods.handleSubmit(onSubmit),
  };
};
