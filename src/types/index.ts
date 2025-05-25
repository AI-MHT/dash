export interface Shift {
  id: string;
  date: string;
  shiftNumber: number; // 1 or 2
  startTime: string;
  endTime: string;
  finalProductTonnes: number;
  operatingHours: number;
  maxFlowRate: number;
  stopsFrequency: number;
  efficiency: number;
  downtime: number;
  qualityRate: number;
  oreFlowrate?: number;
  startupTime?: number;
  esterConsumption?: number;
  aminConsumption?: number;
  acidConsumption?: number;
  floculantConsumption?: number;
  receivedPhosphate?: number;
  notes?: string;
  responsible?: string;
}

export interface DailyShifts {
  date: string;
  shifts: Shift[];
  totalProduction: number;
  avgEfficiency: number;
  totalDowntime: number;
}

export interface KPI {
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface ShiftReportFilters {
  dateRange: DateRange;
  shiftNumber?: number | null;
  responsible?: string | null;
}

export interface ConsumptionData {
  ester: number;
  amin: number;
  acid: number;
  floculant: number;
}