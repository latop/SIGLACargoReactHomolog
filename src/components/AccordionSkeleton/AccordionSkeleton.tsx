import { Accordion, AccordionSummary, Skeleton, Stack } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { grey } from "@mui/material/colors";

interface AccordionSkeletonProps {
  count?: number;
  height?: string;
}

const ACCORDION_SUMMARY_STYLE = {
  backgroundColor: grey[500],
};

export const AccordionSkeleton = ({
  count = 3,
  height = "80px",
}: AccordionSkeletonProps) => {
  return (
    <Stack>
      {[...Array(count)].map((_, index) => (
        <Accordion
          key={index}
          disabled
          sx={{
            height,
            "&.Mui-disabled": {
              opacity: 0.5,
              backgroundColor: grey[100],
            },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              "& .MuiAccordionSummary-content": { alignItems: "center" },
              height: "60px",
            }}
          >
            <Skeleton
              variant="text"
              width="60%"
              height={24}
              sx={ACCORDION_SUMMARY_STYLE}
            />
            <Skeleton
              variant="circular"
              width={24}
              height={24}
              sx={{ ml: "auto", ...ACCORDION_SUMMARY_STYLE }}
            />
          </AccordionSummary>
        </Accordion>
      ))}
    </Stack>
  );
};
