import { addDays, format, isSameDay, parseISO, subDays } from 'date-fns';
import { ConsumptionData, DailyShifts, DateRange, KPI, Shift, ShiftReportFilters } from '../types';
import { shiftsData } from '../data/shifts';

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
  
  const totalProduction = shifts.reduce((sum, shift) => sum + shift.finalProductTonnes, 0);
  const avgProduction = totalProduction / shifts.length;
  const avgEfficiency = shifts.reduce((sum, shift) => sum + shift.efficiency, 0) / shifts.length;
  const avgDowntime = shifts.reduce((sum, shift) => sum + shift.downtime, 0) / shifts.length;
  const avgQualityRate = shifts.reduce((sum, shift) => sum + shift.qualityRate, 0) / shifts.length;
  const avgStopsFrequency = shifts.reduce((sum, shift) => sum + shift.stopsFrequency, 0) / shifts.length;
  
  // Get previous period for trend calculation
  const avgPreviousPeriod = calculatePreviousPeriodAvg(shifts);
  
  return [
    {
      name: 'Avg Production',
      value: avgProduction,
      target: 5000,
      unit: 'T',
      trend: getTrend(avgProduction, avgPreviousPeriod.production),
      color: 'primary',
    },
    {
      name: 'Efficiency',
      value: avgEfficiency,
      target: 95,
      unit: '%',
      trend: getTrend(avgEfficiency, avgPreviousPeriod.efficiency),
      color: 'secondary',
    },
    {
      name: 'Downtime',
      value: avgDowntime,
      target: 60,
      unit: 'min',
      trend: getTrend(avgDowntime, avgPreviousPeriod.downtime, true),
      color: 'warning',
    },
    {
      name: 'Quality Rate',
      value: avgQualityRate,
      target: 95,
      unit: '%',
      trend: getTrend(avgQualityRate, avgPreviousPeriod.qualityRate),
      color: 'accent',
    },
    {
      name: 'Stop Frequency',
      value: avgStopsFrequency,
      target: 5,
      unit: '',
      trend: getTrend(avgStopsFrequency, avgPreviousPeriod.stopsFrequency, true),
      color: 'error',
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
  // This is simplified - in a real app, you'd look at the previous matching period
  // For now, we'll just return slightly different values to show the trends
  const avgProduction = shifts.reduce((sum, shift) => sum + shift.finalProductTonnes, 0) / shifts.length;
  const avgEfficiency = shifts.reduce((sum, shift) => sum + shift.efficiency, 0) / shifts.length;
  const avgDowntime = shifts.reduce((sum, shift) => sum + shift.downtime, 0) / shifts.length;
  const avgQualityRate = shifts.reduce((sum, shift) => sum + shift.qualityRate, 0) / shifts.length;
  const avgStopsFrequency = shifts.reduce((sum, shift) => sum + shift.stopsFrequency, 0) / shifts.length;
  
  // Randomly adjust values slightly to simulate trends
  const randomFactor = () => 0.9 + Math.random() * 0.2; // 0.9 to 1.1
  
  return {
    production: avgProduction * randomFactor(),
    efficiency: avgEfficiency * randomFactor(),
    downtime: avgDowntime * randomFactor(),
    qualityRate: avgQualityRate * randomFactor(),
    stopsFrequency: avgStopsFrequency * randomFactor()
  };
};

// Generate the default date range (last 7 days)
export const getDefaultDateRange = (): DateRange => {
  const endDate = new Date();
  const startDate = subDays(endDate, 6); // 7 days including today
  
  return { startDate, endDate };
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

// Get shifts data - either from imported data or generated
export const getShiftsData = (): Shift[] => {
  // Return the data from the generated file
  return shiftsData;
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