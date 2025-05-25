import React from 'react';
import { ArrowDown, ArrowRight, ArrowUp, Clock, Factory, Gauge, Zap, AlertTriangle } from 'lucide-react';
import { KPI } from '../types';

interface KPICardsProps {
  kpis: KPI[];
}

const KPICards: React.FC<KPICardsProps> = ({ kpis }) => {
  // Icons for each KPI type
  const getIcon = (name: string) => {
    switch (name) {
      case 'Avg Production':
        return <Factory className="w-5 h-5" />;
      case 'Efficiency':
        return <Zap className="w-5 h-5" />;
      case 'Downtime':
        return <Clock className="w-5 h-5" />;
      case 'Quality Rate':
        return <Gauge className="w-5 h-5" />;
      case 'Stop Frequency':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Factory className="w-5 h-5" />;
    }
  };
  
  // Return trend icon and color based on trend direction
  const getTrendIndicator = (trend: 'up' | 'down' | 'stable', isInverse = false) => {
    // For metrics where lower is better (like downtime), we need to invert the trend display
    const effectiveTrend = isInverse ? 
      (trend === 'up' ? 'down' : trend === 'down' ? 'up' : 'stable') : 
      trend;
    
    switch (effectiveTrend) {
      case 'up':
        return <ArrowUp className="w-4 h-4 text-success-400" />;
      case 'down':
        return <ArrowDown className="w-4 h-4 text-error-400" />;
      case 'stable':
        return <ArrowRight className="w-4 h-4 text-gray-400" />;
      default:
        return null;
    }
  };
  
  // Calculate percentage of target
  const getPercentOfTarget = (value: number, target: number, isInverse = false) => {
    if (isInverse) {
      // For metrics where lower is better (like downtime)
      return target > 0 ? Math.min(200, (target / value) * 100) : 100;
    }
    return target > 0 ? Math.min(150, (value / target) * 100) : 100;
  };
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {kpis.map((kpi, index) => {
        const isInverseKPI = kpi.name === 'Downtime' || kpi.name === 'Stop Frequency';
        const percentOfTarget = getPercentOfTarget(kpi.value, kpi.target, isInverseKPI);
        
        // Color mapping based on KPI type
        let bgGradient, progressColor;
        
        switch (kpi.color) {
          case 'primary':
            bgGradient = 'from-primary-900/40 to-primary-800/20';
            progressColor = 'bg-primary-500';
            break;
          case 'secondary':
            bgGradient = 'from-secondary-900/40 to-secondary-800/20';
            progressColor = 'bg-secondary-500';
            break;
          case 'accent':
            bgGradient = 'from-accent-900/40 to-accent-800/20';
            progressColor = 'bg-accent-500';
            break;
          case 'warning':
            bgGradient = 'from-warning-900/40 to-warning-800/20';
            progressColor = 'bg-warning-500';
            break;
          case 'error':
            bgGradient = 'from-error-900/40 to-error-800/20';
            progressColor = 'bg-error-500';
            break;
          default:
            bgGradient = 'from-primary-900/40 to-primary-800/20';
            progressColor = 'bg-primary-500';
        }
        
        return (
          <div
            key={index}
            className={`card bg-gradient-to-br ${bgGradient} border-t border-l border-gray-700/20 backdrop-blur-sm hover:scale-[1.02] transition-transform duration-300`}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                {getIcon(kpi.name)}
                <h3 className="text-sm font-medium text-gray-300">{kpi.name}</h3>
              </div>
              <div className="flex items-center gap-1">
                {getTrendIndicator(kpi.trend, isInverseKPI)}
              </div>
            </div>
            
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-2xl font-bold animate-count-up">
                {kpi.value.toFixed(1)}
              </span>
              <span className="text-sm text-gray-400">{kpi.unit}</span>
            </div>
            
            <div className="relative h-1.5 w-full bg-dark-300 rounded-full overflow-hidden">
              <div 
                className={`absolute top-0 left-0 h-full ${progressColor} rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${percentOfTarget}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <span>0</span>
              <span>Target: {kpi.target}{kpi.unit}</span>
              <span>{kpi.target * 1.5}{kpi.unit}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KPICards;