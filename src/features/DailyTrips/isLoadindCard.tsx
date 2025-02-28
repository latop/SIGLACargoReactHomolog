import { Skeleton, Box } from "@mui/material";
import React from "react";

const IsLoadingTable = () => {
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
      <Skeleton variant="rectangular" width={"100%"} height={40} />
      <Skeleton variant="rectangular" width={"100%"} height={40} />
      <Skeleton variant="rectangular" width={"100%"} height={40} />
      <Skeleton variant="rectangular" width={"100%"} height={40} />
      <Skeleton variant="rectangular" width={"100%"} height={40} />
      <Skeleton variant="rectangular" width={"100%"} height={40} />
      <Skeleton variant="rectangular" width={"100%"} height={40} />
      <Skeleton variant="rectangular" width={"100%"} height={40} />
      <Skeleton variant="rectangular" width={"100%"} height={40} />
      <Skeleton variant="rectangular" width={"100%"} height={40} />
      <Skeleton variant="rectangular" width={"100%"} height={40} />
      <Skeleton variant="rectangular" width={"100%"} height={40} />
      <Skeleton variant="rectangular" width={"100%"} height={40} />
      <Skeleton variant="rectangular" width={"100%"} height={40} />
    </Box>
  );
};

export default IsLoadingTable;
