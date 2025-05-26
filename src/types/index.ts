export interface PerformanceIndicators {
  "Responsable": string;
  "Alimentation (tsm) - Prévu": number;
  "Alimentation (tsm) - Réalisé": number;
  "Reprise (tsm) - Prévu": number;
  "Reprise (tsm) - Réalisé": number;
  "Lavé Flotté (tsm) - Prévu": number;
  "Lavé Flotté (tsm) - Réalisé": number;
  "Stérile (t) - Prévu": number;
  "Stérile (t) - Réalisé": number;
  "HM(h) - Prévu": number;
  "HM(h) - Réalisé": number;
  "Débit (tsm/h) - Prévu": number;
  "Débit (tsm/h) - Réalisé": number;
  "CS Amine (g/t) - Prévu": number;
  "CS Amine (g/t) - Réalisé": number;
  "CS Acide (g/t) - Prévu": number;
  "CS Acide (g/t) - Réalisé": number;
  "CS Ester (g/t) - Prévu": number;
  "CS Ester (g/t) - Réalisé": number;
  "CS Floculant (g/t) - Prévu": number;
  "CS Floculant (g/t) - Réalisé": number;
}

export interface GlobalSummary {
  "Arrêts Externes (h) - Durée (h)": number;
  "Maintenance et travaux planifiés (h) - Durée (h)": number;
  "Arrêt décidé (h) - Durée (h)": number;
  "Pannes Maintenance (h) - Durée (h)": number;
  "Pannes Installations (h) - Durée (h)": number;
  "Arrêts Utilisation (h) - Durée (h)": number;
  "Arrêts Process (h) - Durée (h)": number;
  "Total des arrêts (h) - Durée (h)": number;
}

export interface ShiftData {
  "Indicateurs Performance": PerformanceIndicators;
  "Synthese Globale": GlobalSummary;
}

export interface DailyData {
  "Day": ShiftData;
  "Night": ShiftData;
}

export interface ShiftsData {
  [date: string]: DailyData;
}

export interface Shift {
  id: string;
  date: string;
  shiftNumber: number; // 1 for Day, 2 for Night
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
  unit?: string;
  category?: string;
  trend?: number;
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
  receivedPhosphate?: number;
  operatingHours?: number;
  maxFlowRate?: number;
  stopsFrequency?: number;
  startupTime?: number;
}