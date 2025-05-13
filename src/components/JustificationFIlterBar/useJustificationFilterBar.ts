import { useHash } from "@/hooks/useHash";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

import { z } from "zod";

const justificationFilterBarSchema = z.object({
  code: z.string().optional(),
  type: z.string().optional(),
  responsibleSectorId: z.string().optional(),
  responsibleSectorDescription: z.string().optional(),
  submitted: z.enum(["true", "false"]).optional(),
});

export type JustificationFilterBarsType = z.infer<
  typeof justificationFilterBarSchema
>;

export const useJustificationFilterBar = () => {
  const [, setHash] = useHash();
  const router = useRouter();
  const params = useSearchParams();
  const methods = useForm<JustificationFilterBarsType>({
    resolver: zodResolver(justificationFilterBarSchema),
    defaultValues: {
      code: params.get("code") || "",
      type: params.get("type") || "",
      responsibleSectorId: params.get("responsibleSectorId") || "",
      responsibleSectorDescription:
        params.get("responsibleSectorDescription") || "",
    },
  });

  const onSubmit = (data: JustificationFilterBarsType) => {
    const params = new URLSearchParams();
    let hasValues = false;

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        if (typeof value === "string" && value.trim() !== "") {
          params.append(key, value);
          hasValues = true;
        }
      }
    });

    if (!hasValues) {
      params.append("submitted", "true");
    }

    router.push(`/justification?${params.toString()}`);
  };

  const onClearParams = () => {
    methods.reset({});
    router.push("/justification");
    setTimeout(() => window.location.reload(), 500);
  };

  const handleAddJustification = () => {
    setHash("#add-justifications");
  };

  return {
    methods,
    onClearParams,
    handleAddJustification,
    onSubmit: methods.handleSubmit(onSubmit),
  };
};
