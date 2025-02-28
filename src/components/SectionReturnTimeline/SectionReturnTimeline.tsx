import * as React from "react";
import Timeline from "@mui/lab/Timeline";
import { SxProps } from "@mui/system";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineDot from "@mui/lab/TimelineDot";

interface SectionReturnTimelineProps {
  sx: SxProps;
  size: number;
}
export default function SectinReturnTimeline({
  size,
  sx,
}: SectionReturnTimelineProps) {
  return (
    <Timeline sx={sx}>
      {Array.from({ length: size }).map((_, index) => (
        <TimelineItem key={index}>
          <TimelineSeparator>
            <TimelineDot />
            {index < size - 1 && <TimelineConnector />}
          </TimelineSeparator>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
