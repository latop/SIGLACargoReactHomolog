import { useFormContext } from "react-hook-form";
import { DriverSectionAttribuitions } from "./AttribuitionsSection";
import { Box, Typography } from "@mui/material";
import { EmptyTruck } from "@/components/EmptyTruck";

export function AttribuitionForm() {
  const { watch } = useFormContext();

  const driverAttributions = watch("driverAttributions");
  const hasDriverAttributions =
    driverAttributions && !!driverAttributions?.length;

  return (
    <Box display={"flex"} flexDirection={"column"} flex={1} gap={"0.5rem"}>
      {hasDriverAttributions &&
        driverAttributions?.map((_: unknown, index: number) => (
          <DriverSectionAttribuitions key={index} seq={index} />
        ))}
      {!hasDriverAttributions && (
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
