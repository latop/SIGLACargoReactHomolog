import { Line } from "./daily-trip";
import { PaginationResponse } from "./pagination";

export interface Scenario {
  id: string | null;
  code: string;
  description: string;
  startDate: string;
  endDate: string;
  createAt: string;
  updateAt: string | null;
  userIdCreate: string | null;
  userIdUpdate: string | null;
  isDated: boolean;
  isDefault: boolean;
}

export interface WeekSchedule {
  mon: number;
  startTimeMon: string;
  tue: number;
  startTimeTue: string;
  wed: number;
  startTimeWed: string;
  thu: number;
  startTimeThu: string;
  fri: number;
  startTimeFri: string;
  sat: number;
  startTimeSat: string;
  sun: number;
  startTimeSun: string;
}

export interface ScenarioCapacity extends WeekSchedule {
  scenarioId: string;
  lineId: string;
  line: Line;
}

export interface ScenarioResponse extends PaginationResponse {
  scenarios: Scenario[];
}
