import { GridDeleteForeverIcon } from "@mui/x-data-grid";
import { Box, IconButton, styled, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { ReactNode } from "react";

interface CustomAction {
  icon: ReactNode;
  onClick: () => void;
  tooltip: string;
  color?: string;
  isLoading?: boolean;
}

interface ActionsColumnProps {
  onDelete: () => void;
  onEdit?: () => void;
  tooltipEdit?: string;
  tooltipDelete?: string;
  isLoadingDelete?: boolean;
  additionalActions?: CustomAction[];
}

const CustomIcon = styled(IconButton)(() => ({
  padding: "2px",
}));

export const ActionsColumn = ({
  onDelete,
  onEdit,
  isLoadingDelete = false,
  tooltipEdit = "Editar",
  tooltipDelete = "Apagar",
  additionalActions = [],
}: ActionsColumnProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      {onEdit && (
        <CustomIcon onClick={onEdit}>
          <Tooltip title={tooltipEdit}>
            <EditIcon
              sx={{
                color: "#1976d2",
              }}
              onClick={onEdit}
            />
          </Tooltip>
        </CustomIcon>
      )}

      {additionalActions.map(
        ({ icon, onClick, tooltip, color, isLoading }, index) => (
          <CustomIcon
            sx={{
              color: color,
              opacity: isLoading ? 0.5 : 1,
              pointerEvents: isLoading ? "none" : "auto",
            }}
            key={index}
            onClick={onClick}
          >
            <Tooltip title={tooltip}>
              <>{icon}</>
            </Tooltip>
          </CustomIcon>
        ),
      )}
      {onDelete && (
        <CustomIcon onClick={onDelete}>
          <Tooltip title={tooltipDelete}>
            <GridDeleteForeverIcon
              sx={{
                color: "#e53935",
              }}
              onClick={onDelete}
              style={{
                opacity: isLoadingDelete ? 0.5 : 1,
                pointerEvents: isLoadingDelete ? "none" : "auto",
              }}
            />
          </Tooltip>
        </CustomIcon>
      )}
    </Box>
  );
};
