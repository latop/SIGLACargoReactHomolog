import React from "react";
import {
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  ListItem,
} from "@mui/material";
import Link from "next/link";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import debounce from "debounce";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { RouteItem } from "../BurgerMenu/BurgerMenu";

type BurgerMenuGroupProps = {
  routes: RouteItem[];
  router: AppRouterInstance;
  groupment: "register" | undefined;
  name?: string;
};

export const BurgerMenuGroup = ({
  routes,
  router,
  name,
  groupment,
}: BurgerMenuGroupProps) => {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <ListItemIcon>
          <AddCircleIcon />
        </ListItemIcon>
        <Typography fontWeight={500}>{name}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {routes
          .filter(({ group }) => group === groupment)
          .sort((a: RouteItem, b: RouteItem) => a.text.localeCompare(b.text))
          .map(({ text, icon, path }) => (
            <ListItem key={text} disablePadding>
              <Link
                href={path}
                passHref
                style={{ width: "100%" }}
                onMouseEnter={() => {
                  debounce(() => router.prefetch(path), 300);
                }}
              >
                <ListItemButton>
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
      </AccordionDetails>
    </Accordion>
  );
};
