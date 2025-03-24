import { useHash } from "@/hooks/useHash";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

import { z } from "zod";

const ActivityFilterBarSchema = z.object({
  code: z.string().optional(),
  type: z.string().optional(),
  activityTypeId: z.string().optional(),
  activityTypeCode: z.string().optional(),
  flgRequest: z.enum(["true", "false", "all"]).default("all"),
  submitted: z.enum(["true", "false"]).optional(),
});

export type ActivityFilterBarsType = z.infer<typeof ActivityFilterBarSchema>;

export const useActivityFilterBar = () => {
  const [, setHash] = useHash();
  const router = useRouter();
  const params = useSearchParams();
  const methods = useForm<ActivityFilterBarsType>({
    resolver: zodResolver(ActivityFilterBarSchema),
    defaultValues: {
      code: params.get("code") || "",
      flgRequest: (params.get("flgRequest") as "true" | "false") || undefined,
      activityTypeId: params.get("activityTypeId") || "",
      activityTypeCode: params.get("activityTypeCode") || "",
    },
  });

  const onSubmit = (data: ActivityFilterBarsType) => {
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

    router.push(`/activities?${params.toString()}`);
  };

  const onClearParams = () => {
    methods.reset({});
    router.push("/activities");
    setTimeout(() => window.location.reload(), 500);
  };

  const handleAddActivity = () => {
    setHash("#add-activity");
  };

  return {
    methods,
    onClearParams,
    handleAddActivity,
    onSubmit: methods.handleSubmit(onSubmit),
  };
};
