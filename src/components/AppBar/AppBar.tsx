"use client";

import React, { useEffect, useState } from "react";
import {
  AppBar as AppBarBase,
  Toolbar,
  IconButton,
  Button,
  Box,
  Typography,
} from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { destroyCookie } from "nookies";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/navigation";
import { BurgerMenu } from "../BurgerMenu";
import { grey } from "@mui/material/colors";

interface AppBarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function AppBar({ children, ...props }: AppBarProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setOpen(open);
    };

  useEffect(() => {
    router.prefetch("/");
  }, []);

  const handleLogout = () => {
    destroyCookie(null, "accessToken");
    router.push("/");
  };

  return (
    <Box {...props}>
      <BurgerMenu toggleDrawer={toggleDrawer} isOpen={open} />
      <AppBarBase position="static">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerOpen}
          >
            <MenuIcon />
          </IconButton>
          {children}
          <Box sx={{ flexGrow: 1 }} />
          <Button
            color="inherit"
            onClick={handleLogout}
            variant="text"
            startIcon={<ExitToAppIcon />}
          >
            <Typography color={grey[50]}>Logout</Typography>
          </Button>
        </Toolbar>
      </AppBarBase>
    </Box>
  );
}
