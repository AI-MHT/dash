import React from 'react';
import { KPI } from '@/types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface KPICardsProps {
  kpis: KPI[];
}

const getIcon = (name: string) => {
  switch (name) {
    case 'Production':
      return '📦';
    case 'Efficiency':
      return '⚡';
    case 'Quality':
      return '✨';
    case 'Downtime':
      return '⏱️';
    case 'Maintenance':
      return '🔧';
    default:
      return '📊';
  }
};

const KPICards: React.FC<KPICardsProps> = ({ kpis }) => {
  if (!kpis || kpis.length === 0) {
    return (
      <div className="text-center text-slate-400 py-8">
        No KPI data available
      </div>
    );
  }

  // Group KPIs by category
  const groupedKPIs = kpis.reduce((acc, kpi) => {
    const category = kpi.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(kpi);
    return acc;
  }, {} as Record<string, KPI[]>);

  return (
    <div className="space-y-8">
      {Object.entries(groupedKPIs).map(([category, categoryKPIs]) => (
        <div key={category} className="space-y-4">
          <h3 className="text-xl font-semibold text-slate-100 border-b border-slate-700 pb-2">
            {category}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryKPIs.map((kpi) => {
              const percentage = kpi.target ? (kpi.value / kpi.target) * 100 : 0;
              const trend = typeof kpi.trend === 'number' ? kpi.trend : 0;
              const isPositive = kpi.name !== 'Downtime' && kpi.name !== 'Maintenance';

              return (
                <Card key={kpi.name} className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getIcon(kpi.name)}</span>
                        <h4 className="font-medium text-slate-100">
                          {kpi.name}
                        </h4>
                      </div>
                      <div className="flex items-center space-x-1">
                        {trend > 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : trend < 0 ? (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        ) : (
                          <Minus className="h-4 w-4 text-gray-400" />
                        )}
                        <span className={`text-sm ${
                          trend > 0 ? 'text-green-500' : 
                          trend < 0 ? 'text-red-500' : 
                          'text-gray-400'
                        }`}>
                          {Math.abs(trend).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-3xl font-bold text-slate-100">
                          {kpi.value.toFixed(1)}
                          {kpi.unit && <span className="text-sm text-slate-400 ml-1">{kpi.unit}</span>}
                        </span>
                        {kpi.target && (
                          <span className="text-sm text-slate-400">
                            Target: {kpi.target.toFixed(1)}
                          </span>
                        )}
                      </div>
                      {kpi.target && (
                        <div className="w-full bg-slate-700/30 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full transition-all duration-500 ${
                              isPositive
                                ? percentage >= 100
                                  ? 'bg-green-500'
                                  : percentage >= 80
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                                : percentage <= 100
                                ? 'bg-green-500'
                                : percentage <= 120
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                      )}
                      {kpi.target && (
                        <div className="text-sm text-slate-400 flex justify-between items-center">
                          <span>Progress</span>
                          <span className="font-medium">{percentage.toFixed(1)}%</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPICards;