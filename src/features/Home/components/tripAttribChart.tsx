import { CustomChartBarData } from "@/components/charts";
import HorizontalBars from "@/components/charts/horizontalBars.charts";
import { Container } from "@mui/material";

interface Params {
  data: CustomChartBarData;
}

const TripAttribChart = ({ data }: Params) => {
  return (
    <Container>
      <HorizontalBars
        title="Quantidade de Viagens Produtivas Atribuidas"
        labels={data.labels as string[]}
        data={data}
      />
    </Container>
  );
};

export default TripAttribChart;
