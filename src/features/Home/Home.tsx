"use client";
import { AppBar } from "@/components/AppBar";
import { HeaderTitle } from "@/components/HeaderTitle/HeaderTitle";
import { MainContainer } from "@/components/MainContainer";
import { useGetDashboardQuery } from "@/services/query/dashboard";
import {
  Box,
  Card,
  CardContent,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import DemandsChart from "./components/demandsChart";
import SkeletonChart from "./components/skeletonChart";
import TripAttribChart from "./components/tripAttribChart";
import TripsChart from "./components/tripsChart";
import TripsCompletedCard from "./components/tripsCompletedChart";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const graphNameList = [
  "Demandas",
  "Viagens",
  "Viagens Atribuídas",
  "Viagens Completadas",
];

interface GraphToShow {
  name: string;
  data: JSX.Element | undefined;
}

export function Home() {
  const { data, isLoading, isError } = useQuery({
    ...useGetDashboardQuery,
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
    refetchInterval: 30 * 60 * 1000, // 30 minutes
  });
  const [graphSelected, setGraphSelected] = useState<string[]>(graphNameList);
  const [graphBaseList, setGraphBaseList] = useState<GraphToShow[]>([]);
  const [graphToShow, setGraphToShow] = useState<GraphToShow[]>([]);

  const updateGraphToShow = (
    newGraphSelected?: string[],
    newGraphBaseList?: GraphToShow[],
  ) => {
    if (!newGraphSelected) {
      newGraphSelected = graphSelected;
    }
    if (!newGraphBaseList) {
      newGraphBaseList = graphBaseList;
    }

    const newGraphToShow: GraphToShow[] = [];
    newGraphSelected.forEach((graphName) => {
      const graph = newGraphBaseList?.find(
        (graph) => graph?.name === graphName,
      );
      if (graph) {
        newGraphToShow.push(graph);
      }
    });
    setGraphToShow(newGraphToShow);
  };

  const handleChange = (event: SelectChangeEvent<typeof graphNameList>) => {
    const {
      target: { value },
    } = event;
    if (value.length > 0) {
      const newGraphSelected =
        typeof value === "string" ? value.split(",") : value;
      setGraphSelected(newGraphSelected);
      updateGraphToShow(newGraphSelected);
    }
  };

  const CalcGridColumns = (index: number) => {
    const qtdGraphs = graphToShow.length;
    if (qtdGraphs === 1) {
      return 12;
    }
    if (qtdGraphs % 2 === 0) {
      return 6;
    }
    return qtdGraphs % 2 === 1 && index + 1 === qtdGraphs ? 12 : 6;
  };

  useEffect(() => {
    const newGraphs = [
      {
        name: "Demandas",
        data: data?.dashboardDemands ? (
          <DemandsChart data={data.dashboardDemands} />
        ) : undefined,
      },
      {
        name: "Viagens",
        data: data?.dashboardTrips ? (
          <TripsChart data={data.dashboardTrips} />
        ) : undefined,
      },
      {
        name: "Viagens Atribuídas",
        data: data?.dashboardTripsAttrib ? (
          <TripAttribChart data={data.dashboardTripsAttrib} />
        ) : undefined,
      },
      {
        name: "Viagens Completadas",
        data: data?.dashboardTripsCompleted ? (
          <TripsCompletedCard data={data.dashboardTripsCompleted} />
        ) : undefined,
      },
    ];
    setGraphBaseList(newGraphs);
    updateGraphToShow(undefined, newGraphs);
  }, [data]);

  return (
    <MainContainer>
      <AppBar>
        <HeaderTitle>Home</HeaderTitle>
      </AppBar>
      {isError && <div>Error</div>}

      {isLoading && (
        <Grid sx={{ padding: 4 }} container rowSpacing={4} columnSpacing={4}>
          <Grid item xs={6}>
            {" "}
            <SkeletonChart />{" "}
          </Grid>
          <Grid item xs={6}>
            {" "}
            <SkeletonChart />{" "}
          </Grid>
          <Grid item xs={6}>
            {" "}
            <SkeletonChart />{" "}
          </Grid>
          <Grid item xs={6}>
            {" "}
            <SkeletonChart />{" "}
          </Grid>
        </Grid>
      )}

      {!isLoading && (
        <Box sx={{ padding: 2 }}>
          <Card>
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <FormControl sx={{ width: 510 }}>
                <InputLabel>Exibir</InputLabel>
                <Select
                  labelId="multiple-chip-label"
                  id="multiple-chip"
                  multiple
                  value={graphSelected}
                  onChange={handleChange}
                  input={
                    <OutlinedInput id="select-multiple-chip" label="Exibir" />
                  }
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {graphNameList.map((name) => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </CardContent>
          </Card>
          <Card sx={{ marginTop: 2 }}>
            <CardContent>
              <Grid container rowSpacing={4} columnSpacing={4}>
                {graphToShow.map((graph, index) => (
                  <Grid key={index} item xs={CalcGridColumns(index)}>
                    {graphSelected.includes(graph.name) && graph.data}
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Box>
      )}
    </MainContainer>
  );
}
