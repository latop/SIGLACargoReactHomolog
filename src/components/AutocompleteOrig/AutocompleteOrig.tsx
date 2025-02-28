import React from "react";
// import { useFormContext } from "react-hook-form";
// import { Location } from "@/interfaces/trip";
import {
  AutocompleteLocation,
  AutocompleteLocationProps,
} from "../AutocompleteLocation";

export function AutocompleteOrig(props: AutocompleteLocationProps) {
  // const { setValue } = useFormContext();

  // const handleChange = (value: Location | null) => {
  //   if (props.name) {
  //     setValue(props.name, value);
  //   } else {
  //     setValue("locationOrig", value);
  //     setValue("locationOrigId", value?.id);
  //     setValue("locationOrigCode", value?.code);
  //   }
  // };

  return (
    <AutocompleteLocation
      // onChange={handleChange}
      name="locationOrig"
      {...props}
      label="Origem"
    />
  );
}
