import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  Chart,
  Plugin
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { DailyShifts } from '../types';
import { formatDate } from '../utils/data';

// Register the target line plugin
const targetLinePlugin: Plugin<'bar'> = {
  id: 'targetLine',
  beforeDraw(chart: Chart<'bar'>) {
    const { ctx, chartArea, scales } = chart;
    const targetLine = 5000;
    const yScale = scales.y;
    
    const yPosition = yScale.getPixelForValue(targetLine);
    
    ctx.save();
    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.moveTo(chartArea.left, yPosition);
    ctx.lineTo(chartArea.right, yPosition);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
    ctx.stroke();
    
    ctx.font = '11px Inter';
    ctx.fillStyle = 'rgba(239, 68, 68, 0.8)';
    ctx.textAlign = 'left';
    ctx.fillText('Target: 5000 T', chartArea.left + 8, yPosition - 5);
    
    ctx.restore();
  },
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  targetLinePlugin
);

interface ShiftChartProps {
  dailyShifts: DailyShifts[];
}

const ShiftChart: React.FC<ShiftChartProps> = ({ dailyShifts }) => {
  const sortedDailyShifts = useMemo(() => {
    return [...dailyShifts].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [dailyShifts]);
  
  const chartData: ChartData<'bar'> = {
    labels: sortedDailyShifts.map((day) => formatDate(day.date)),
    datasets: [
      {
        label: 'Shift 1',
        data: sortedDailyShifts.map((day) => {
          const shift1 = day.shifts.find((s) => s.shiftNumber === 1);
          return shift1 ? shift1.finalProductTonnes : 0;
        }),
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
        borderRadius: 4,
        barThickness: 16,
      },
      {
        label: 'Shift 2',
        data: sortedDailyShifts.map((day) => {
          const shift2 = day.shifts.find((s) => s.shiftNumber === 2);
          return shift2 ? shift2.finalProductTonnes : 0;
        }),
        backgroundColor: 'rgba(20, 184, 166, 0.8)',
        borderColor: 'rgba(20, 184, 166, 1)',
        borderWidth: 1,
        borderRadius: 4,
        barThickness: 16,
      },
    ],
  };

  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            family: 'Inter',
          },
          boxWidth: 12,
          boxHeight: 12,
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(23, 23, 39, 0.9)',
        titleFont: {
          family: 'Inter',
          size: 13,
        },
        bodyFont: {
          family: 'Inter',
          size: 12,
        },
        padding: 12,
        borderColor: 'rgba(99, 102, 241, 0.3)',
        borderWidth: 1,
        boxPadding: 6,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)} T`;
          },
          afterLabel: function(context) {
            const value = context.parsed.y;
            const diff = value - 5000;
            const percentage = (diff / 5000) * 100;
            
            return `Target: 5000 T (${diff >= 0 ? '+' : ''}${percentage.toFixed(1)}%)`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
          font: {
            family: 'Inter',
          },
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
          font: {
            family: 'Inter',
          },
        },
        min: 0,
        max: 6000,
        title: {
          display: true,
          text: 'Production (Tonnes)',
          color: 'rgba(255, 255, 255, 0.6)',
          font: {
            family: 'Inter',
            size: 12,
          },
        },
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    },
  };
  
  return (
    <div className="card mb-6">
      <h2 className="text-lg font-medium mb-4">Production by Shift</h2>
      <div className="h-[300px]">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default ShiftChart;