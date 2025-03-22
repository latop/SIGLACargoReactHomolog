import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";

interface FormFields {
  fleetGroupCode: string;
  locationDestId: string;
  locationDestCode: string;
  fleetGroupId: string;
  locationOrigId: string;
  locationOrigCode: string;
  code: string;
  submitted?: boolean;
}

const schema = z.object({
  fleetGroupCode: z.string().optional(),
  fleetGroupId: z.string().optional(),
  locationOrigId: z.string().optional(),
  locationOrigCode: z.string().optional(),
  locationDestId: z.string().optional(),
  locationDestCode: z.string().optional(),
  code: z.string().optional(),
});

export function useLinesFilterBar() {
  const router = useRouter();
  const params = useSearchParams();
  const methods = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      fleetGroupCode: params.get("fleetGroupCode") || "",
      fleetGroupId: params.get("fleetGroupId") || "",
      locationDestId: params.get("locationDestId") || "",
      locationOrigId: params.get("locationOrigId") || "",
      locationDestCode: params.get("locationDestCode") || "",
      locationOrigCode: params.get("locationOrigCode") || "",
      code: params.get("code")?.toLocaleUpperCase() || "",
    },
  });

  const onSubmit = (data: FormFields) => {
    const params = new URLSearchParams();
    let hasValues = false;

    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
        hasValues = true;
      }
    });

    if (!hasValues) {
      params.append("submitted", "true");
    }
    router.push(`/lines?${params.toString()}`);
  };

  const onClearParams = () => {
    methods.reset({});
    router.push("/lines");
    setTimeout(() => window.location.reload(), 500);
  };

  return {
    methods,
    onSubmit,
    onClearParams,
  };
}
