import { CustomChartBarData } from "@/components/charts";
import HorizontalBars from "@/components/charts/horizontalBars.charts";
import { Container } from "@mui/material";

interface Params {
  data: CustomChartBarData;
}

const TripsChart = ({ data }: Params) => {
  return (
    <Container>
      <HorizontalBars
        title="Viagens por tipo"
        labels={data.labels as string[]}
        data={data}
      />
    </Container>
  );
};

export default TripsChart;
