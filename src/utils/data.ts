import { addDays, format, isSameDay, parseISO, subDays } from 'date-fns';
import { ConsumptionData, DailyShifts, DateRange, KPI, Shift, ShiftReportFilters, ShiftsData } from '../types';
import { shiftsData } from '../data/shifts';

// Get default date range (last 7 days)
export const getDefaultDateRange = (): DateRange => {
  const endDate = new Date('2025-05-14');
  const startDate = new Date('2025-05-12');
  return { startDate, endDate };
};

// Convert new format to old format for compatibility
const convertToShiftFormat = (date: string, shiftType: 'Day' | 'Night', data: any): Shift => {
  const indicators = data["Indicateurs Performance"];
  const summary = data["Synthese Globale"];
  
  return {
    id: `${date}-${shiftType}`,
    date,
    shiftNumber: shiftType === 'Day' ? 1 : 2,
    startTime: shiftType === 'Day' ? '07:00' : '19:00',
    endTime: shiftType === 'Day' ? '19:00' : '07:00',
    finalProductTonnes: indicators["Lavé Flotté (tsm) - Réalisé"],
    operatingHours: indicators["HM(h) - Réalisé"],
    maxFlowRate: indicators["Débit (tsm/h) - Réalisé"],
    stopsFrequency: 0, // Calculate from summary if needed
    efficiency: (indicators["HM(h) - Réalisé"] / indicators["HM(h) - Prévu"]) * 100,
    downtime: summary["Total des arrêts (h) - Durée (h)"] * 60, // Convert to minutes
    qualityRate: 100, // Calculate if needed
    oreFlowrate: indicators["Alimentation (tsm) - Réalisé"],
    startupTime: 0, // Calculate if needed
    esterConsumption: indicators["CS Ester (g/t) - Réalisé"],
    aminConsumption: indicators["CS Amine (g/t) - Réalisé"],
    acidConsumption: indicators["CS Acide (g/t) - Réalisé"],
    floculantConsumption: indicators["CS Floculant (g/t) - Réalisé"],
    receivedPhosphate: indicators["Reprise (tsm) - Réalisé"],
    responsible: indicators["Responsable"],
    notes: `Feed Rate: ${indicators["Alimentation (tsm) - Réalisé"]} T (Target: ${indicators["Alimentation (tsm) - Prévu"]} T)\n` +
           `Recovery Rate: ${indicators["Reprise (tsm) - Réalisé"]} T (Target: ${indicators["Reprise (tsm) - Prévu"]} T)\n` +
           `Waste Rate: ${indicators["Stérile (t) - Réalisé"]} T (Target: ${indicators["Stérile (t) - Prévu"]} T)`
  };
};

// Get shifts data
export const getShiftsData = (): Shift[] => {
  const shifts: Shift[] = [];
  
  Object.entries(shiftsData).forEach(([date, dailyData]) => {
    if (dailyData.Day) {
      shifts.push(convertToShiftFormat(date, 'Day', dailyData.Day));
    }
    if (dailyData.Night) {
      shifts.push(convertToShiftFormat(date, 'Night', dailyData.Night));
    }
  });
  
  return shifts;
};

