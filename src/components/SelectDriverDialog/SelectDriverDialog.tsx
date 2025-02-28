import React from "react";
import { FormProvider } from "react-hook-form";
import dayjs from "dayjs";
import { Button, CircularProgress, Grid } from "@mui/material";
import { AutocompleteDriver } from "@/components/AutocompleteDriver";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDrivers } from "@/hooks/useDrivers";
import { useCircuit } from "@/hooks/useCircuit";
import { useToast } from "@/hooks/useToast";

dayjs.extend(customParseFormat);

const schema = z.object({
  nickName: z.string().optional(),
});

interface FormFields {
  nickName?: string;
}

interface SelectDriverDialogProps extends React.HTMLProps<HTMLFormElement> {
  onClose: () => void;
}

export function SelectDriverDialog({
  onClose,
  ...props
}: SelectDriverDialogProps) {
  const { changeDriver } = useCircuit();
  const { addToast } = useToast();
  const methods = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      nickName: "",
    },
  });

  const { handleSubmit, watch } = methods;
  const { drivers, isLoading } = useDrivers({
    pageSize: 10,
    nickName: watch("nickName"),
  });

  const currentDriver = drivers?.find(
    (driver) => driver.nickName === watch("nickName"),
  );

  const onSubmit = () => {
    if (currentDriver) {
      changeDriver(currentDriver);
      addToast("Motorista alterado com sucesso");
      onClose();
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        {...props}
        style={{ width: "300px" }}
      >
        <Grid container spacing={2}>
          <Grid item xs={9}>
            <AutocompleteDriver />
          </Grid>
          <Grid item xs={1}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              {isLoading && (
                <CircularProgress
                  color="inherit"
                  size={20}
                  sx={{ display: "flex", margin: "2.5px 11.45px" }}
                />
              )}
              {!isLoading && `Salvar`}
            </Button>
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  );
}
