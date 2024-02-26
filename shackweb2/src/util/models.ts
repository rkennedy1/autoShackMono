export interface shacklogItem {
  datetime: Date;
  flow_rate: number;
  temperature: number;
  humidity: number;
}

export interface scheduleItem {
  id: number;
  start_hour: number;
  duration: number;
}

export interface graphProps {
  data: shacklogItem[];
}

export type shacklogGraphItem = {
  date: Date;
  data: number;
};

export type Series = {
  label: string;
  data: shacklogGraphItem[];
};
