import { GridDeleteForeverIcon } from "@mui/x-data-grid";
import { Box, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

interface ActionsColumnProps {
  onDelete: () => void;
  onEdit?: () => void;
  tooltipEdit?: string;
  tooltipDelete?: string;
  isLoadingDelete?: boolean;
}

export const ActionsColumn = ({
  onDelete,
  onEdit,
  isLoadingDelete = false,
  tooltipEdit = "Editar",
  tooltipDelete = "Apagar",
}: ActionsColumnProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: "4px",
        alignItems: "center",
        justifyContent: "center",
        padding: "4px 0",
      }}
    >
      {onEdit && (
        <IconButton onClick={onEdit}>
          <Tooltip title={tooltipEdit}>
            <EditIcon
              sx={{
                color: "#1976d2",
              }}
              onClick={onEdit}
            />
          </Tooltip>
        </IconButton>
      )}
      {onDelete && (
        <IconButton onClick={onDelete}>
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
        </IconButton>
      )}
    </Box>
  );
};
