export interface ShackSchedule {
  start_hour: string;
  duration: string;
  id: number;
}

export interface SQLUpdateResponse {
  fieldCount: number;
  affectedRows: number;
  insertId: number;
  serverStatus: number;
  warningCount: number;
  message: string;
  protocol41: boolean;
  changedRows: number;
}

export interface shackLogItem {
  id: number;
  datetime: Date;
  humdity: number;
  temperature: number;
  flow_rate: number;
  pump_status: string;
  execution_time: number;
}
