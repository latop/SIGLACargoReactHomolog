import React from "react";
import {
  Drawer,
  List,
  Box,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import Link from "next/link";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import HomeIcon from "@mui/icons-material/Home";
import { TbSteeringWheel } from "react-icons/tb";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import MovingIcon from "@mui/icons-material/Moving";
import { BiTrip } from "react-icons/bi";
import NoCrashIcon from "@mui/icons-material/NoCrash";
import AssignmentIcon from "@mui/icons-material/Assignment";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import RouteIcon from "@mui/icons-material/Route";
import PublishIcon from "@mui/icons-material/Publish";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import { useRouter } from "next/navigation";
import { BurgerMenuGroup } from "../BurgerMenuGroup";
import EditNoteIcon from "@mui/icons-material/EditNote";

interface BurgerMenuProps {
  isOpen: boolean;
  toggleDrawer: (
    open: boolean,
  ) => (event: React.KeyboardEvent | React.MouseEvent) => void;
}

export interface RouteItem {
  text: string;
  icon: React.ReactElement;
  path: string;
  group?: "register" | undefined;
}

const routes: RouteItem[] = [
  { text: "Home", icon: <HomeIcon />, path: "/home" },
  {
    text: "Solicitação de Motoristas",
    icon: <LocalShippingIcon />,
    path: "/drivers-request",
  },
  {
    text: "Escala de Motoristas",
    icon: <LocalShippingIcon />,
    path: "/drivers-schedule",
  },
  {
    text: "Coordenação de viagens",
    icon: <TbSteeringWheel />,
    path: "/daily-trips-schedule",
  },
  {
    text: "Partidas e chegadas",
    icon: <SwapVertIcon />,
    path: "/departures-and-arrivals",
  },
  {
    text: "Viagens diárias",
    icon: <MovingIcon />,
    path: "/daily-trips",
  },
  {
    text: "Planejamento de veículos",
    icon: <TbSteeringWheel />,
    path: "/vehicle-planning",
  },
  {
    text: "Cenários",
    icon: <BiTrip />,
    path: "/scenarios",
  },
  {
    text: "Liberação de motoristas",
    icon: <NoCrashIcon />,
    path: "/release-driver",
  },
  {
    text: "Relatórios",
    icon: <AssignmentIcon />,
    path: "/reports",
  },
  {
    text: "Importação de viagens",
    icon: <UploadFileIcon />,
    path: "/import-trips",
  },
  {
    text: "Otimizacão de viagens",
    icon: <SettingsSuggestIcon />,
    path: "/trip-optimization",
  },
  {
    text: "Rotas",
    icon: <RouteIcon />,
    path: "/lines",
    group: "register",
  },
  {
    text: "Motoristas",
    icon: <TbSteeringWheel />,
    path: "/drivers",
    group: "register",
  },
  {
    text: "Publicação",
    icon: <PublishIcon />,
    path: "/publish-journey",
  },
  {
    text: "Caminhão",
    icon: <LocalShippingIcon />,
    path: "/trucks",
    group: "register",
  },
  {
    text: "Localização",
    icon: <AddLocationAltIcon />,
    path: "/locations",
    group: "register",
  },
  {
    text: "Setor Responsável",
    icon: <PersonSearchIcon />,
    path: "/responsible-sector",
    group: "register",
  },
  {
    text: "Justificativas",
    icon: <EditNoteIcon />,
    path: "/justifications",
    group: "register",
  },
];

export function BurgerMenu({ isOpen, toggleDrawer }: BurgerMenuProps) {
  const router = useRouter();

  return (
    <Drawer anchor="left" open={isOpen} onClose={toggleDrawer(false)}>
      <Box
        display="flex"
        justifyContent="center"
        width="100%"
        sx={{ padding: "20px 0 10px" }}
      >
        <img src="/pepsico-logo.png" width={144} height={40} alt="PepsiCo" />
      </Box>
      <List sx={{ display: "flex", flexDirection: "column" }}>
        {routes
          .filter(({ group }) => group === undefined)
          .map(({ text, icon, path }) => (
            <ListItem key={text} disablePadding>
              <Link
                href={path}
                passHref
                style={{ width: "100%" }}
                onMouseEnter={() => {
                  void router.prefetch(path);
                }}
              >
                <ListItemButton>
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        <BurgerMenuGroup
          routes={routes}
          groupment="register"
          name="Cadastros"
          router={router}
        />
      </List>
    </Drawer>
  );
}
