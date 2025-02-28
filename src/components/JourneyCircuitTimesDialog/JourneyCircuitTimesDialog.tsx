import { Box, Grid } from "@mui/material";
import { useJourneyCircuitTimesDialog } from "./useJourneyCircuitTimesDialog";

export const JourneyCircuitTimesDialog = () => {
  const { circuitTimes } = useJourneyCircuitTimesDialog();

  return (
    <Box
      minWidth={"10000px"}
      height={200}
      display="flex"
      flexDirection={"column"}
      gap={1}
    >
      {circuitTimes?.map((circuitTime: string) => (
        <Grid key={circuitTime} item>
          {circuitTime}
        </Grid>
      ))}
    </Box>
  );
};
