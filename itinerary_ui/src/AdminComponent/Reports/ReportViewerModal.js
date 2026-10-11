import React from 'react';
import { motion } from 'framer-motion';
import { TbPrinter, TbDownload, TbX } from 'react-icons/tb';
import ReportExportService from './ReportExportService';

export default function ReportViewerModal({ report, metrics, onClose }) {
  const handleDownloadPDF = () => {
    ReportExportService.downloadPDF('deloitte-report-content', report.type);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
      {/* Sidebar Controls */}
      <div style={{ width: '320px', backgroundColor: 'var(--pcc-bg-page)', borderRight: '1px solid var(--pcc-border)', display: 'flex', flexDirection: 'column', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--pcc-text-primary)', margin: 0 }}>Viewer Controls</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--pcc-text-secondary)', cursor: 'pointer' }}><TbX size={24} /></button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <button className="btn" onClick={handleDownloadPDF} style={{ padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: 'var(--pcc-accent)', color: '#fff', border: 'none' }}>
            <TbDownload size={20} /> Download PDF
          </button>
          <button className="btn" style={{ padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#10b981', color: '#fff', border: 'none' }}>
            <TbDownload size={20} /> Download Excel
          </button>
          <button className="btn" style={{ padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: 'transparent', border: '1px solid var(--pcc-border)', color: 'var(--pcc-text-primary)' }}>
            <TbPrinter size={20} /> Print Report
          </button>
        </div>
      </div>

      {/* Report Document Area (The Printable Area) */}
      <div style={{ flex: 1, padding: '48px', overflowY: 'auto', display: 'flex', justifyContent: 'center' }}>
        <div id="deloitte-report-content" style={{ width: '8.5in', minHeight: '11in', backgroundColor: '#fff', color: '#000', padding: '1in', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', fontFamily: 'Helvetica, Arial, sans-serif' }}>
          {/* Cover Page */}
          <div style={{ height: '8in', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h1 style={{ fontSize: '48px', fontWeight: 800, margin: '0 0 16px 0', color: '#000' }}>PAYANA</h1>
            <h2 style={{ fontSize: '24px', fontWeight: 300, color: '#666', borderBottom: '2px solid #000', paddingBottom: '24px', margin: '0 0 48px 0' }}>Executive Report: {report.type}</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop: 'auto' }}>
              <div>
                <div style={{ fontSize: '12px', textTransform: 'uppercase', color: '#888', fontWeight: 600 }}>Generated Date</div>
                <div style={{ fontSize: '16px', color: '#000' }}>{report.generatedAt.toLocaleDateString()}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', textTransform: 'uppercase', color: '#888', fontWeight: 600 }}>Prepared By</div>
                <div style={{ fontSize: '16px', color: '#000' }}>System Administrator</div>
              </div>
            </div>
          </div>
          
          <div style={{ pageBreakBefore: 'always', marginTop: '2in' }}>
            <h3 style={{ fontSize: '20px', borderBottom: '1px solid #ddd', paddingBottom: '8px' }}>Executive Summary</h3>
            <p style={{ lineHeight: 1.6, color: '#333' }}>This report details the core platform metrics across the defined dimensions. Currently serving {metrics.users} users and tracking {metrics.trips} active trips.</p>
            {/* Real charts would be rendered here for PDF capture */}
            <div style={{ width: '100%', height: '300px', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', marginTop: '32px' }}>
              [ Chart Graphic Placeholder ]
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}