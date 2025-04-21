// import React from 'react';
import '../App.css'
interface ReportHeaderProps {
  createdAt: string;
  user: string;
  customId?: string | number;
}

const ReportHeader: React.FC<ReportHeaderProps> = ({  }) => {

  return (
    <header className="page-header">
    <h1>Sales Report</h1>
  </header>
  );
};

export default ReportHeader;