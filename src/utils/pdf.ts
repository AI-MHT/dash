import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { ConsumptionData, DailyShifts, KPI, Shift, ShiftReportFilters } from '../types';
import { formatDate, formatShiftIdentifier } from './data';

// Generate a PDF report from the shift data
export const generatePDF = (
  shifts: Shift[],
  kpis: KPI[],
  dailyShifts: DailyShifts[],
  topShift: Shift | null,
  filters: ShiftReportFilters,
  consumptionData: ConsumptionData
): void => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  
  // Add title and date range
  pdf.setFontSize(20);
  pdf.setTextColor(33, 33, 33);
  pdf.text('Shift Report', 14, 20);
  
  pdf.setFontSize(12);
  pdf.setTextColor(100, 100, 100);
  const dateRangeText = `${formatDate(filters.dateRange.startDate)} to ${formatDate(filters.dateRange.endDate)}`;
  pdf.text(dateRangeText, 14, 28);
  
  // Add filter information
  let filterText = '';
  if (filters.shiftNumber) {
    filterText += `Shift: ${filters.shiftNumber} | `;
  }
  if (filters.responsible) {
    filterText += `Responsible: ${filters.responsible} | `;
  }
  if (filterText) {
    filterText = `Filters: ${filterText.slice(0, -3)}`;
    pdf.text(filterText, 14, 34);
  }
  
  // Add KPIs section
  pdf.setFontSize(16);
  pdf.setTextColor(33, 33, 33);
  pdf.text('Key Performance Indicators', 14, 44);
  
  // KPI table
  autoTable(pdf, {
    startY: 49,
    head: [['Metric', 'Value', 'Target', 'Status']],
    body: kpis.map(kpi => [
      kpi.name,
      `${kpi.value.toFixed(1)} ${kpi.unit}`,
      `${kpi.target} ${kpi.unit}`,
      kpi.trend === 'up' ? '↑ Good' : kpi.trend === 'down' ? '↓ Needs Attention' : '→ Stable',
    ]),
    theme: 'grid',
    headStyles: {
      fillColor: [63, 81, 181],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
  });
  
  // Chemical consumption table
  pdf.setFontSize(16);
  pdf.setTextColor(33, 33, 33);
  pdf.text('Chemical Consumption', 14, pdf.lastAutoTable.finalY + 15);
  
  autoTable(pdf, {
    startY: pdf.lastAutoTable.finalY + 20,
    head: [['Chemical', 'Total Consumption']],
    body: [
      ['Ester', `${consumptionData.ester.toFixed(1)} L`],
      ['Amin', `${consumptionData.amin.toFixed(1)} L`],
      ['Acid', `${consumptionData.acid.toFixed(1)} L`],
      ['Floculant', `${consumptionData.floculant.toFixed(1)} m³`],
    ],
    theme: 'grid',
    headStyles: {
      fillColor: [76, 175, 80],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
  });
  
  // Top performing shift
  if (topShift) {
    pdf.setFontSize(16);
    pdf.setTextColor(33, 33, 33);
    pdf.text('Top Performing Shift', 14, pdf.lastAutoTable.finalY + 15);
    
    autoTable(pdf, {
      startY: pdf.lastAutoTable.finalY + 20,
      head: [['Shift', 'Production', 'Efficiency', 'Quality Rate', 'Downtime', 'Stops']],
      body: [[
        formatShiftIdentifier(topShift),
        `${topShift.finalProductTonnes.toFixed(1)} T`,
        `${topShift.efficiency.toFixed(1)}%`,
        `${topShift.qualityRate.toFixed(1)}%`,
        `${topShift.downtime} min`,
        topShift.stopsFrequency.toString()
      ]],
      theme: 'grid',
      headStyles: {
        fillColor: [0, 150, 136],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      bodyStyles: {
        fillColor: [232, 245, 233],
        textColor: [0, 77, 64],
      },
    });
    
    // Add comments for top shift if available
    if (topShift.notes) {
      pdf.setFontSize(12);
      pdf.setTextColor(33, 33, 33);
      pdf.text('Notes:', 14, pdf.lastAutoTable.finalY + 10);
      
      // Split notes into multiple lines if needed
      const noteLines = pdf.splitTextToSize(topShift.notes, 180);
      pdf.setFontSize(10);
      pdf.setTextColor(60, 60, 60);
      pdf.text(noteLines, 14, pdf.lastAutoTable.finalY + 15);
    }
  }
  
  // Calculate next Y position
  const nextYPos = topShift && topShift.notes 
    ? pdf.lastAutoTable.finalY + 15 + (pdf.splitTextToSize(topShift.notes, 180).length * 5) 
    : pdf.lastAutoTable.finalY + 15;
  
  // Check if we need to add a new page
  if (nextYPos > 250) {
    pdf.addPage();
  }
  
  // Daily shifts
  pdf.setFontSize(16);
  pdf.setTextColor(33, 33, 33);
  pdf.text('Daily Production Summary', 14, nextYPos > 250 ? 20 : nextYPos);
  
  autoTable(pdf, {
    startY: nextYPos > 250 ? 25 : nextYPos + 5,
    head: [['Date', 'Shift 1 (T)', 'Shift 2 (T)', 'Total (T)', 'Target (T)', 'Variance']],
    body: dailyShifts.map(day => {
      const shift1 = day.shifts.find(s => s.shiftNumber === 1);
      const shift2 = day.shifts.find(s => s.shiftNumber === 2);
      const totalTarget = 10000; // 5000T per shift, 2 shifts per day
      const variance = day.totalProduction - totalTarget;
      
      return [
        formatDate(day.date),
        shift1 ? shift1.finalProductTonnes.toFixed(1) : 'N/A',
        shift2 ? shift2.finalProductTonnes.toFixed(1) : 'N/A',
        day.totalProduction.toFixed(1),
        totalTarget.toString(),
        variance > 0 
          ? `+${variance.toFixed(1)}`
          : variance.toFixed(1),
      ];
    }),
    theme: 'grid',
    headStyles: {
      fillColor: [96, 125, 139],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    columnStyles: {
      5: {
        textColor: (data) => {
          const value = parseFloat(data.cell.text[0]);
          return value >= 0 ? [46, 125, 50] : [211, 47, 47];
        },
      },
    },
  });
  
  // Detailed shift data
  pdf.setFontSize(16);
  pdf.setTextColor(33, 33, 33);
  pdf.text('Detailed Shift Data', 14, pdf.lastAutoTable.finalY + 15);
  
  autoTable(pdf, {
    startY: pdf.lastAutoTable.finalY + 20,
    head: [['Date', 'Shift', 'Production (T)', 'Efficiency', 'Downtime', 'Quality', 'Stops', 'Responsible']],
    body: shifts.map(shift => [
      formatDate(shift.date),
      shift.shiftNumber.toString(),
      shift.finalProductTonnes.toFixed(1),
      `${shift.efficiency.toFixed(1)}%`,
      `${shift.downtime} min`,
      `${shift.qualityRate.toFixed(1)}%`,
      shift.stopsFrequency.toString(),
      shift.responsible || 'N/A'
    ]),
    theme: 'grid',
    headStyles: {
      fillColor: [63, 81, 181],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [240, 240, 245],
    },
    columnStyles: {
      2: {
        fontStyle: (data) => {
          const value = parseFloat(data.cell.text[0]);
          return value >= 5000 ? 'bold' : 'normal';
        },
        textColor: (data) => {
          const value = parseFloat(data.cell.text[0]);
          return value >= 5000 ? [46, 125, 50] : [60, 60, 60];
        }
      }
    }
  });
  
  // Footer
  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(10);
    pdf.setTextColor(150, 150, 150);
    const today = format(new Date(), 'yyyy-MM-dd HH:mm');
    pdf.text(`Generated on ${today} | Page ${i} of ${pageCount}`, pdf.internal.pageSize.getWidth() / 2, pdf.internal.pageSize.getHeight() - 10, { align: 'center' });
  }
  
  // Save the PDF
  const fileName = `Shift_Report_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
  pdf.save(fileName);
};