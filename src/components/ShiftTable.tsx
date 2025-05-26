import React, { useState } from 'react';
import { CheckCircle2, Clock, Eye, Star } from 'lucide-react';
import { DailyShifts, Shift } from '../types';
import { formatDate, formatShiftIdentifier, formatShiftTime, isCurrentDayShift } from '../utils/data';
import ShiftDetail from './ShiftDetail';

interface ShiftTableProps {
  dailyShifts: DailyShifts[];
  topShift: Shift | null;
}

const ShiftTable: React.FC<ShiftTableProps> = ({ dailyShifts, topShift }) => {
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  
  // Check if a shift is the top performing shift
  const isTopShift = (shift: Shift): boolean => {
    if (!topShift) return false;
    return shift.id === topShift.id;
  };
  
  const handleRowClick = (shift: Shift) => {
    setSelectedShift(shift);
  };
  
  return (
    <div className="card">
      <h2 className="text-lg font-medium mb-4">Shift Details</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-dark-300/50 border-b border-gray-700/30">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Shift</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Time</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Production (T)</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Efficiency</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Quality</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Downtime</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Stops</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dailyShifts.flatMap((day) => 
              day.shifts.map((shift, index) => {
                const isTop = isTopShift(shift);
                const isCurrent = isCurrentDayShift(shift);
                
                return (
                  <tr 
                    key={shift.id} 
                    className={`
                      border-b border-gray-700/20 transition-colors
                      ${isTop ? 'bg-secondary-900/30' : index % 2 === 0 ? 'bg-dark-300/20' : 'bg-dark-300/10'}
                      ${isCurrent ? 'bg-primary-900/30' : ''}
                      hover:bg-dark-300/40 cursor-pointer
                    `}
                    onClick={() => handleRowClick(shift)}
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {formatDate(shift.date)}
                      {isCurrent && (
                        <span className="ml-2 inline-block px-2 py-0.5 text-xs bg-primary-900/60 text-primary-300 rounded-full">
                          Today
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        {isTop && <Star className="w-4 h-4 text-accent-400" />}
                        Shift {shift.shiftNumber}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                      {formatShiftTime(shift)}
                    </td>
                    <td className={`px-4 py-3 whitespace-nowrap text-sm text-right font-medium ${shift.finalProductTonnes >= 5000 ? 'text-success-400' : 'text-gray-300'}`}>
                      {shift.finalProductTonnes.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-300">
                      {shift.efficiency.toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-300">
                      {shift.qualityRate.toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-300">
                      <div className="flex items-center justify-end gap-1">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {shift.downtime} min
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-300">
                      {shift.stopsFrequency}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                      {shift.finalProductTonnes >= 5000 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-success-900/30 text-success-400">
                          <CheckCircle2 className="w-3 h-3" />
                          Target Met
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-warning-900/30 text-warning-400">
                          {((shift.finalProductTonnes / 5000) * 100).toFixed(1)}% of Target
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                      <button 
                        className="p-1 rounded-full hover:bg-dark-100 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(shift);
                        }}
                      >
                        <Eye className="w-4 h-4 text-gray-400" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
            {dailyShifts.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-gray-400">
                  No shift data available for the selected period.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {selectedShift && (
        <ShiftDetail 
          shift={selectedShift}
          onClose={() => setSelectedShift(null)}
        />
      )}
    </div>
  );
};

export default ShiftTable;