// Group shifts by date for display
export const groupShiftsByDate = (shifts: Shift[]): DailyShifts[] => {
  const groupedByDate: { [date: string]: Shift[] } = {};
  
  shifts.forEach(shift => {
    if (!groupedByDate[shift.date]) {
      groupedByDate[shift.date] = [];
    }
    groupedByDate[shift.date].push(shift);
  });
  
  return Object.entries(groupedByDate).map(([date, shifts]) => {
    const totalProduction = shifts.reduce((sum, shift) => sum + shift.finalProductTonnes, 0);
    const avgEfficiency = shifts.reduce((sum, shift) => sum + shift.efficiency, 0) / shifts.length;
    const totalDowntime = shifts.reduce((sum, shift) => sum + shift.downtime, 0);
    
    return {
      date,
      shifts,
      totalProduction,
      avgEfficiency,
      totalDowntime
    };
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Filter shifts based on date range and other filters
export const filterShifts = (shifts: Shift[], filters: ShiftReportFilters): Shift[] => {
  const { dateRange, shiftNumber, responsible } = filters;
  
  return shifts.filter(shift => {
    const shiftDate = parseISO(shift.date);
    const inDateRange = shiftDate >= dateRange.startDate && shiftDate <= dateRange.endDate;
    const matchesShiftNumber = shiftNumber ? shift.shiftNumber === shiftNumber : true;
    const matchesResponsible = responsible ? shift.responsible === responsible : true;
    
    return inDateRange && matchesShiftNumber && matchesResponsible;
  });
};

// Find the top performing shift
export const findTopShift = (shifts: Shift[]): Shift | null => {
  if (shifts.length === 0) return null;
  
  return shifts.reduce((topShift, currentShift) => {
    return currentShift.finalProductTonnes > topShift.finalProductTonnes ? currentShift : topShift;
  }, shifts[0]);
};

// Calculate total consumption across shifts
export const calculateTotalConsumption = (shifts: Shift[]): ConsumptionData => {
  const initialConsumption = { ester: 0, amin: 0, acid: 0, floculant: 0 };
  
  return shifts.reduce((total, shift) => {
    return {
      ester: total.ester + (shift.esterConsumption || 0),
      amin: total.amin + (shift.aminConsumption || 0),
      acid: total.acid + (shift.acidConsumption || 0),
      floculant: total.floculant + (shift.floculantConsumption || 0),
    };
  }, initialConsumption);
};

// Calculate KPIs based on filtered shifts
export const calculateKPIs = (shifts: Shift[]): KPI[] => {
  if (shifts.length === 0) {
    return [];
  }
  
  // Calculate averages and totals
  const totalProduction = shifts.reduce((sum, shift) => sum + shift.finalProductTonnes, 0);
  const avgProduction = totalProduction / shifts.length;
  const avgOperatingHours = shifts.reduce((sum, shift) => sum + shift.operatingHours, 0) / shifts.length;
  const avgMaxFlowRate = shifts.reduce((sum, shift) => sum + shift.maxFlowRate, 0) / shifts.length;
  const avgOreFlowrate = shifts.reduce((sum, shift) => sum + (shift.oreFlowrate || 0), 0) / shifts.length;
  const totalEsterConsumption = shifts.reduce((sum, shift) => sum + (shift.esterConsumption || 0), 0);
  const totalAminConsumption = shifts.reduce((sum, shift) => sum + (shift.aminConsumption || 0), 0);
  const totalAcidConsumption = shifts.reduce((sum, shift) => sum + (shift.acidConsumption || 0), 0);
  const totalFloculantConsumption = shifts.reduce((sum, shift) => sum + (shift.floculantConsumption || 0), 0);
  const totalReceivedPhosphate = shifts.reduce((sum, shift) => sum + (shift.receivedPhosphate || 0), 0);
  
  // Get previous period for trend calculation
  const avgPreviousPeriod = calculatePreviousPeriodAvg(shifts);
  
  return [
    {
      name: 'Operating Hours',
      value: avgOperatingHours,
      target: 12,
      unit: 'Hr',
      trend: getTrend(avgOperatingHours, avgPreviousPeriod.operatingHours),
      color: 'primary',
      category: 'operating'
    },
    {
      name: 'Final Product',
      value: avgProduction,
      target: 2500,
      unit: 'T',
      trend: getTrend(avgProduction, avgPreviousPeriod.production),
      color: 'secondary',
      category: 'production'
    },
    {
      name: 'Feed Rate',
      value: avgOreFlowrate,
      target: 2500,
      unit: 'T',
      trend: getTrend(avgOreFlowrate, avgPreviousPeriod.oreFlowrate),
      color: 'primary',
      category: 'flow'
    },
    {
      name: 'Maximum Flow Rate',
      value: avgMaxFlowRate,
      target: 346,
      unit: 'T/Hr',
      trend: getTrend(avgMaxFlowRate, avgPreviousPeriod.maxFlowRate),
      color: 'accent',
      category: 'flow'
    },
    {
      name: 'Ester Consumption',
      value: totalEsterConsumption,
      target: 250,
      unit: 'g/t',
      trend: getTrend(totalEsterConsumption, avgPreviousPeriod.esterConsumption),
      color: 'accent',
      category: 'chemical'
    },
    {
      name: 'Amin Consumption',
      value: totalAminConsumption,
      target: 250,
      unit: 'g/t',
      trend: getTrend(totalAminConsumption, avgPreviousPeriod.aminConsumption),
      color: 'accent',
      category: 'chemical'
    },
    {
      name: 'Acid Consumption',
      value: totalAcidConsumption,
      target: 500,
      unit: 'g/t',
      trend: getTrend(totalAcidConsumption, avgPreviousPeriod.acidConsumption),
      color: 'accent',
      category: 'chemical'
    },
    {
      name: 'Floculant Consumption',
      value: totalFloculantConsumption,
      target: 10,
      unit: 'g/t',
      trend: getTrend(totalFloculantConsumption, avgPreviousPeriod.floculantConsumption),
      color: 'accent',
      category: 'chemical'
    },
    {
      name: 'Recovery Rate',
      value: totalReceivedPhosphate,
      target: 4150,
      unit: 'T',
      trend: getTrend(totalReceivedPhosphate, avgPreviousPeriod.receivedPhosphate),
      color: 'secondary',
      category: 'production'
    },
    {
      name: 'Waste Rate',
      value: shifts.reduce((sum, shift) => sum + (shift.oreFlowrate || 0), 0) / shifts.length,
      target: 125,
      unit: 'T',
      trend: getTrend(avgOreFlowrate, avgPreviousPeriod.oreFlowrate, true),
      color: 'warning',
      category: 'production'
    }
  ];
};

// Determine trend direction (up is good, down is bad, unless isInverse)
const getTrend = (current: number, previous: number, isInverse = false): 'up' | 'down' | 'stable' => {
  const threshold = 0.05; // 5% change threshold
  const percentChange = previous > 0 ? (current - previous) / previous : 0;
  
  if (Math.abs(percentChange) < threshold) {
    return 'stable';
  }
  
  const isImproving = percentChange > 0;
  
  // For inverse metrics like downtime, lower is better
  if (isInverse) {
    return isImproving ? 'down' : 'up';
  }
  
  return isImproving ? 'up' : 'down';
};

// Calculate average metrics from a previous period for trend comparison
const calculatePreviousPeriodAvg = (shifts: Shift[]) => {
  const avgProduction = shifts.reduce((sum, shift) => sum + shift.finalProductTonnes, 0) / shifts.length;
  const avgOperatingHours = shifts.reduce((sum, shift) => sum + shift.operatingHours, 0) / shifts.length;
  const avgMaxFlowRate = shifts.reduce((sum, shift) => sum + shift.maxFlowRate, 0) / shifts.length;
  const avgStopsFrequency = shifts.reduce((sum, shift) => sum + shift.stopsFrequency, 0) / shifts.length;
  const avgOreFlowrate = shifts.reduce((sum, shift) => sum + (shift.oreFlowrate || 0), 0) / shifts.length;
  const avgStartupTime = shifts.reduce((sum, shift) => sum + (shift.startupTime || 0), 0) / shifts.length;
  const totalEsterConsumption = shifts.reduce((sum, shift) => sum + (shift.esterConsumption || 0), 0);
  const totalAminConsumption = shifts.reduce((sum, shift) => sum + (shift.aminConsumption || 0), 0);
  const totalAcidConsumption = shifts.reduce((sum, shift) => sum + (shift.acidConsumption || 0), 0);
  const totalFloculantConsumption = shifts.reduce((sum, shift) => sum + (shift.floculantConsumption || 0), 0);
  const totalReceivedPhosphate = shifts.reduce((sum, shift) => sum + (shift.receivedPhosphate || 0), 0);
  
  // Randomly adjust values slightly to simulate trends
  const randomFactor = () => 0.9 + Math.random() * 0.2; // 0.9 to 1.1
  
  return {
    production: avgProduction * randomFactor(),
    operatingHours: avgOperatingHours * randomFactor(),
    maxFlowRate: avgMaxFlowRate * randomFactor(),
    stopsFrequency: avgStopsFrequency * randomFactor(),
    oreFlowrate: avgOreFlowrate * randomFactor(),
    startupTime: avgStartupTime * randomFactor(),
    esterConsumption: totalEsterConsumption * randomFactor(),
    aminConsumption: totalAminConsumption * randomFactor(),
    acidConsumption: totalAcidConsumption * randomFactor(),
    floculantConsumption: totalFloculantConsumption * randomFactor(),
    receivedPhosphate: totalReceivedPhosphate * randomFactor()
  };
};

// Format date for display
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM dd, yyyy');
};

// Format shift time for display
export const formatShiftTime = (shift: Shift): string => {
  return `${shift.startTime} - ${shift.endTime}`;
};

// Determine if a shift is the current date's shift
export const isCurrentDayShift = (shift: Shift): boolean => {
  const today = new Date();
  return isSameDay(parseISO(shift.date), today);
};

// Format shift identifier
export const formatShiftIdentifier = (shift: Shift): string => {
  return `${formatDate(shift.date)} - Shift ${shift.shiftNumber}`;
};

// Get unique responsibles from shifts
export const getUniqueResponsibles = (shifts: Shift[]): string[] => {
  const responsibles = new Set<string>();
  
  shifts.forEach(shift => {
    if (shift.responsible) {
      responsibles.add(shift.responsible);
    }
  });
  
  return Array.from(responsibles).sort();
};