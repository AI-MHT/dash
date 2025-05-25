import React from 'react';
import { AlertTriangle, Calendar, ChevronDown, Download, Filter, UserRound, Beaker, FlaskRound as Flask, Droplet } from 'lucide-react';
import { DateRange, Shift, ShiftReportFilters } from '../types';
import { formatDate, getUniqueResponsibles } from '../utils/data';

interface HeaderProps {
  filters: ShiftReportFilters;
  onDateRangeChange: (dateRange: DateRange) => void;
  onShiftFilterChange: (shiftNumber: number | null) => void;
  onResponsibleFilterChange: (responsible: string | null) => void;
  onExportPDF: () => void;
  topShiftProduction: number | null;
  allShifts: Shift[];
}

const Header: React.FC<HeaderProps> = ({ 
  filters, 
  onDateRangeChange,
  onShiftFilterChange,
  onResponsibleFilterChange,
  onExportPDF,
  topShiftProduction,
  allShifts
}) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = React.useState(false);
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  
  const responsibles = getUniqueResponsibles(allShifts);
  
  // Predefined date ranges
  const setLast7Days = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 6);
    onDateRangeChange({ startDate, endDate });
    setIsDatePickerOpen(false);
  };
  
  const setLast14Days = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 13);
    onDateRangeChange({ startDate, endDate });
    setIsDatePickerOpen(false);
  };
  
  const setLast30Days = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 29);
    onDateRangeChange({ startDate, endDate });
    setIsDatePickerOpen(false);
  };
  
  const setCurrentMonth = () => {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = today;
    onDateRangeChange({ startDate, endDate });
    setIsDatePickerOpen(false);
  };
  
  return (
    <header className="relative z-10">
      <div className="card-gradient mb-6 p-4 md:p-6 rounded-xl border border-gray-700/30 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Beaker className="w-8 h-8 text-primary-500" />
                <Flask className="w-8 h-8 text-secondary-500" />
                <Droplet className="w-8 h-8 text-accent-500" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">Shift Report</h1>
                <p className="text-gray-400 text-sm mt-1">
                  {formatDate(filters.dateRange.startDate)} - {formatDate(filters.dateRange.endDate)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative">
              <button
                className="btn flex items-center gap-2 bg-dark-100 hover:bg-dark-300 text-gray-200 border border-gray-700/50 w-full sm:w-auto"
                onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              >
                <Calendar className="w-4 h-4" />
                <span>Date Range</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {isDatePickerOpen && (
                <div className="absolute right-0 mt-2 w-48 card-gradient rounded-lg shadow-xl border border-gray-700/40 p-2 z-20">
                  <button
                    className="w-full text-left px-3 py-2 text-sm rounded hover:bg-primary-600/20 transition-colors"
                    onClick={setLast7Days}
                  >
                    Last 7 days
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 text-sm rounded hover:bg-primary-600/20 transition-colors"
                    onClick={setLast14Days}
                  >
                    Last 14 days
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 text-sm rounded hover:bg-primary-600/20 transition-colors"
                    onClick={setLast30Days}
                  >
                    Last 30 days
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 text-sm rounded hover:bg-primary-600/20 transition-colors"
                    onClick={setCurrentMonth}
                  >
                    Current month
                  </button>
                  <hr className="my-2 border-gray-700/50" />
                  <div className="px-3 py-2">
                    <label className="block text-xs text-gray-400 mb-1">Custom Range</label>
                    <div className="flex flex-col gap-2">
                      <input 
                        type="date" 
                        className="input text-xs"
                        value={filters.dateRange.startDate.toISOString().split('T')[0]}
                        onChange={(e) => {
                          const newStartDate = new Date(e.target.value);
                          onDateRangeChange({
                            startDate: newStartDate,
                            endDate: filters.dateRange.endDate
                          });
                        }}
                      />
                      <input 
                        type="date" 
                        className="input text-xs"
                        value={filters.dateRange.endDate.toISOString().split('T')[0]}
                        onChange={(e) => {
                          const newEndDate = new Date(e.target.value);
                          onDateRangeChange({
                            startDate: filters.dateRange.startDate,
                            endDate: newEndDate
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="relative">
              <button
                className="btn flex items-center gap-2 bg-dark-100 hover:bg-dark-300 text-gray-200 border border-gray-700/50 w-full sm:w-auto"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-48 card-gradient rounded-lg shadow-xl border border-gray-700/40 p-2 z-20">
                  <div className="px-3 py-2">
                    <label className="block text-xs text-gray-400 mb-1">Shift</label>
                    <div className="flex gap-2">
                      <button 
                        className={`px-2 py-1 text-xs rounded transition-colors ${filters.shiftNumber === null ? 'bg-primary-600 text-white' : 'bg-dark-100 text-gray-300 hover:bg-dark-200'}`}
                        onClick={() => onShiftFilterChange(null)}
                      >
                        All
                      </button>
                      <button 
                        className={`px-2 py-1 text-xs rounded transition-colors ${filters.shiftNumber === 1 ? 'bg-primary-600 text-white' : 'bg-dark-100 text-gray-300 hover:bg-dark-200'}`}
                        onClick={() => onShiftFilterChange(1)}
                      >
                        Shift 1
                      </button>
                      <button 
                        className={`px-2 py-1 text-xs rounded transition-colors ${filters.shiftNumber === 2 ? 'bg-primary-600 text-white' : 'bg-dark-100 text-gray-300 hover:bg-dark-200'}`}
                        onClick={() => onShiftFilterChange(2)}
                      >
                        Shift 2
                      </button>
                    </div>
                  </div>
                  
                  {responsibles.length > 0 && (
                    <div className="px-3 py-2 border-t border-gray-700/30 mt-2">
                      <label className="block text-xs text-gray-400 mb-1">Responsible</label>
                      <div className="flex flex-col gap-1">
                        <button 
                          className={`px-2 py-1 text-xs rounded text-left transition-colors ${filters.responsible === null ? 'bg-primary-600 text-white' : 'bg-dark-100 text-gray-300 hover:bg-dark-200'}`}
                          onClick={() => onResponsibleFilterChange(null)}
                        >
                          All
                        </button>
                        {responsibles.map(responsible => (
                          <button 
                            key={responsible}
                            className={`px-2 py-1 text-xs rounded text-left transition-colors flex items-center gap-1 ${filters.responsible === responsible ? 'bg-primary-600 text-white' : 'bg-dark-100 text-gray-300 hover:bg-dark-200'}`}
                            onClick={() => onResponsibleFilterChange(responsible)}
                          >
                            <UserRound className="w-3 h-3" />
                            {responsible}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <button
              className="btn-primary flex items-center gap-2 w-full sm:w-auto"
              onClick={onExportPDF}
            >
              <Download className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>
        
        {topShiftProduction !== null && topShiftProduction < 5000 && (
          <div className="mt-4 flex items-center gap-2 text-warning-300 bg-warning-900/20 p-3 rounded-lg border border-warning-700/30">
            <AlertTriangle className="w-5 h-5" />
            <p className="text-sm">
              Top shift production ({topShiftProduction.toFixed(1)} T) is below the target of 5000 T.
            </p>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;