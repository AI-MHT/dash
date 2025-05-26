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
  console.log('App component rendering');
  
  // State for shifts data and filters
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
    console.log('Loading shifts data...');
    try {
      const shiftsData = getShiftsData();
      console.log('Shifts data loaded:', shiftsData);
      setShifts(shiftsData);
      setIsLoading(false);
    } catch (err) {
      console.error('Error loading shifts data:', err);
      setError('Failed to load shifts data. Please try again later.');
      setIsLoading(false);
    }
  }, []);
  
  // Update filtered data when shifts or filters change
  useEffect(() => {
    console.log('Updating filtered data...');
    const filtered = filterShifts(shifts, filters);
    console.log('Filtered shifts:', filtered);
    setFilteredShifts(filtered);
    
    // Calculate derived data
    const groupedShifts = groupShiftsByDate(filtered);
    console.log('Grouped shifts:', groupedShifts);
    setDailyShifts(groupedShifts);
    
    const calculatedKpis = calculateKPIs(filtered);
    console.log('Calculated KPIs:', calculatedKpis);
    setKpis(calculatedKpis);
    
    const top = findTopShift(filtered);
    console.log('Top shift:', top);
    setTopShift(top);
    
    const consumption = calculateTotalConsumption(filtered);
    console.log('Consumption data:', consumption);
    setConsumptionData(consumption);
  }, [shifts, filters]);
  
  // Handle date range change
  const handleDateRangeChange = (dateRange: DateRange) => {
    console.log('Date range changed:', dateRange);
    setFilters({
      ...filters,
      dateRange,
    });
  };
  
  // Handle shift filter change
  const handleShiftFilterChange = (shiftNumber: number | null) => {
    console.log('Shift filter changed:', shiftNumber);
    setFilters({
      ...filters,
      shiftNumber,
    });
  };
  
  // Handle responsible filter change
  const handleResponsibleFilterChange = (responsible: string | null) => {
    console.log('Responsible filter changed:', responsible);
    setFilters({
      ...filters,
      responsible,
    });
  };
  
  // Handle PDF export
  const handleExportPDF = () => {
    console.log('Exporting PDF...');
    generatePDF(filteredShifts, kpis, dailyShifts, topShift, filters, consumptionData);
  };
  
  // Handle shift detail view
  const handleViewShiftDetail = (shift: Shift) => {
    console.log('Viewing shift detail:', shift);
    setSelectedShift(shift);
  };

  if (error) {
    console.log('Rendering error state:', error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-300 to-dark-400 flex items-center justify-center">
        <div className="card p-6 text-center">
          <h2 className="text-xl font-bold text-error-500 mb-2">Error</h2>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    console.log('Rendering loading state');
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-300 to-dark-400 flex items-center justify-center">
        <div className="card p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading data...</p>
        </div>
      </div>
    );
  }
  
  console.log('Rendering main content');
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