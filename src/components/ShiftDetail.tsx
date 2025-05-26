import React from 'react';
import { Clock, Gauge, Zap, AlertTriangle, UserCircle, FlaskConical, Beaker } from 'lucide-react';
import { Shift } from '../types';
import { formatDate, formatShiftIdentifier } from '../utils/data';

interface ShiftDetailProps {
  shift: Shift | null;
  onClose: () => void;
}

const ShiftDetail: React.FC<ShiftDetailProps> = ({ shift, onClose }) => {
  if (!shift) return null;
  
  return (
    <div className="fixed inset-0 bg-dark-400/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-dark-200 to-dark-300 rounded-xl border border-gray-700/40 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">
                {formatShiftIdentifier(shift)}
              </h2>
              <p className="text-gray-400 text-sm">{formatDate(shift.date)}</p>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-dark-300/70 p-4 rounded-lg border border-gray-700/30">
              <div className="flex items-center gap-2 mb-2 text-primary-400">
                <Beaker className="w-5 h-5" />
                <span className="text-sm font-medium">Production</span>
              </div>
              <p className="text-xl font-bold">{shift.finalProductTonnes.toFixed(1)} T</p>
            </div>
            
            <div className="bg-dark-300/70 p-4 rounded-lg border border-gray-700/30">
              <div className="flex items-center gap-2 mb-2 text-secondary-400">
                <Zap className="w-5 h-5" />
                <span className="text-sm font-medium">Efficiency</span>
              </div>
              <p className="text-xl font-bold">{shift.efficiency.toFixed(1)}%</p>
            </div>
            
            <div className="bg-dark-300/70 p-4 rounded-lg border border-gray-700/30">
              <div className="flex items-center gap-2 mb-2 text-warning-400">
                <Clock className="w-5 h-5" />
                <span className="text-sm font-medium">Downtime</span>
              </div>
              <p className="text-xl font-bold">{shift.downtime} min</p>
            </div>
            
            <div className="bg-dark-300/70 p-4 rounded-lg border border-gray-700/30">
              <div className="flex items-center gap-2 mb-2 text-accent-400">
                <Gauge className="w-5 h-5" />
                <span className="text-sm font-medium">Quality Rate</span>
              </div>
              <p className="text-xl font-bold">{shift.qualityRate.toFixed(1)}%</p>
            </div>
            
            <div className="bg-dark-300/70 p-4 rounded-lg border border-gray-700/30">
              <div className="flex items-center gap-2 mb-2 text-error-400">
                <AlertTriangle className="w-5 h-5" />
                <span className="text-sm font-medium">Stops</span>
              </div>
              <p className="text-xl font-bold">{shift.stopsFrequency}</p>
            </div>
            
            {shift.responsible && (
              <div className="bg-dark-300/70 p-4 rounded-lg border border-gray-700/30">
                <div className="flex items-center gap-2 mb-2 text-gray-400">
                  <UserCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Responsible</span>
                </div>
                <p className="text-xl font-bold">{shift.responsible}</p>
              </div>
            )}
          </div>
          
          {shift.oreFlowrate && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Flow & Operating Metrics</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-dark-300/50 p-3 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Operating Hours</p>
                  <p className="font-medium">{shift.operatingHours.toFixed(2)} hrs</p>
                </div>
                
                <div className="bg-dark-300/50 p-3 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Max Flow Rate</p>
                  <p className="font-medium">{shift.maxFlowRate.toFixed(1)} T/Hr</p>
                </div>
                
                <div className="bg-dark-300/50 p-3 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">ORE Flowrate</p>
                  <p className="font-medium">{shift.oreFlowrate.toFixed(1)} T</p>
                </div>
                
                {shift.startupTime && shift.startupTime > 0 && (
                  <div className="bg-dark-300/50 p-3 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Startup Time</p>
                    <p className="font-medium">{shift.startupTime.toFixed(1)} hrs</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {(shift.esterConsumption || shift.aminConsumption || shift.acidConsumption || shift.floculantConsumption) && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Consumption</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {shift.esterConsumption !== undefined && (
                  <div className="bg-dark-300/50 p-3 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Ester</p>
                    <p className="font-medium">{shift.esterConsumption.toFixed(1)} L</p>
                  </div>
                )}
                
                {shift.aminConsumption !== undefined && (
                  <div className="bg-dark-300/50 p-3 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Amin</p>
                    <p className="font-medium">{shift.aminConsumption.toFixed(1)} L</p>
                  </div>
                )}
                
                {shift.acidConsumption !== undefined && (
                  <div className="bg-dark-300/50 p-3 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Acid</p>
                    <p className="font-medium">{shift.acidConsumption.toFixed(1)} L</p>
                  </div>
                )}
                
                {shift.floculantConsumption !== undefined && (
                  <div className="bg-dark-300/50 p-3 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Floculant</p>
                    <p className="font-medium">{shift.floculantConsumption.toFixed(1)} m³</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {shift.notes && (
            <div>
              <h3 className="text-lg font-medium mb-3">Notes</h3>
              <div className="bg-dark-300/50 p-4 rounded-lg border border-gray-700/30">
                <p className="text-sm whitespace-pre-wrap">{shift.notes}</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="border-t border-gray-700/30 p-4 flex justify-end">
          <button 
            onClick={onClose}
            className="btn bg-dark-100 hover:bg-dark-300 text-gray-200 border border-gray-700/50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShiftDetail;