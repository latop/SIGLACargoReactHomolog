import React from "react";
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
import EditNoteIcon from "@mui/icons-material/EditNote";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import BarChartIcon from "@mui/icons-material/BarChart";
import CategoryIcon from "@mui/icons-material/Category";
import EventNoteIcon from "@mui/icons-material/EventNote";
import ReduceCapacityIcon from "@mui/icons-material/ReduceCapacity";
import StreetviewIcon from "@mui/icons-material/Streetview";
import RoomIcon from "@mui/icons-material/Room";
import LinearScaleIcon from "@mui/icons-material/LinearScale";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import SouthAmericaIcon from "@mui/icons-material/SouthAmerica";
import BusinessIcon from "@mui/icons-material/Business";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export type GroupmentType =
  | "register"
  | "coordination"
  | "driver-schedule"
  | "planning"
  | "reports";

export interface RouteItem {
  text: string;
  icon: React.ReactElement;
  path: string;
  group?: GroupmentType;
}

const routes: RouteItem[] = [
  {
    text: "Home",
    icon: <HomeIcon />,
    path: "/home",
  },

  // Cadastros
  {
    text: "Rotas",
    icon: <RouteIcon />,
    path: "/line",
    group: "register",
  },
  {
    text: "Motoristas",
    icon: <TbSteeringWheel />,
    path: "/driver",
    group: "register",
  },
  {
    text: "Caminhão",
    icon: <LocalShippingIcon />,
    path: "/truck",
    group: "register",
  },
  {
    text: "Localização",
    icon: <AddLocationAltIcon />,
    path: "/location",
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
    path: "/justification",
    group: "register",
  },
  {
    text: "Tipo de Atividade",
    icon: <CategoryIcon />,
    path: "/activity-type",
    group: "register",
  },
  {
    text: "Atividades",
    icon: <EventNoteIcon />,
    path: "/activity",
    group: "register",
  },
  {
    text: "Grupos de Localização",
    icon: <ReduceCapacityIcon />,
    path: "/location-group",
    group: "register",
  },
  {
    text: "Tipo de Parada",
    icon: <RoomIcon />,
    path: "/stop-type",
    group: "register",
  },
  {
    text: "Tipo de Localização",
    icon: <StreetviewIcon />,
    path: "/location-type",
    group: "register",
  },
  {
    text: "Tipo de viagem",
    icon: <StreetviewIcon />,
    path: "/trip-type",
    group: "register",
  },
  {
    text: "Atribuição",
    icon: <PersonSearchIcon />,
    group: "register",
    path: "/attribution",
  },

  {
    text: "Cargos",
    icon: <LinearScaleIcon />,
    group: "register",
    path: "/position",
  },
  {
    text: "Modelos de Frota",
    icon: <DirectionsCarIcon />,
    path: "/fleet-model",
    group: "register",
  },
  {
    text: "Grupos de Frota",
    icon: <DirectionsCarIcon />,
    path: "/fleet-group",
    group: "register",
  },
  {
    text: "Tipo de Frota",
    icon: <LocalShippingIcon />,
    path: "/fleet-type",
    group: "register",
  },
  {
    text: "Marca de Frota",
    icon: <BrandingWatermarkIcon />,
    path: "/fleet-brand",
    group: "register",
  },
  {
    text: "Atividades de Veículo",
    icon: <LocalShippingIcon />,
    path: "/activity-truck",
    group: "register",
  },
  {
    text: "Cidades",
    icon: <LocationCityIcon />,
    path: "/city",
    group: "register",
  },
  {
    text: "Estados",
    icon: <SouthAmericaIcon />,
    path: "/state",
    group: "register",
  },
  {
    text: "Regiões",
    icon: <SouthAmericaIcon />,
    path: "/region",
    group: "register",
  },
  {
    text: "Países",
    icon: <SouthAmericaIcon />,
    path: "/country",
    group: "register",
  },
  {
    text: "Empresas",
    icon: <BusinessIcon />,
    path: "/company",
    group: "register",
  },
  {
    text: "Fuso horário",
    icon: <AccessTimeIcon />,
    path: "/timezone",
    group: "register",
  },
  {
    text: "Fuso horário - Valores",
    icon: <AccessTimeIcon />,
    path: "/timezone-value",
    group: "register",
  },

  // Coordenação de Viagens
  {
    text: "Coordenação de viagens",
    icon: <TbSteeringWheel />,
    path: "/daily-trips-schedule",
    group: "coordination",
  },
  {
    text: "Partidas e chegadas",
    icon: <SwapVertIcon />,
    path: "/departures-and-arrivals",
    group: "coordination",
  },
  {
    text: "Viagens diárias",
    icon: <MovingIcon />,
    path: "/daily-trip",
    group: "coordination",
  },

  // Escala de Motoristas
  {
    text: "Solicitação de Motoristas",
    icon: <LocalShippingIcon />,
    path: "/drivers-request",
    group: "driver-schedule",
  },
  {
    text: "Escala de Motoristas",
    icon: <LocalShippingIcon />,
    path: "/drivers-schedule",
    group: "driver-schedule",
  },
  {
    text: "Liberação de motoristas",
    icon: <NoCrashIcon />,
    path: "/release-driver",
    group: "driver-schedule",
  },
  {
    text: "Publicação",
    icon: <PublishIcon />,
    path: "/publish-journey",
    group: "driver-schedule",
  },

  // Planejamento
  {
    text: "Planejamento de veículos",
    icon: <TbSteeringWheel />,
    path: "/vehicle-planning",
    group: "planning",
  },
  {
    text: "Cenários",
    icon: <BiTrip />,
    path: "/scenarios",
    group: "planning",
  },
  {
    text: "Importação de viagens",
    icon: <UploadFileIcon />,
    path: "/import-trips",
    group: "planning",
  },
  {
    text: "Otimizacão de viagens",
    icon: <SettingsSuggestIcon />,
    path: "/trip-optimization",
    group: "planning",
  },

  // Relatórios
  {
    text: "Relatórios",
    icon: <AssignmentIcon />,
    path: "/reports",
    group: "reports",
  },
];

const groupments = [
  {
    groupment: "register",
    name: "Cadastros",
    icon: PlaylistAddIcon,
  },
  {
    groupment: "coordination",
    name: "Coordenação de Viagens",
    icon: AltRouteIcon,
  },
  {
    groupment: "driver-schedule",
    name: "Escala de Motoristas",
    icon: CalendarMonthIcon,
  },
  {
    groupment: "planning",
    name: "Planejamento",
    icon: AutoGraphIcon,
  },
  {
    groupment: "reports",
    name: "Relatórios",
    icon: BarChartIcon,
  },
] satisfies Array<{
  groupment: GroupmentType;
  name: string;
  icon: React.ElementType;
}>;

export { routes, groupments };
