import React from 'react';
import { Clock, Gauge, Zap, AlertTriangle, UserCircle, FlaskConical, Timer, Scale, Activity, Repeat, Factory, TimerOff, TestTube2, FlaskRound as Flask, Thermometer, Droplet, Package } from 'lucide-react';
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
      <div className="bg-gradient-to-br from-dark-200 to-dark-300 rounded-xl border border-gray-700/40 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-auto">
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
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-dark-300/70 p-4 rounded-lg border border-gray-700/30">
              <div className="flex items-center gap-2 mb-2 text-primary-400">
                <Timer className="w-5 h-5" />
                <span className="text-sm font-medium">Operating Hours</span>
              </div>
              <p className="text-xl font-bold">{shift.operatingHours.toFixed(1)} Hr</p>
            </div>
            
            <div className="bg-dark-300/70 p-4 rounded-lg border border-gray-700/30">
              <div className="flex items-center gap-2 mb-2 text-secondary-400">
                <Scale className="w-5 h-5" />
                <span className="text-sm font-medium">Final Product</span>
              </div>
              <p className="text-xl font-bold">{shift.finalProductTonnes.toFixed(1)} T</p>
            </div>
            
            <div className="bg-dark-300/70 p-4 rounded-lg border border-gray-700/30">
              <div className="flex items-center gap-2 mb-2 text-accent-400">
                <Activity className="w-5 h-5" />
                <span className="text-sm font-medium">Max Flow Rate</span>
              </div>
              <p className="text-xl font-bold">{shift.maxFlowRate.toFixed(1)} T/Hr</p>
            </div>
            
            <div className="bg-dark-300/70 p-4 rounded-lg border border-gray-700/30">
              <div className="flex items-center gap-2 mb-2 text-error-400">
                <Repeat className="w-5 h-5" />
                <span className="text-sm font-medium">Stop Frequency</span>
              </div>
              <p className="text-xl font-bold">{shift.stopsFrequency}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-dark-300/70 p-4 rounded-lg border border-gray-700/30">
              <div className="flex items-center gap-2 mb-2 text-primary-400">
                <Factory className="w-5 h-5" />
                <span className="text-sm font-medium">ORE Flowrate</span>
              </div>
              <p className="text-xl font-bold">{shift.oreFlowrate?.toFixed(1) || 0} T</p>
            </div>
            
            <div className="bg-dark-300/70 p-4 rounded-lg border border-gray-700/30">
              <div className="flex items-center gap-2 mb-2 text-warning-400">
                <TimerOff className="w-5 h-5" />
                <span className="text-sm font-medium">Startup Time</span>
              </div>
              <p className="text-xl font-bold">{shift.startupTime?.toFixed(1) || 0} Hr</p>
            </div>
            
            <div className="bg-dark-300/70 p-4 rounded-lg border border-gray-700/30">
              <div className="flex items-center gap-2 mb-2 text-success-400">
                <Package className="w-5 h-5" />
                <span className="text-sm font-medium">Received Phosphate</span>
              </div>
              <p className="text-xl font-bold">{shift.receivedPhosphate?.toFixed(1) || 0} T</p>
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
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Chemical Consumption</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-dark-300/50 p-4 rounded-lg border border-gray-700/30">
                <div className="flex items-center gap-2 mb-2">
                  <TestTube2 className="w-5 h-5 text-primary-400" />
                  <span className="text-sm font-medium">Ester</span>
                </div>
                <p className="text-xl font-bold">{shift.esterConsumption?.toFixed(1) || 0} L</p>
              </div>
              
              <div className="bg-dark-300/50 p-4 rounded-lg border border-gray-700/30">
                <div className="flex items-center gap-2 mb-2">
                  <Flask className="w-5 h-5 text-secondary-400" />
                  <span className="text-sm font-medium">Amin</span>
                </div>
                <p className="text-xl font-bold">{shift.aminConsumption?.toFixed(1) || 0} L</p>
              </div>
              
              <div className="bg-dark-300/50 p-4 rounded-lg border border-gray-700/30">
                <div className="flex items-center gap-2 mb-2">
                  <Thermometer className="w-5 h-5 text-accent-400" />
                  <span className="text-sm font-medium">Acid</span>
                </div>
                <p className="text-xl font-bold">{shift.acidConsumption?.toFixed(1) || 0} L</p>
              </div>
              
              <div className="bg-dark-300/50 p-4 rounded-lg border border-gray-700/30">
                <div className="flex items-center gap-2 mb-2">
                  <Droplet className="w-5 h-5 text-success-400" />
                  <span className="text-sm font-medium">Floculant</span>
                </div>
                <p className="text-xl font-bold">{shift.floculantConsumption?.toFixed(1) || 0} m³</p>
              </div>
            </div>
          </div>
          
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