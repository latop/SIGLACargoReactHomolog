import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { colors } from "@mui/material";
import { useState, useMemo, useCallback, memo } from "react";
import { FixedSizeList } from "react-window";
import { headersMap } from "../../useNewTripOptmization";

interface OptimizationData {
  description: string;
  headers: string[];
  data: Record<string, string | number>[];
}

interface OptimizeAccordionTableProps {
  optimization: OptimizationData;
  index: number;
}

interface RowComponentProps {
  index: number;
  style: React.CSSProperties;
  data: {
    headers: string[];
    rowData: Record<string, string | number>[];
  };
}

const TABLE_CELL_BASE_STYLE: React.CSSProperties = {
  flex: 1,
  display: "flex",
  alignItems: "center",
} as const;

const TABLE_CONTAINER_STYLE: React.CSSProperties | Record<string, object> = {
  width: "100%",
  overflow: "auto",
  "& .MuiTableHead-root": {
    position: "sticky",
    top: 0,
    zIndex: 1,
    "& .MuiTableCell-root": {
      backgroundColor: colors.blue[900],
    },
  },
} as const;

const TABLE_STYLE: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
};

const RowComponent = memo(({ index, style, data }: RowComponentProps) => (
  <div style={{ ...style, display: "flex", width: "100%" }}>
    <TableRow
      hover
      sx={{
        transition: "all 0.3s ease",
        "&:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.04)",
        },
        display: "flex",
        width: "100%",
        borderBottom: "1px solid rgba(224, 224, 224, 1)",
      }}
    >
      {data.headers.map((header, cellIndex) => (
        <TableCell
          key={cellIndex}
          sx={{
            ...TABLE_CELL_BASE_STYLE,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            borderBottom: "none",
          }}
        >
          {data.rowData[index][header]}
        </TableCell>
      ))}
    </TableRow>
  </div>
));

export const OptimizeAccordionTable = memo(
  ({ optimization, index }: OptimizeAccordionTableProps) => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleFullscreenToggle = useCallback((e?: React.MouseEvent) => {
      if (e) {
        e.stopPropagation();
      }
      setIsFullscreen((prev) => !prev);
    }, []);

    const handleAccordionChange = useCallback(
      (_: React.SyntheticEvent, expanded: boolean) => {
        setIsExpanded(expanded);
      },
      [],
    );

    const itemData = useMemo(
      () => ({
        headers: optimization.headers,
        rowData: optimization.data,
      }),
      [optimization.headers, optimization.data],
    );

    const tableContent = useMemo(
      () => (
        <TableContainer
          component={Paper}
          sx={{
            ...TABLE_CONTAINER_STYLE,
            height: isFullscreen ? "100%" : 600,
          }}
        >
          <Table size="small" stickyHeader sx={TABLE_STYLE}>
            <TableHead sx={{ width: "100%" }}>
              <TableRow sx={{ display: "flex", width: "100%" }} hover>
                {optimization.headers.map((header, headerIndex) => (
                  <TableCell
                    sx={{
                      ...TABLE_CELL_BASE_STYLE,
                      fontWeight: "600",
                      color: colors.common.white,
                    }}
                    key={headerIndex}
                  >
                    {headersMap.get(header)}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            {isExpanded && (
              <TableBody sx={{ width: "100%", flex: 1 }}>
                <FixedSizeList
                  height={isFullscreen ? window.innerHeight : 600}
                  itemCount={optimization.data.length}
                  itemSize={35.2}
                  width="100%"
                  itemData={itemData}
                >
                  {RowComponent}
                </FixedSizeList>
              </TableBody>
            )}
          </Table>
        </TableContainer>
      ),
      [
        isFullscreen,
        isExpanded,
        optimization.headers,
        optimization.data,
        itemData,
      ],
    );

    if (isFullscreen) {
      return (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: "background.paper",
            zIndex: 1300,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              p: 2,
              position: "sticky",
              top: 0,
              bgcolor: "background.paper",
              zIndex: 1,
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <Typography variant="h6">{optimization.description}</Typography>
            <IconButton onClick={handleFullscreenToggle}>
              <FullscreenExitIcon />
            </IconButton>
          </Box>
          <Box sx={{ p: 2, overflow: "auto", flex: 1 }}>{tableContent}</Box>
        </Box>
      );
    }

    return (
      <Accordion
        key={index}
        expanded={isExpanded}
        onChange={handleAccordionChange}
        disabled={!optimization.data.length}
        sx={{
          "&.Mui-disabled": {
            backgroundColor: "white",
          },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            "& .MuiAccordionSummary-content": { alignItems: "center" },
            height: "80px",
          }}
        >
          <Typography sx={{ flex: 1 }}>{optimization.description}</Typography>
          {isExpanded && (
            <IconButton size="small" onClick={handleFullscreenToggle}>
              <FullscreenIcon />
            </IconButton>
          )}
        </AccordionSummary>
        {isExpanded && <AccordionDetails>{tableContent}</AccordionDetails>}
      </Accordion>
    );
  },
);
RowComponent.displayName = "RowComponent";
OptimizeAccordionTable.displayName = "OptimizeAccordionTable";
