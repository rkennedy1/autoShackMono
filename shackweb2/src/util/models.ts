export interface shacklogItem {
  datetime: Date;
  flow_rate: number;
  temperature: number;
  humidity: number;
}

export interface scheduleItem {
  start_hour: number;
  duration: number;
}
