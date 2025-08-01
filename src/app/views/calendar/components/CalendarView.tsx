"use client";

import {
  CalendarProps,
  DayPilot,
  DayPilotCalendar,
  DayPilotNavigator,
  NavigatorProps,
} from "@daypilot/daypilot-lite-react";
import { useMemo, useState } from "react";

export default function CalendarView() {
  const [startDate, setStartDate] = useState(DayPilot.Date.today());

  const rooms = useMemo(() => {
    const items = new Map<
      number,
      {
        name: string;
        id: number;
        businessStarts: DayPilot.Date;
        businessEnds: DayPilot.Date;
      }
    >([
      [
        1,
        {
          name: "Sal 1",
          id: 1,
          businessStarts: DayPilot.Date.today().addHours(8),
          businessEnds: DayPilot.Date.today().addHours(16),
        },
      ],
      [
        2,
        {
          name: "Sal 2",
          id: 2,
          businessStarts: DayPilot.Date.today().addHours(6),
          businessEnds: DayPilot.Date.today().addHours(22),
        },
      ],
      [
        3,
        {
          name: "Sal 3",
          id: 3,
          businessStarts: DayPilot.Date.today().addHours(12),
          businessEnds: DayPilot.Date.today().addHours(20),
        },
      ],
    ]);
    const cols = Array.from(items.values()).map(({ name, id }) => ({
      name,
      id,
    }));
    return { items, cols };
  }, []);

  const events = useMemo(
    () => [
      {
        start: DayPilot.Date.today().addHours(10).addMinutes(30),
        end: DayPilot.Date.today().addHours(12).addMinutes(45),
        id: DayPilot.guid(),
        resource: 1,
        text: "Lorem",
      },
      {
        start: DayPilot.Date.today().addHours(7).addMinutes(15),
        end: DayPilot.Date.today().addHours(10).addMinutes(15),
        id: DayPilot.guid(),
        resource: 2,
        text: "Ipsum",
      },
      {
        start: DayPilot.Date.today().addHours(12).addMinutes(30),
        end: DayPilot.Date.today().addHours(14).addMinutes(0),
        id: DayPilot.guid(),
        resource: 3,
        text: "Dolor",
      },
    ],
    []
  );

  const calendarProps: CalendarProps = useMemo(
    () => ({
      events,
      startDate,
      locale: "cs-cz",
      viewType: "Resources",
      durationBarVisible: true,
      cellDuration: 15,
      columns: rooms.cols,
      onTimeRangeSelected: (args) => {
        console.log(args);
      },
      onBeforeCellRender: (args) => {
        const room = rooms.items.get(args.cell.resource as number);

        if (!room) return;

        if (
          args.cell.start >= room.businessStarts &&
          args.cell.end <= room.businessEnds
        ) {
          args.cell.properties.business = true;
        } else {
          args.cell.properties.business = false;
        }
      },
    }),
    [startDate, events, rooms]
  );

  const navigatorProps: NavigatorProps = useMemo(
    () => ({
      showMonths: 2,
      onTimeRangeSelected: (args) => {
        console.log(args);
        setStartDate(args.start);
      },
    }),
    []
  );

  return (
    <div className="grid grid-cols-[min-content_auto] gap-4">
      <DayPilotNavigator {...navigatorProps} />
      <DayPilotCalendar {...calendarProps} />;
    </div>
  );
}
