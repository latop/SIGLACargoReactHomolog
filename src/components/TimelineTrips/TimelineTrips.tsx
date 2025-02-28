import React from "react";
import Timeline, {
  ItemContext,
  TimelineHeaders,
  SidebarHeader,
  DateHeader,
} from "react-calendar-timeline";
import Tooltip from "@mui/material/Tooltip";
import { useTimelineTrips } from "./useTimelineTrips";
import { red } from "@mui/material/colors";
import { useJourneysByPeriod } from "@/hooks/useJourneysByPeriod";
import {
  TimelineItem,
  TimelineItemSubtitle,
  TimelineItemDestination,
  TimelineItemOrigin,
  TimelineItemTitle,
} from "./TimelineTrips.styles";
import "dayjs/locale/pt-br";
import "react-calendar-timeline/lib/Timeline.css";
import "./Timeline.css";
import { Trip } from "@/interfaces/schedule";

export function TimelineTrips() {
  const [selectedTrip, setSelectedTrip] = React.useState<string>("");
  const { trips, circuits } = useJourneysByPeriod();
  const {
    groups,
    items,
    visibleTimeStart,
    handleTimeChange,
    visibleTimeEnd,
    handleDoubleClick,
    handleLabelFormatItem,
    handleMoveItem,
    handleLabelFormatHeader,
    handleCanvasClick,
  } = useTimelineTrips();

  const handleItemSelect = (itemId: string) => {
    let circuit;
    if (itemId) {
      circuit = circuits?.find((circuit) => circuit.ciruictCode === itemId)
        ?.ciruictCode;
    }
    if (circuit) {
      setSelectedTrip(String(itemId));
    } else {
      circuit = getCircuitByTripId(String(itemId));
    }

    if (circuit) {
      setSelectedTrip(circuit);
    }
  };

  const getCircuitByTripId = (tripId: string) => {
    if (!circuits) return;
    let circuitCode: string | undefined;
    trips.forEach((trip: Trip) => {
      if (trip.id === tripId) {
        circuitCode = trip.circuitCode;
      }
    });
    return circuitCode;
  };

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
    let currentTrip = trips.find((trip: Trip) => trip.id === itemContext.title);
    if (!currentTrip) {
      circuits?.forEach((circuit) => {
        const curr = circuit.trips.find(
          (trip) => trip.id === itemContext.title,
        );
        if (curr) {
          currentTrip = curr;
        }
      });
    }

    const isCircuit = circuits?.some(
      (circuit) => circuit.ciruictCode === itemContext.title,
    );
    const itemProps = getItemProps({});

    const { left: leftResizeProps, right: rightResizeProps } = getResizeProps();
    let backgroundColor;

    if (isCircuit) {
      if (itemContext.selected) {
        backgroundColor = "RGBA(244, 67, 54, 0.3)";
      } else {
        backgroundColor = "rgb(106 144 174 / 20%)";
      }
    } else {
      if (itemContext.selected) {
        backgroundColor = red[500];
      } else {
        backgroundColor = currentTrip?.colorRGB || "#4663ab";
      }
    }
    const borderColor = itemContext.resizing ? red[500] : "transparent";

    return (
      <TimelineItem
        {...itemProps}
        className="giantt-item"
        data-id={itemContext.title}
        isStop={currentTrip?.tripType === "STOP"}
        isCircuit={isCircuit}
        title=""
        selected={itemContext.selected}
      >
        {!!itemContext.useResizeHandle && <div {...leftResizeProps} />}
        {itemContext.dimensions.width > 50 &&
          currentTrip?.locationDestCode &&
          currentTrip?.locationOrigCode && (
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
            isCircuit={!!isCircuit}
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
      lineHeight={50}
      onItemDoubleClick={handleDoubleClick}
      groups={groups}
      items={items}
      canMove
      canResize={false}
      canChangeGroup
      onItemDeselect={() => setSelectedTrip("")}
      onItemSelect={handleItemSelect}
      onItemMove={handleMoveItem}
      onCanvasClick={handleCanvasClick}
      minZoom={60 * 60 * 24}
      stackItems={false}
      maxZoom={604800000}
      selected={[selectedTrip]}
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
