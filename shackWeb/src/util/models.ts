export interface shacklogItem {
  datetime: Date;
  flow_rate: number;
  temperature: number;
  humidity: number;
}

export interface scheduleItem {
  id?: number;
  start_hour: number;
  duration: number;
}

export type shacklogGraphItem = {
  date: Date;
  data: number;
};

export type Series = {
  label: string;
  data: shacklogGraphItem[];
};

export type growWeek = {
  stage: "bloom" | "veg";
  week: number;
};
