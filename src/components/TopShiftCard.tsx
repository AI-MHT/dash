import React from 'react';
import { Award, Clock, Gauge, Zap, UserCircle } from 'lucide-react';
import { Shift } from '../types';
import { formatDate, formatShiftTime } from '../utils/data';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TopShiftCardProps {
  topShift: Shift | null;
  onClick: (shift: Shift) => void;
}

const TopShiftCard: React.FC<TopShiftCardProps> = ({ topShift, onClick }) => {
  if (!topShift) {
    return (
      <Card className="mt-8 hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Top Performing Shift</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-4">
            No shift data available
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div 
      className="card mb-6 bg-gradient-to-br from-secondary-900/20 to-secondary-800/10 border border-secondary-700/30 cursor-pointer hover:shadow-lg transition-shadow duration-300"
      onClick={() => onClick(topShift)}
    >
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-5 h-5 text-secondary-400" />
        <h2 className="text-lg font-medium">Top Performing Shift</h2>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <div className="bg-dark-300/70 rounded-lg p-5 border border-secondary-700/20 flex flex-col items-center justify-center h-full">
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-secondary-400 mb-1">
                {topShift.finalProductTonnes.toFixed(1)}
              </div>
              <div className="text-sm text-gray-400">Tonnes</div>
            </div>
            
            <div className="text-center">
              <div className="font-medium">{formatDate(topShift.date)}</div>
              <div className="text-sm text-gray-400">Shift {topShift.shiftNumber}</div>
            </div>
            
            {topShift.responsible && (
              <div className="mt-3 flex items-center gap-1 text-sm text-gray-400">
                <UserCircle className="w-4 h-4" />
                <span>{topShift.responsible}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="md:w-2/3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-dark-300/50 p-4 rounded-lg border border-gray-700/20">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-secondary-400" />
                <span className="text-sm font-medium">Efficiency</span>
              </div>
              <div className="text-2xl font-bold">{topShift.efficiency.toFixed(1)}%</div>
              {topShift.efficiency >= 80 && (
                <div className="text-xs text-secondary-400 mt-1">Excellent performance</div>
              )}
            </div>
            
            <div className="bg-dark-300/50 p-4 rounded-lg border border-gray-700/20">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-secondary-400" />
                <span className="text-sm font-medium">Downtime</span>
              </div>
              <div className="text-2xl font-bold">{topShift.downtime} min</div>
              {topShift.downtime < 60 && (
                <div className="text-xs text-secondary-400 mt-1">Below average</div>
              )}
            </div>
            
            <div className="bg-dark-300/50 p-4 rounded-lg border border-gray-700/20">
              <div className="flex items-center gap-2 mb-2">
                <Gauge className="w-5 h-5 text-secondary-400" />
                <span className="text-sm font-medium">Quality Rate</span>
              </div>
              <div className="text-2xl font-bold">{topShift.qualityRate.toFixed(1)}%</div>
              {topShift.qualityRate >= 90 && (
                <div className="text-xs text-secondary-400 mt-1">High quality output</div>
              )}
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-dark-300/50 rounded-lg border border-gray-700/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Production vs Target (5000T)</span>
              <span className="text-sm font-medium">
                {((topShift.finalProductTonnes / 5000) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-dark-400 rounded-full h-2.5">
              <div 
                className="bg-secondary-500 h-2.5 rounded-full transition-all duration-1000 ease-out"
                style={{ 
                  width: `${Math.min(100, (topShift.finalProductTonnes / 5000) * 100)}%` 
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopShiftCard;