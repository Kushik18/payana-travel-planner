import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import axiosInstance from '../../api/axiosInstance';

const fetchLiveReportData = async () => {
  try {
    const response = await axiosInstance.get('/api/admin/reports/overview');
    const data = response.data;
    return [
      { id: 1, type: "Total Users", value: data.userActivity?.totalUsers || 0, status: "Active" },
      { id: 2, type: "Total Itineraries", value: data.contentReport?.totalPlaces || 0, status: "Active" },
      { id: 3, type: "Total Festivals", value: data.contentReport?.festivals || 0, status: "Verified" },
      { id: 4, type: "Top Destinations", value: data.travelAnalytics?.topDestinations || "N/A", status: "Trending" }
    ];
  } catch (error) {
    console.error("Failed to fetch live report data", error);
    return [
      { id: 1, type: "Error Fetching Data", value: 0, status: "Failed" }
    ];
  }
};

const ReportExportService = {
  downloadPDF: async (elementId, reportName = 'Executive Report') => {
    // If elementId is provided, try to capture it. Otherwise generate PDF from live data.
    const element = elementId ? document.getElementById(elementId) : null;
    
    try {
      if (element) {
        const canvas = await html2canvas(element, { scale: 2, useCORS: true, logging: false });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'in', format: 'letter' });
        const pdfWidth = 8.5;
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        const safeName = reportName.replace(/\s+/g, '_').toLowerCase();
        pdf.save(`payana_report_${safeName}.pdf`);
      } else {
        const liveData = await fetchLiveReportData();
        const pdf = new jsPDF();
        pdf.setFontSize(22);
        pdf.text("Executive Intelligence Report", 20, 30);
        pdf.setFontSize(14);
        pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);
        pdf.setFontSize(12);
        let y = 60;
        liveData.forEach(item => {
          pdf.text(`- ${item.type}: ${item.value} (${item.status})`, 20, y);
          y += 10;
        });
        pdf.save(`payana_executive_report.pdf`);
      }
    } catch (e) {
      console.error("PDF Generation failed", e);
    }
  },
  
  downloadCSV: async () => {
    const liveData = await fetchLiveReportData();
    const headers = "ID,Type,Value,Status\n";
    const rows = liveData.map(item => `${item.id},"${item.type}","${item.value}","${item.status}"`).join('\n');
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(headers + rows);
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", "payana_live_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  downloadExcel: async () => {
    const liveData = await fetchLiveReportData();
    const tableHtml = `
      <table>
        <tr><th>ID</th><th>Type</th><th>Value</th><th>Status</th></tr>
        ${liveData.map(item => `<tr><td>${item.id}</td><td>${item.type}</td><td>${item.value}</td><td>${item.status}</td></tr>`).join('')}
      </table>
    `;
    const uri = 'data:application/vnd.ms-excel;base64,' + btoa(tableHtml);
    const link = document.createElement("a");
    link.setAttribute("href", uri);
    link.setAttribute("download", "payana_live_spreadsheet.xls");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  downloadJSON: async () => {
    const liveData = await fetchLiveReportData();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(liveData, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", "payana_live_api_export.json");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export default ReportExportService;