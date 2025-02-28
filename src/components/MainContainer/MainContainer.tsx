/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { CircularProgress, Box } from "@mui/material";
import { Container } from "./MainContainer.styles";
import { CSSProperties } from "react";

export function MainContainer({
  children,
  sx,
}: {
  children: React.ReactNode;
  sx?: CSSProperties;
}) {
  return <Container style={sx}>{children}</Container>;
}

function Content({
  children,
  loading,
  sx,
}: {
  children: React.ReactNode;
  loading?: boolean;
  sx?: CSSProperties;
}) {
  return (
    <Box
      sx={{
        padding: "0 20px",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        ...sx,
      }}
    >
      {loading && <CircularProgress sx={{ margin: "auto" }} />}
      {!loading && children}
    </Box>
  );
}

MainContainer.Content = Content;
