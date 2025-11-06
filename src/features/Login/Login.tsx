"use client";

import React, { useEffect } from "react";
import { useForm, Controller, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Container,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useFetch } from "@/hooks/useFetch";
import { useToast } from "@/hooks/useToast";
import { Dayjs } from "dayjs";
import { setCookie } from "nookies";

type AuthenticatedResponse = {
  authenticated: boolean;
  created: Dayjs;
  expiration: Dayjs;
  accessToken: string;
  userName: string;
  message: string;
};

const schema = z.object({
  userLogin: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export function Login() {
  const { addToast } = useToast();
  const [getAuth, { data, loading }] = useFetch<AuthenticatedResponse>();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    router.prefetch("/home");
  }, []);

  const handleAuthetication = (body: object) => {
    getAuth("/api/Login", body);
  };

  const handleSSO = () => {
    const targetUrl =
      "https://apicarga.azurewebsites.net/Auth/Login?returnUrl=https%3A%2F%2Fpepsicobrasil.sigla.app%2Fhome";
    window.location.href = targetUrl;
  };

  const handleWhoAmI = () => {
    getAuth(
      "/Auth/whoami",
      {},
      {
        method: "get",
      },
    );
  };

  const onSubmit = (data: FieldValues) => {
    const body = {
      ...data,
      domain: "application",
    };
    handleAuthetication(body);
  };

  useEffect(() => {
    if (data?.authenticated && !loading) {
      setCookie(null, "accessToken", data?.accessToken as string, {
        maxAge: 60 * 60 * 24,
      });
      router.push("/home");
      addToast("Login realizado com sucesso", { type: "success" });
    } else if (data?.authenticated === false && !loading) {
      addToast("Credenciais inválidas", { type: "error" });
    }
  }, [data, loading]);

  const isLoading = loading ? (
    <CircularProgress
      color="inherit"
      style={{
        height: 24,
        width: 24,
      }}
    />
  ) : (
    "Entrar"
  );

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
          <Typography component="h1" variant="h5" marginTop={5}>
            Entre na sua conta
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ mt: 1 }}
          >
            <Controller
              name="userLogin"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  label="Email"
                  autoComplete="off"
                  autoFocus
                  error={!!errors.email}
                  helperText={errors.email?.message?.toString()}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  label="Senha"
                  type="password"
                  autoComplete="off"
                  error={!!errors.password}
                  helperText={errors.password?.message?.toString()}
                />
              )}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
              {isLoading}
            </Button>
            {process.env.NEXT_PUBLIC_NODE_ENV === "development" && (
              <>
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3 }}
                  onClick={handleSSO}
                >
                  Entrar com SSO
                </Button>
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3 }}
                  onClick={handleWhoAmI}
                >
                  Who Am I
                </Button>
              </>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
