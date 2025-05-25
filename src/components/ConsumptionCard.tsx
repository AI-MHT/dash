import React from 'react';
import { TestTube2, Flask, Thermometer, Droplet } from 'lucide-react';
import { ConsumptionData } from '../types';

interface ConsumptionCardProps {
  consumptionData: ConsumptionData;
}

const ConsumptionCard: React.FC<ConsumptionCardProps> = ({ consumptionData }) => {
  const { ester, amin, acid, floculant } = consumptionData;
  
  // Format number with commas for thousands
  const formatNumber = (num: number) => {
    return num.toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  return (
    <div className="card mb-6">
      <h2 className="text-lg font-medium mb-4">Chemical Consumption</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-primary-900/40 to-primary-800/20 rounded-lg p-4 border border-gray-700/20">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-medium text-gray-300">Ester</h3>
            <TestTube2 className="w-5 h-5 text-primary-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold animate-count-up">{formatNumber(ester)}</span>
            <span className="text-xs text-gray-400">L</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-secondary-900/40 to-secondary-800/20 rounded-lg p-4 border border-gray-700/20">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-medium text-gray-300">Amin</h3>
            <Flask className="w-5 h-5 text-secondary-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold animate-count-up">{formatNumber(amin)}</span>
            <span className="text-xs text-gray-400">L</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-accent-900/40 to-accent-800/20 rounded-lg p-4 border border-gray-700/20">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-medium text-gray-300">Acid</h3>
            <Thermometer className="w-5 h-5 text-accent-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold animate-count-up">{formatNumber(acid)}</span>
            <span className="text-xs text-gray-400">L</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-success-900/40 to-success-800/20 rounded-lg p-4 border border-gray-700/20">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-medium text-gray-300">Floculant</h3>
            <Droplet className="w-5 h-5 text-success-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold animate-count-up">{formatNumber(floculant)}</span>
            <span className="text-xs text-gray-400">m³</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsumptionCard;