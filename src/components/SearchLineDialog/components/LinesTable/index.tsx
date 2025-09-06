import { Line } from "@/interfaces/lines";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  colors,
} from "@mui/material";
import { memo } from "react";

interface LinesTableProps {
  lines?: Line[];
  isLoading?: boolean;
  onSelect: (line: Line) => void;
  selectedLine?: Line | undefined;
}

export const LinesTable = memo(
  ({ lines = [], onSelect, selectedLine }: LinesTableProps) => {
    return (
      <Box mt={2} sx={{ height: 300, width: "100%" }}>
        <TableContainer
          component={Paper}
          sx={{
            height: "100%",
            overflow: "auto",
            border: "1px solid #e0e0e0",
            borderRadius: "4px",
          }}
        >
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    backgroundColor: "#24438F",
                    color: "white",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    borderBottom: "1px solid #24438F",
                  }}
                >
                  Cód. da Rota
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lines?.map((line) => (
                <TableRow
                  key={line.line.id}
                  sx={{
                    "&:hover": {
                      opacity: 0.8,
                    },
                    bgcolor:
                      selectedLine?.line.id === line.line.id
                        ? colors.grey[400]
                        : "",
                    cursor: "pointer",
                  }}
                >
                  <TableCell
                    sx={{
                      fontSize: "0.875rem",
                      padding: "8px 16px",
                    }}
                    onClick={() => onSelect(line)}
                  >
                    {line.line.code}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  },
);

LinesTable.displayName = "LinesTable";
