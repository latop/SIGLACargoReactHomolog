import { Box, Card, CardContent, Container, Typography } from "@mui/material";
import Link from "next/link";

export function NotFound() {
  return (
    <Container
      component="main"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "100vh",
        maxWidth: "none !important",
        alignItems: "center",
        background: "#24438F",
      }}
    >
      <Card sx={{ mt: 2, maxWidth: "400px" }}>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img src="/pepsico-logo.png" width={250} height={69} alt="PepsiCo" />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <Typography component="h1" variant="h5" marginTop={5}>
              Página não encontrada - 404
            </Typography>
            <Typography component="h1" variant="h5" marginTop={5}></Typography>
          </Box>
          <Link href={"/home"} style={{ textDecoration: "underline" }}>
            Voltar para Home
          </Link>
        </CardContent>
      </Card>
    </Container>
  );
}
