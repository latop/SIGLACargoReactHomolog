import { useHash } from "@/hooks/useHash";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

import { z } from "zod";

const CitiesFilterBarSchema = z.object({
  name: z.string().optional(),
  stateId: z.string().optional(),
  stateCode: z.string().optional(),
  stateName: z.string().optional(),
  cityName: z.string().optional(),
});

export type CitiesFilterBarType = z.infer<typeof CitiesFilterBarSchema>;

export const useCitiesFilterBar = () => {
  const [, setHash] = useHash();
  const router = useRouter();
  const params = useSearchParams();

  const methods = useForm<CitiesFilterBarType>({
    resolver: zodResolver(CitiesFilterBarSchema),
    defaultValues: {
      stateCode: params.get("stateCode") || "",
      stateId: params.get("stateId") || "",
      name: params.get("name") || "",
      stateName: params.get("stateName") || "",
      cityName: params.get("cityName") || "",
    },
  });

  const onSubmit = (data: CitiesFilterBarType) => {
    const params = new URLSearchParams();
    let hasValues = false;

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        if (
          typeof value === "string" &&
          value.trim() !== "" &&
          value !== "undefined"
        ) {
          params.append(key, value);
          hasValues = true;
        }
      }
    });

    if (!hasValues) {
      params.append("submitted", "true");
    }

    router.push(`/city?${params.toString()}`);
  };

  const onClearParams = () => {
    methods.reset({});
    router.push(`/city`);
    setTimeout(() => window.location.reload(), 500);
  };

  const handleAddCity = () => {
    setHash("#add-city");
  };

  return {
    methods,
    onClearParams,
    handleAddCity,
    onSubmit: methods.handleSubmit(onSubmit),
  };
};
