import React from "react";
import Timeline, {
  ItemContext,
  TimelineHeaders,
  SidebarHeader,
  DateHeader,
} from "react-calendar-timeline";
import Tooltip from "@mui/material/Tooltip";
import { useTimelineDailyTrips } from "./useTimelineDailyTrips";
import { red } from "@mui/material/colors";
import {
  TimelineItem,
  TimelineItemSubtitle,
  TimelineItemDestination,
  TimelineItemOrigin,
  TimelineItemTitle,
} from "./TimelineDailyTrips.styles";
import "dayjs/locale/pt-br";
import "react-calendar-timeline/lib/Timeline.css";
import "./Timeline.css";
import { Trip } from "@/interfaces/schedule";
import { useDailyTripsByPeriod } from "@/hooks/useDailyTripsByPeriod";

export function TimelineDailyTrips() {
  const { trips } = useDailyTripsByPeriod();
  const {
    groups,
    items,
    visibleTimeStart,
    handleTimeChange,
    handleDoubleClick,
    visibleTimeEnd,
    handleLabelFormatItem,
    handleLabelFormatHeader,
  } = useTimelineDailyTrips();

  const itemRenderer = ({
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
    const currentTrip = trips.find(
      (trip: Trip) => trip.id === itemContext.title,
    );
    const itemProps = getItemProps({});

    const { left: leftResizeProps, right: rightResizeProps } = getResizeProps();
    let backgroundColor;

    if (itemContext.selected) {
      backgroundColor = red[500];
    } else {
      backgroundColor = currentTrip?.colorRGB || "#4663ab";
    }
    const borderColor = itemContext.resizing ? red[500] : "transparent";
    const style = {
      ...itemProps.style,
      top:
        currentTrip?.tripType === "TRIP EXEC"
          ? `calc(${itemProps.style.top})`
          : `calc(${itemProps.style.top} - 15px)`,
    };
    return (
      <TimelineItem
        {...itemProps}
        key={itemContext.title}
        style={style}
        className="giantt-item"
        data-id={itemContext.title}
        isStop={currentTrip?.tripType === "STOP"}
        title=""
        selected={itemContext.selected}
      >
        {!!itemContext.useResizeHandle && <div {...leftResizeProps} />}
        {itemContext.dimensions.width > 50 &&
          currentTrip?.locationDestCode &&
          currentTrip?.locationOrigCode &&
          currentTrip.tripType === "TRIP" && (
            <TimelineItemSubtitle>
              <TimelineItemOrigin>
                {currentTrip.locationOrigCode}
              </TimelineItemOrigin>
              <TimelineItemDestination>
                {currentTrip.locationDestCode}
              </TimelineItemDestination>
            </TimelineItemSubtitle>
          )}
        <Tooltip title={currentTrip?.code} arrow>
          <TimelineItemTitle
            isStop={currentTrip?.tripType === "STOP"}
            style={{
              backgroundColor,
              borderColor,
            }}
          >
            {!currentTrip?.locationDestCode &&
              currentTrip?.tripType !== "STOP" &&
              currentTrip?.code}
          </TimelineItemTitle>
        </Tooltip>

        {!!itemContext.useResizeHandle && <div {...rightResizeProps} />}
      </TimelineItem>
    );
  };

  return (
    <Timeline
      lineHeight={65}
      groups={groups}
      items={items}
      canMove={false}
      canResize={false}
      onItemDoubleClick={handleDoubleClick}
      canChangeGroup={false}
      minZoom={60 * 60 * 24}
      stackItems={false}
      maxZoom={604800000}
      onTimeChange={handleTimeChange}
      visibleTimeStart={visibleTimeStart}
      itemRenderer={itemRenderer}
      visibleTimeEnd={visibleTimeEnd}
    >
      <TimelineHeaders style={{ position: "sticky", top: 0, zIndex: 100 }}>
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
