import theme from "@/styles/theme";
import AddIcon from "@mui/icons-material/Add";
import { Box, Button, CircularProgress, Icon, Typography } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import { useFormContext } from "react-hook-form";

export function DailyTripFooterDetail() {
  const {
    formState: { isSubmitting },
    watch,
    setValue,
  } = useFormContext();

  const handleAddStep = () => {
    const dailyTripSections = watch("dailyTripSections");
    dailyTripSections.push({
      section: dailyTripSections.length + 1,
      truckId: null,
      truck: {
        startDate: null,
        endDate: null,
        isRefurbished: false,
        stateId: null,
        state: null,
        chassisNumber: null,
        licensePlate: null,
        regulatoryNumber: null,
        regulatoryValidity: null,
        manufactureYear: null,
        serialNumber: null,
        tare: null,
        capacity: null,
        locationGroupId: null,
        locationGroup: null,
        fleetTypeId: null,
        fleetType: null,
        note: null,
        integrationCode: null,
        fleetCode: null,
        id: null,
        createAt: null,
        updateAt: null,
        userIdCreate: null,
        userIdUpdate: null,
      },
      locationOrig: {
        code: null,
        codeIntegration1: null,
        codeIntegration2: null,
        name: null,
        cityId: null,
        latitude: null,
        longitude: null,
        locationTypeId: null,
        locationType: null,
        timezoneId: null,
        locationGroupId: null,
        locationGroup: null,
        delayGPS: null,
      },
      locationOrigId: null,
      locationDest: {
        code: null,
        codeIntegration1: null,
        codeIntegration2: null,
        name: null,
        cityId: null,
        latitude: null,
        longitude: null,
        locationTypeId: null,
        locationType: null,
        timezoneId: null,
        locationGroupId: null,
        locationGroup: null,
        delayGPS: null,
      },
      locationDestId: null,
      startActual: null,
      endActual: null,
      startEstimated: null,
      endEstimated: null,
      startPlanned: null,
      endPlanned: null,
      driverId: null,
      driverName: null,
      flgStatus: "N",
      notes: null,
      locationGroupId: null,
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
            <Typography
              variant="body2"
              ml="5px"
              color={theme.palette.primary.main}
            >
              Etapa
            </Typography>
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
