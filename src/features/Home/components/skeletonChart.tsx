import { Skeleton } from "@mui/material";
interface Params {
  width?: string;
  height?: string | number;
  bgcolor?: string;
}

const SkeletonChart = ({
  width = "100%",
  height = 300,
  bgcolor = "grey.400",
}: Params) => {
  return (
    <Skeleton
      variant="rectangular"
      width={width}
      height={height}
      sx={{ bgcolor }}
    />
  );
};

export default SkeletonChart;
