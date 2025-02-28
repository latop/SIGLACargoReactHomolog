import React from "react";
// import { useFormContext } from "react-hook-form";
// import { Location } from "@/interfaces/trip";
import {
  AutocompleteLocation,
  AutocompleteLocationProps,
} from "../AutocompleteLocation";

export function AutocompleteDest(props: AutocompleteLocationProps) {
  // const { setValue } = useFormContext();

  // const handleChange = (value: Location | null) => {
  //   setValue("locationDest", value);
  //   setValue("locationDestId", value?.id);
  //   setValue("locationDestCode", value?.code);
  // };

  return (
    <AutocompleteLocation name="locationDest" {...props} label="Destino" />
  );
}
