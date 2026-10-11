import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import ExecutiveSummary from './ExecutiveSummary';
import QuickReportsGrid from './QuickReportsGrid';
import ReportBuilder from './ReportBuilder';
import ReportPreview from './ReportPreview';
import DownloadCenter from './DownloadCenter';
import SavedReports from './SavedReports';
import ScheduledReports from './ScheduledReports';
import ReportHistory from './ReportHistory';
import ReportViewerModal from './ReportViewerModal';
import { motion } from 'framer-motion';

export default function ReportsDashboard() {
  const [metrics, setMetrics] = useState({
    users: 0, trips: 0, destinations: 0, festivals: 0, hiddenGems: 0, isLoading: true, rawUsers: [], rawTrips: [], rawDestinations: [], rawFestivals: [], rawGems: []
  });
  
  const [generatedReport, setGeneratedReport] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [activeReportType, setActiveReportType] = useState('User Analytics');

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [users, places, trips, festivals, gems] = await Promise.all([
          axiosInstance.get("/api/registor/all").catch(() => ({ data: [] })),
          axiosInstance.get("/api/itinerary/all").catch(() => ({ data: [] })),
          axiosInstance.get("/api/trip-places/all").catch(() => ({ data: [] })),
          axiosInstance.get("/api/festivals/all").catch(() => ({ data: [] })),
          axiosInstance.get("/api/hidden-gems/all").catch(() => ({ data: [] }))
        ]);
        
        setMetrics({
          users: users.data.length || 0,
          destinations: places.data.length || 0,
          trips: trips.data.length || 0,
          festivals: festivals.data.length || 0,
          hiddenGems: gems.data.length || 0,
          isLoading: false,
          rawUsers: users.data || [],
          rawTrips: trips.data || [],
          rawDestinations: places.data || [],
          rawFestivals: festivals.data || [],
          rawGems: gems.data || []
        });
      } catch (e) {
        setMetrics(prev => ({ ...prev, isLoading: false }));
      }
    };
    fetchMetrics();
  }, []);

  const handleGenerate = (filters) => {
    setGeneratedReport({ ...filters, generatedAt: new Date() });
    setTimeout(() => {
      document.getElementById('report-preview-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="adm-dash payana-theme">
      
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', margin: 0, fontWeight: 400, color: 'var(--pcc-text-primary)' }}>Executive Intelligence Center</h1>
          <p style={{ margin: 0, marginTop: '8px', color: 'var(--pcc-text-secondary)', fontSize: '13px' }}>Platform Health | Today: {new Date().toLocaleDateString()}</p>
        </div>
      </motion.div>

      <ExecutiveSummary metrics={metrics} setActiveReportType={setActiveReportType} />
      <QuickReportsGrid onGenerate={handleGenerate} onPreview={() => setIsViewerOpen(true)} setActiveReportType={setActiveReportType} />
      <ReportBuilder activeReportType={activeReportType} setActiveReportType={setActiveReportType} onGenerate={handleGenerate} onPreview={() => setIsViewerOpen(true)} />
      
      {generatedReport && <ReportPreview report={generatedReport} metrics={metrics} />}
      
      <DownloadCenter />
      <SavedReports />
      <ScheduledReports />
      <ReportHistory />
      
      {isViewerOpen && <ReportViewerModal report={generatedReport} metrics={metrics} onClose={() => setIsViewerOpen(false)} />}
    </div>
  );
}