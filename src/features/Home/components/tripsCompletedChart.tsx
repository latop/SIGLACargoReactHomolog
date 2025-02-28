import { CustomChartBarData } from "@/components/charts";
import HorizontalBars from "@/components/charts/horizontalBars.charts";
import { Container } from "@mui/material";

interface Params {
  data: CustomChartBarData;
}

const TripsCompletedCard = ({ data }: Params) => {
  return (
    <Container>
      <HorizontalBars
        title="Quantidade de Viagens Realizadas"
        labels={data.labels as string[]}
        data={data}
      />
    </Container>
  );
};

export default TripsCompletedCard;
