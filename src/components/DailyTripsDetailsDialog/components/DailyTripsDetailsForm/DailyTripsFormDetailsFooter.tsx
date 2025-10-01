import AddIcon from "@mui/icons-material/Add";
import { Box, Button, CircularProgress, Icon } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import { useFormContext } from "react-hook-form";

export function DailyTripsFormDetailsFooter() {
  const {
    formState: { isSubmitting },
    watch,
    setValue,
  } = useFormContext();

  const handleAddStep = () => {
    const dailyTripSections = watch("dailyTripSections");
    dailyTripSections.push({
      id: "",
      createAt: null,
      updateAt: null,
      userIdCreate: null,
      userIdUpdate: null,
      section: dailyTripSections.length + 1,
      truckId: null,
      truck: {
        licensePlate: "",
      },
      locationOrigId: null,
      locationOrig: null,
      locationDestId: null,
      locationDest: null,
      startPlanned: null,
      endPlanned: null,
      startActual: null,
      endActual: null,
      startEstimated: null,
      endEstimated: null,
      stopTypeId: null,
      stopType: null,
      flgStatus: "N",
      notes: null,
      locationGroupId: null,
      driverId: null,
    });
    setValue("dailyTripSections", dailyTripSections);
  };

  return (
    <DialogActions>
      <Box
        display="flex"
        justifyContent="space-between"
        padding="10px"
        width="100%"
      >
        <Box display="flex" gap="10px">
          <Button
            variant="outlined"
            onClick={handleAddStep}
            color="primary"
            size="small"
          >
            <Icon component={AddIcon} fontSize="small" />
            Etapa
          </Button>
          {/* <Button disabled variant="outlined">
            {isSubmitting && (
              <CircularProgress
                color="inherit"
                size={20}
                sx={{ margin: "2px 11.45px" }}
              />
            )}
            Horários Planejados
          </Button> */}
          {/* <Button
            variant="outlined"
            onClick={() => setModalOpen({ ...modalOpen, justifyModal: true })}
          >
            {isSubmitting && (
              <CircularProgress
                color="inherit"
                size={20}
                sx={{ margin: "2px 11.45px" }}
              />
            )}
            Justificativas
          </Button>
          <Button disabled variant="outlined">
            {isSubmitting && (
              <CircularProgress
                color="inherit"
                size={20}
                sx={{ margin: "2px 11.45px" }}
              />
            )}
            Auditoria
          </Button> */}
        </Box>
        <Box display="flex" gap="10px">
          <Button type="submit" variant="contained">
            {isSubmitting && (
              <CircularProgress
                color="inherit"
                size={20}
                sx={{ margin: "2px 11.45px" }}
              />
            )}
            {!isSubmitting && `Salvar`}
          </Button>
        </Box>
      </Box>
      {/* {modalOpen.justifyModal && (
        <ModalJustification
          isOpen={modalOpen.justifyModal}
          handleClose={() =>
            setModalOpen({ ...modalOpen, justifyModal: false })
          }
        />
      )} */}
    </DialogActions>
  );
}
