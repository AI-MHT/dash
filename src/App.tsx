import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import KPICards from './components/KPICards';
import ShiftChart from './components/ShiftChart';
import ShiftTable from './components/ShiftTable';
import TopShiftCard from './components/TopShiftCard';
import ConsumptionCard from './components/ConsumptionCard';
import ShiftDetail from './components/ShiftDetail';
import { 
  calculateKPIs, 
  calculateTotalConsumption,
  filterShifts, 
  findTopShift, 
  getDefaultDateRange, 
  getShiftsData, 
  groupShiftsByDate,
  getUniqueResponsibles
} from './utils/data';
import { generatePDF } from './utils/pdf';
import { DateRange, KPI, Shift, ShiftReportFilters } from './types';

function App() {
  // State for shifts data and filters
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [filters, setFilters] = useState<ShiftReportFilters>({
    dateRange: getDefaultDateRange(),
  });
  
  // Derived state
  const [filteredShifts, setFilteredShifts] = useState<Shift[]>([]);
  const [dailyShifts, setDailyShifts] = useState(groupShiftsByDate([]));
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [topShift, setTopShift] = useState<Shift | null>(null);
  const [consumptionData, setConsumptionData] = useState({
    ester: 0,
    amin: 0,
    acid: 0,
    floculant: 0
  });
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  
  // Load shifts data on mount
  useEffect(() => {
    const shiftsData = getShiftsData();
    setShifts(shiftsData);
  }, []);
  
  // Update filtered data when shifts or filters change
  useEffect(() => {
    const filtered = filterShifts(shifts, filters);
    setFilteredShifts(filtered);
    
    // Calculate derived data
    const groupedShifts = groupShiftsByDate(filtered);
    setDailyShifts(groupedShifts);
    
    const calculatedKpis = calculateKPIs(filtered);
    setKpis(calculatedKpis);
    
    const top = findTopShift(filtered);
    setTopShift(top);
    
    const consumption = calculateTotalConsumption(filtered);
    setConsumptionData(consumption);
  }, [shifts, filters]);
  
  // Handle date range change
  const handleDateRangeChange = (dateRange: DateRange) => {
    setFilters({
      ...filters,
      dateRange,
    });
  };
  
  // Handle shift filter change
  const handleShiftFilterChange = (shiftNumber: number | null) => {
    setFilters({
      ...filters,
      shiftNumber,
    });
  };
  
  // Handle responsible filter change
  const handleResponsibleFilterChange = (responsible: string | null) => {
    setFilters({
      ...filters,
      responsible,
    });
  };
  
  // Handle PDF export
  const handleExportPDF = () => {
    generatePDF(filteredShifts, kpis, dailyShifts, topShift, filters, consumptionData);
  };
  
  // Handle shift detail view
  const handleViewShiftDetail = (shift: Shift) => {
    setSelectedShift(shift);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-300 to-dark-400">
      <div className="container mx-auto px-4 py-6">
        <Header 
          filters={filters} 
          onDateRangeChange={handleDateRangeChange}
          onShiftFilterChange={handleShiftFilterChange}
          onResponsibleFilterChange={handleResponsibleFilterChange}
          onExportPDF={handleExportPDF}
          topShiftProduction={topShift?.finalProductTonnes || null}
          allShifts={shifts}
        />
        
        <main>
          <KPICards kpis={kpis} />
          <TopShiftCard topShift={topShift} onClick={handleViewShiftDetail} />
          <ConsumptionCard consumptionData={consumptionData} />
          <ShiftChart dailyShifts={dailyShifts} />
          <ShiftTable dailyShifts={dailyShifts} topShift={topShift} />
        </main>
      </div>
      
      {selectedShift && (
        <ShiftDetail 
          shift={selectedShift}
          onClose={() => setSelectedShift(null)}
        />
      )}
    </div>
  );
}

export default App;