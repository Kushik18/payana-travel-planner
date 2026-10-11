import React from 'react';
import { motion } from 'framer-motion';
import { TbFileTypePdf, TbFileTypeCsv, TbFileTypography, TbFileSpreadsheet, TbDownload } from 'react-icons/tb';
import ReportExportService from './ReportExportService';

export default function DownloadCenter() {
  const cards = [
    { icon: TbFileTypePdf, color: '#ef4444', title: 'PDF', desc: 'Executive formatted report.', action: () => ReportExportService.downloadPDF() },
    { icon: TbFileSpreadsheet, color: '#10b981', title: 'Excel', desc: 'Spreadsheet with formulas.', action: ReportExportService.downloadExcel },
    { icon: TbFileTypeCsv, color: '#14b8a6', title: 'CSV', desc: 'Raw data.', action: ReportExportService.downloadCSV },
    { icon: TbFileTypography, color: '#f59e0b', title: 'JSON', desc: 'API/developer export.', action: ReportExportService.downloadJSON }
  ];

  return (
    <div style={{ marginBottom: '48px' }}>
      <h2 style={{ fontSize: '22px', fontWeight: 500, color: 'var(--pcc-text-primary)', marginBottom: '24px' }}>Download Center</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
        {cards.map((c, i) => (
          <motion.div key={i} whileHover={{ y: -4, borderColor: c.color }} className="pcc-card" style={{ padding: '24px', transition: 'border-color 0.3s' }}>
            <div style={{ color: c.color, marginBottom: '16px' }}><c.icon size={40} /></div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--pcc-text-primary)', margin: '0 0 8px 0' }}>{c.title}</h3>
            <p style={{ color: 'var(--pcc-text-secondary)', fontSize: '14px', margin: '0 0 24px 0' }}>{c.desc}</p>
            <button onClick={c.action} className="btn btn-sm" style={{ width: '100%', backgroundColor: 'transparent', color: 'var(--pcc-text-primary)', border: '1px solid var(--pcc-border)', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <TbDownload /> Download
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}