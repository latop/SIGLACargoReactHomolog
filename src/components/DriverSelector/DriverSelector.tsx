/* eslint-disable prettier/prettier */
import React, { useState, useMemo, useCallback } from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Box,
  Typography,
  Paper,
} from "@mui/material";
import { useDrivers } from "@/hooks/useDrivers";
import { Driver } from "@/interfaces/driver";
import debounce from "debounce";

interface DriverSelectorProps {
  name?: string;
  label?: string;
  disabled?: boolean;
  onChange?: (selectedDrivers: string[]) => void;
}

export function DriverSelector({
  name = "nickNames",
  label = "Motoristas",
  disabled = false,
  onChange,
}: DriverSelectorProps) {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const [searchValue, setSearchValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const selectedDrivers = watch(name) || [];

  const debouncedSearch = useMemo(
    () => debounce((value: string) => setSearchValue(value), 300),
    [],
  );

  const { drivers } = useDrivers({
    pageSize: 50,
    nickName: searchValue,
  });

  const sortedDrivers = useMemo(() => {
    if (!drivers?.length) return [];

    return drivers.sort((a, b) => {
      const aSelected = selectedDrivers.includes(a.nickName);
      const bSelected = selectedDrivers.includes(b.nickName);

      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return a.nickName.localeCompare(b.nickName);
    });
  }, [drivers, selectedDrivers]);

  const handleRemoveDriver = useCallback(
    (driverNick: string) => {
      if (disabled) return;

      const newSelection = selectedDrivers.filter(
        (nick: string) => nick !== driverNick,
      );
      setValue(name, newSelection);
      onChange?.(newSelection);
    },
    [disabled, selectedDrivers, setValue, name, onChange],
  );

  const handleDriverToggle = useCallback(
    (driver: Driver) => {
      if (disabled) return;

      const newSelection = selectedDrivers.includes(driver.nickName)
        ? selectedDrivers.filter((nick: string) => nick !== driver.nickName)
        : [...selectedDrivers, driver.nickName];

      setValue(name, newSelection);
      onChange?.(newSelection);
    },
    [disabled, selectedDrivers, setValue, name, onChange],
  );

  const displayValue = isOpen ? searchValue : selectedDrivers;

  const handleInputChange = useCallback(
    (value: string) => {
      if (isOpen) {
        debouncedSearch(value);
      }
    },
    [isOpen, debouncedSearch],
  );

  const handleFocus = useCallback(() => {
    setIsOpen(true);
    setSearchValue("");
  }, []);

  const handleBlur = useCallback(() => {
    setTimeout(() => setIsOpen(false), 200);
  }, []);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Box sx={{ position: "relative" }}>
          <TextField
            value={displayValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            variant="outlined"
            fullWidth
            label={label}
            disabled={disabled}
            placeholder="Digite para buscar..."
            sx={{
              mb: 2,
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "#000000",
                opacity: 1,
              },
            }}
          />
          {isOpen && (
            <Paper
              sx={{
                position: "absolute",
                top: "100%",
                width: "100%",
                zIndex: (theme) => theme.zIndex.modal,
                mt: "-16px",
              }}
              elevation={3}
            >
              {!!selectedDrivers.length && (
                <Paper
                  variant="outlined"
                  sx={{
                    maxHeight: 200,
                    overflow: "auto",
                    border: "none",
                    borderBottom: (theme) =>
                      `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <List dense>
                    {selectedDrivers.map((driverNick: string) => (
                      <ListItem key={driverNick} disablePadding>
                        <ListItemButton
                          onClick={() => handleRemoveDriver(driverNick)}
                          disabled={disabled}
                          sx={{
                            "&:hover": {
                              opacity: 0.7,
                            },
                          }}
                        >
                          <ListItemText
                            primary={driverNick}
                            primaryTypographyProps={{
                              fontWeight: "bold",
                              sx: { textTransform: "uppercase" },
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              )}
              <Paper
                variant="outlined"
                sx={{ maxHeight: 300, overflow: "auto", border: "none" }}
              >
                {!drivers && (
                  <Box sx={{ p: 2, textAlign: "center" }}>
                    <Typography>Carregando...</Typography>
                  </Box>
                )}

                {drivers && sortedDrivers.length === 0 && (
                  <Box sx={{ p: 2, textAlign: "center" }}>
                    <Typography>
                      {!searchValue && "Digite para buscar motoristas..."}
                      {searchValue && "Nenhum resultado encontrado"}
                    </Typography>
                  </Box>
                )}

                {drivers && sortedDrivers.length > 0 && (
                  <List>
                    {sortedDrivers.map((driver) => {
                      const isSelected = selectedDrivers.includes(
                        driver.nickName,
                      );

                      const getHoverColor = () => {
                        if (isSelected) {
                          return "primary.main";
                        }
                        return "action.hover";
                      };

                      const getFontWeight = () => {
                        if (isSelected) {
                          return "bold";
                        }
                        return "normal";
                      };

                      return (
                        <ListItem key={driver.id} disablePadding>
                          <ListItemButton
                            onClick={() => handleDriverToggle(driver)}
                            disabled={disabled}
                            selected={isSelected}
                            sx={{
                              "&:hover": {
                                backgroundColor: getHoverColor(),
                              },
                              "&.Mui-selected": {
                                "&:hover": { backgroundColor: "primary.main" },
                              },
                            }}
                          >
                            <ListItemText
                              primary={driver.nickName}
                              primaryTypographyProps={{
                                fontWeight: getFontWeight(),
                                sx: { textTransform: "uppercase" },
                              }}
                            />
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                  </List>
                )}
              </Paper>
            </Paper>
          )}

          {errors[field.name] && (
            <Typography
              variant="caption"
              color="error"
              sx={{ mt: 1, display: "block" }}
            >
              {errors[field.name]?.message?.toString()}
            </Typography>
          )}
        </Box>
      )}
    />
  );
}
