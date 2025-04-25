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
  styled,
} from "@mui/material";
import Link from "next/link";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
import debounce from "debounce";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { GroupmentType, RouteItem } from "../BurgerMenu/config";
import { usePathname } from "next/navigation";
import { blue } from "@mui/material/colors";

type BurgerMenuGroupProps = {
  routes: RouteItem[];
  router: AppRouterInstance;
  groupment: GroupmentType;
  name?: string;
  icon?: React.ElementType;
  expanded?: boolean;
  onToggle: (group: GroupmentType) => void;
};

const AccordionStyled = styled(Accordion)`
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  &.Mui-expanded {
    margin: 0;
  }
`;

const AccordionSummaryStyled = styled(AccordionSummary)`
  transition: all 0.2s ease-in-out;
  &:hover {
    opacity: 0.7;
  }
`;

export const BurgerMenuGroup = ({
  routes,
  router,
  name,
  groupment,
  icon: Icon = MenuIcon,
  expanded,
  onToggle,
}: BurgerMenuGroupProps) => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const hasActiveItem = routes
    .filter(({ group }) => group === groupment)
    .some(({ path }) => isActive(path));

  return (
    <AccordionStyled
      expanded={expanded}
      onChange={() => onToggle(groupment)}
      disableGutters
      square
    >
      <AccordionSummaryStyled
        expandIcon={<ExpandMoreIcon />}
        sx={{
          borderLeft: hasActiveItem ? `4px solid ${blue[800]}` : "none",
          color: hasActiveItem ? blue[800] : "inherit",
          "& .MuiAccordionSummary-expandIconWrapper": {
            color: hasActiveItem ? blue[900] : "inherit",
            fontWeight: hasActiveItem ? 500 : 400,
          },
        }}
      >
        <ListItemIcon sx={{ color: hasActiveItem ? blue[800] : "inherit" }}>
          <Icon />
        </ListItemIcon>
        <Typography
          sx={{
            color: hasActiveItem ? blue[900] : "inherit",
          }}
        >
          {name}
        </Typography>
      </AccordionSummaryStyled>
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
                  debounce(() => router.prefetch(path), 300)();
                }}
              >
                <ListItemButton
                  sx={{
                    color: isActive(path) ? blue[800] : "inherit",
                    borderLeft: isActive(path)
                      ? `4px solid ${blue[800]}`
                      : "none",
                    pl: isActive(path) ? "12px" : "16px",
                  }}
                >
                  <ListItemIcon
                    sx={{ color: isActive(path) ? blue[800] : "inherit" }}
                  >
                    {icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={text}
                    sx={{
                      "& .MuiTypography-root": {
                        fontWeight: isActive(path) ? 500 : 400,
                        color: isActive(path) ? blue[900] : "inherit",
                      },
                    }}
                  />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
      </AccordionDetails>
    </AccordionStyled>
  );
};
