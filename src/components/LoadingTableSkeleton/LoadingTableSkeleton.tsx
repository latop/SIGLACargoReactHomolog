import { Skeleton, Box } from "@mui/material";
import React from "react";

const LoadingTableSkeleton = ({
  length,
  height = 36,
}: {
  length: number;
  height?: number;
}) => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        padding: "20px",
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      {Array.from({ length }, (_, index) => (
        <Skeleton
          key={index}
          variant="rectangular"
          width={"100%"}
          height={height}
        />
      ))}
    </Box>
  );
};

export default LoadingTableSkeleton;
