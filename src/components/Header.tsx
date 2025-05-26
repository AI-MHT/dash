import React, { useState } from 'react';
import { Calendar, Filter, Download, ChevronDown, AlertTriangle, Factory, Building2 } from 'lucide-react';
import { DateRange, Shift } from '../types';
import { formatDate, getUniqueResponsibles } from '../utils/data';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface HeaderProps {
  filters: {
    dateRange: DateRange;
    shiftNumber?: number | null;
    responsible?: string | null;
  };
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
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const responsibles = getUniqueResponsibles(allShifts);
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-6">
          <Factory className="h-10 w-10 text-primary-600" />
          <Building2 className="h-10 w-10 text-secondary-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Shift Performance Dashboard</h1>
      </div>
      
      <Card className="bg-white border-slate-200">
        <div className="p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <DropdownMenu open={isDateOpen} onOpenChange={setIsDateOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-white border-slate-200 hover:bg-slate-50">
                    <Calendar className="w-4 h-4 mr-2 text-primary-600" />
                    {formatDate(filters.dateRange.startDate)} - {formatDate(filters.dateRange.endDate)}
                    <ChevronDown className="w-4 h-4 ml-2 text-slate-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border-slate-200">
                  <DropdownMenuItem 
                    onClick={() => onDateRangeChange({
                      startDate: new Date('2025-05-12'),
                      endDate: new Date('2025-05-14')
                    })}
                    className="text-slate-700 hover:bg-slate-50"
                  >
                    Last 3 Days
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDateRangeChange({
                      startDate: new Date('2025-05-07'),
                      endDate: new Date('2025-05-14')
                    })}
                    className="text-slate-700 hover:bg-slate-50"
                  >
                    Last 7 Days
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDateRangeChange({
                      startDate: new Date('2025-04-30'),
                      endDate: new Date('2025-05-14')
                    })}
                    className="text-slate-700 hover:bg-slate-50"
                  >
                    Last 14 Days
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-white border-slate-200 hover:bg-slate-50">
                    <Filter className="w-4 h-4 mr-2 text-primary-600" />
                    Filters
                    <ChevronDown className="w-4 h-4 ml-2 text-slate-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border-slate-200">
                  <div className="p-2">
                    <div className="mb-2">
                      <label className="text-sm text-slate-600 mb-1 block">Shift</label>
                      <div className="flex gap-2">
                        <Button
                          variant={filters.shiftNumber === 1 ? "default" : "outline"}
                          size="sm"
                          onClick={() => onShiftFilterChange(filters.shiftNumber === 1 ? null : 1)}
                          className={filters.shiftNumber === 1 ? "bg-primary-600" : "bg-white border-slate-200"}
                        >
                          Day
                        </Button>
                        <Button
                          variant={filters.shiftNumber === 2 ? "default" : "outline"}
                          size="sm"
                          onClick={() => onShiftFilterChange(filters.shiftNumber === 2 ? null : 2)}
                          className={filters.shiftNumber === 2 ? "bg-primary-600" : "bg-white border-slate-200"}
                        >
                          Night
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm text-slate-600 mb-1 block">Responsible</label>
                      <select
                        value={filters.responsible || ''}
                        onChange={(e) => onResponsibleFilterChange(e.target.value || null)}
                        className="w-full bg-white border border-slate-200 rounded-md p-2 text-slate-700"
                      >
                        <option value="">All</option>
                        {responsibles.map((responsible) => (
                          <option key={responsible} value={responsible}>
                            {responsible}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <Button 
              onClick={onExportPDF}
              className="bg-primary-600 hover:bg-primary-700 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
          
          {topShiftProduction !== null && topShiftProduction < 5000 && (
            <div className="mt-4 p-3 bg-warning-50 border border-warning-200 rounded-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning-600" />
              <span className="text-warning-700">
                Top shift production is below target (5000T)
              </span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Header;