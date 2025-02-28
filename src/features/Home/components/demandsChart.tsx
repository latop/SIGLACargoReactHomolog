import { CustomChartBarData } from "@/components/charts";
import StackedBars from "@/components/charts/stackedBars.chart";
import { Container } from "@mui/material";

interface Params {
  data: CustomChartBarData;
}
const DemandsChart = ({ data }: Params) => {
  return (
    <Container>
      <StackedBars
        title="Total de Demandas por Base"
        labels={data.labels as string[]}
        data={data}
      />
    </Container>
  );
};

export default DemandsChart;
