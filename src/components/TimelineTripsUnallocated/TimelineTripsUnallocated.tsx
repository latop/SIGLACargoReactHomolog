import React from "react";
import Timeline, {
  ItemContext,
  TimelineHeaders,
  SidebarHeader,
  DateHeader,
} from "react-calendar-timeline";
import { useSearchParams } from "next/navigation";
import { useDailyTripsUnallocated } from "@/hooks/useDailyTripsUnallocated";
import { DailyTripSection } from "@/interfaces/schedule";
import { useTimelineTripsUnallocated } from "./useTimelineTripsUnallocated";
import { Box, IconButton, Tooltip } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { red } from "@mui/material/colors";
import {
  TimelineItem,
  TimelineItemSubtitle,
  TimelineItemDestination,
  TimelineItemOrigin,
  TimelineItemTitle,
} from "./TimelineTripsUnallocated.styles";
import "dayjs/locale/pt-br";
import "react-calendar-timeline/lib/Timeline.css";
import "./Timeline.css";

export function TimelineTripsUnallocated() {
  const searchParams = useSearchParams();
  const { dailyTripsUnallocated } = useDailyTripsUnallocated();
  const {
    groups,
    items,
    visibleTimeStart,
    handleTimeChange,
    selectedDailyTrip,
    visibleTimeEnd,
    handleLabelFormatItem,
    handleLabelFormatHeader,
    handleItemClick,
    handleDeselectItem,
    handleGroupItemClick,
  } = useTimelineTripsUnallocated();

  function findSectionById(sectionId: string) {
    if (!dailyTripsUnallocated) return null;

    for (const trip of dailyTripsUnallocated) {
      const section = trip.sectionsUnallocated.find(
        (section: DailyTripSection) => section.dailyTripSectionId === sectionId,
      );

      if (section) {
        return {
          lineCode: trip.lineCode,
          ...section,
        };
      }
    }

    return null;
  }

  const itemRenderer = ({
    item,
    itemContext,
    getItemProps,
    getResizeProps,
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    item: any;
    itemContext: ItemContext;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getItemProps: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getResizeProps: any;
  }) => {
    const { left: leftResizeProps, right: rightResizeProps } = getResizeProps();
    const currentTrip = findSectionById(item.id);
    const selected =
      currentTrip?.dailyTripId === selectedDailyTrip?.dailyTripId ||
      itemContext.selected;
    const backgroundColor = selected ? red[500] : "#4663ab";
    const borderColor = itemContext.resizing ? red[500] : item.color;

    return (
      <Tooltip title={currentTrip?.lineCode} arrow>
        <TimelineItem {...getItemProps({})} className="giantt-item">
          {!!itemContext.useResizeHandle && <div {...leftResizeProps} />}
          {itemContext.dimensions.width > 40 &&
            currentTrip?.locDest &&
            currentTrip?.locOrig && (
              <TimelineItemSubtitle>
                <TimelineItemOrigin>{currentTrip.locOrig}</TimelineItemOrigin>
                <TimelineItemDestination>
                  {currentTrip.locDest}
                </TimelineItemDestination>
              </TimelineItemSubtitle>
            )}
          <TimelineItemTitle
            style={{
              height: `calc(${itemContext.dimensions.height} - 15px)`,
              backgroundColor,
              borderColor,
            }}
          />

          {!!itemContext.useResizeHandle && <div {...rightResizeProps} />}
        </TimelineItem>
      </Tooltip>
    );
  };

  const groupRenderer = ({
    group,
  }: {
    group: { id: string; title: string };
  }) => {
    return (
      <div className="custom-group">
        <Box display="flex">
          <span className="title">{group.title}</span>
          <IconButton onClick={() => handleGroupItemClick(group.id)}>
            <FilterListIcon
              fontSize="small"
              color={
                searchParams.get("demandAvailable") === group.title
                  ? "primary"
                  : "disabled"
              }
            />
          </IconButton>
        </Box>
      </div>
    );
  };

  return (
    <Timeline
      lineHeight={40}
      groups={groups}
      items={items}
      canMove={false}
      canResize={false}
      canChangeGroup={false}
      // onItemMove={handleMoveItem}
      className="timeline-trips-unallocated"
      groupRenderer={groupRenderer}
      onItemSelect={handleItemClick}
      minZoom={60 * 60 * 24}
      stackItems
      maxZoom={604800000}
      onItemClick={handleItemClick}
      onItemDeselect={handleDeselectItem}
      onTimeChange={handleTimeChange}
      visibleTimeStart={visibleTimeStart}
      itemRenderer={itemRenderer}
      visibleTimeEnd={visibleTimeEnd}
    >
      <TimelineHeaders
        className="timeline-trips-unallocated-header"
        style={{ position: "sticky", top: 0 }}
      >
        <SidebarHeader>
          {({ getRootProps }) => {
            return <div {...getRootProps()} />;
          }}
        </SidebarHeader>
        <DateHeader
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore next line
          labelFormat={handleLabelFormatHeader}
          unit="primaryHeader"
        />
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore next line */}
        <DateHeader labelFormat={handleLabelFormatItem} />
      </TimelineHeaders>
    </Timeline>
  );
}
