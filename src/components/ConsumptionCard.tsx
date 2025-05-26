import React from 'react';
import { FlaskRound as Flask, Droplet, Beaker, Waves } from 'lucide-react';
import { ConsumptionData } from '../types';

interface ConsumptionCardProps {
  consumptionData: ConsumptionData;
}

const ConsumptionCard: React.FC<ConsumptionCardProps> = ({ consumptionData }) => {
  const { ester, amin, acid, floculant } = consumptionData;
  
  const formatNumber = (num: number) => {
    return num.toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  return (
    <div className="card">
      <h2 className="text-lg font-medium mb-4 text-slate-800">Chemical Consumption</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex justify-between items-start mb-2">
            <h3 className="stat-label">Ester</h3>
            <Flask className="w-5 h-5 text-primary-600" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="stat-value">{formatNumber(ester)}</span>
            <span className="text-xs text-slate-500">L</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex justify-between items-start mb-2">
            <h3 className="stat-label">Amin</h3>
            <Droplet className="w-5 h-5 text-secondary-600" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="stat-value">{formatNumber(amin)}</span>
            <span className="text-xs text-slate-500">L</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex justify-between items-start mb-2">
            <h3 className="stat-label">Acid</h3>
            <Beaker className="w-5 h-5 text-accent-600" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="stat-value">{formatNumber(acid)}</span>
            <span className="text-xs text-slate-500">L</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex justify-between items-start mb-2">
            <h3 className="stat-label">Floculant</h3>
            <Waves className="w-5 h-5 text-success-600" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="stat-value">{formatNumber(floculant)}</span>
            <span className="text-xs text-slate-500">m³</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsumptionCard;