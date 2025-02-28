import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";

interface FormFields {
  locationCode: string;
  direction: string;
}

const schema = z.object({
  locationCode: z.string().nonempty("Cód. localização é obrigatório"),
  direction: z.string().nonempty("Direção é obrigatória"),
});

export function useDeparturesArrivalsFilterBar() {
  const router = useRouter();
  const params = useSearchParams();
  const methods = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      locationCode: params.get("locationCode") || "",
      direction: params.get("direction") || "",
    },
  });

  const onSubmit = (data: FormFields) => {
    const params = new URLSearchParams();
    params.append("locationCode", data.locationCode);
    if (data.direction) {
      params.append("direction", data.direction);
    }

    router.push(`/departures-and-arrivals?${params.toString()}`);
  };

  return {
    methods,
    onSubmit,
  };
}
