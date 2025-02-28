import { useFormContext } from "react-hook-form";
import { Box, Typography } from "@mui/material";
import { EmptyTruck } from "@/components/EmptyTruck";
import { DriverSectionVacations } from "./VacationsSection";

export function VacationsForm() {
  const { watch } = useFormContext();
  const driverVacations = watch("driverVacations");
  const hasDriverVacations = driverVacations && !!driverVacations?.length;
  return (
    <Box display={"flex"} flexDirection={"column"} flex={1} gap={"0.5rem"}>
      {hasDriverVacations &&
        driverVacations?.map((_: unknown, index: number) => (
          <DriverSectionVacations key={index} seq={index} />
        ))}
      {!hasDriverVacations && (
        <Box
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          sx={{ opacity: 0.5 }}
        >
          <EmptyTruck width={70} height={70} />
          <Typography>Adicionar</Typography>
        </Box>
      )}
    </Box>
  );
}
