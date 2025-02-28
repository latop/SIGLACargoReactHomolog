import { useFormContext } from "react-hook-form";
import { DriverSectionBases } from "./BasesSection";
import { Box, Typography } from "@mui/material";
import { EmptyTruck } from "@/components/EmptyTruck";

export function BasesForm() {
  const { watch } = useFormContext();
  const driverBases = watch("driverBases");
  const hasDriverBases = driverBases && !!driverBases?.length;

  return (
    <Box display={"flex"} flexDirection={"column"} flex={1} gap={"0.5rem"}>
      {hasDriverBases &&
        driverBases?.map((_: unknown, index: number) => (
          <DriverSectionBases key={index} seq={index} />
        ))}
      {!hasDriverBases && (
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
