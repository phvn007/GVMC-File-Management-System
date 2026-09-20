import React, { useState } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  XCircle,
  Clock, 
  AlertTriangle, 
  FileText, 
  TrendingUp, 
  ShieldCheck, 
  Search, 
  BarChart3, 
  PieChart as PieChartIcon, 
  Activity, 
  Filter, 
  Award, 
  ChevronRight, 
  Sparkles, 
  Zap, 
  RefreshCw, 
  UserCheck, 
  Trash2, 
  Check, 
  Layers,
  Building,
  Sliders,
  MapPin,
  Calendar
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend, 
  AreaChart, 
  Area 
} from 'recharts';
import { GVMCFile, UserProfile, Department, Language } from '../types';
import { getTranslation } from '../translations';

interface CommissionerDashboardProps {
  language: Language;
  user: UserProfile;
  files: GVMCFile[];
  onSelectFile: (file: GVMCFile) => void;
  onClearCitizenData?: () => void;
  onResetFilesData?: () => void;
  onUpdateFile?: (updatedFile: GVMCFile) => void;
}

export const CommissionerDashboard: React.FC<CommissionerDashboardProps> = ({
  language,
  user,
  files,
  onSelectFile,
  onClearCitizenData,
  onResetFilesData,
  onUpdateFile
}) => {
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const departmentsList: Department[] = [
    'Town Planning',
    'Revenue & Taxes',
    'Public Health & Sanitation',
    'Engineering & Works',
    'Water Supply & Sewerage',
    'Urban Forestry',
    'General Administration'
  ];

  // Global KPIs Calculation
  const totalFiles = files.length;
  const approvedFiles = files.filter(f => f.currentStatus === 'Approved' || f.currentStatus === 'Disposed & Issued').length;
  const pendingFiles = files.filter(f => f.currentStatus !== 'Approved' && f.currentStatus !== 'Rejected' && f.currentStatus !== 'Disposed & Issued').length;
  const overdueFiles = files.filter(f => f.daysRemaining < 0).length;
  const atRiskFiles = files.filter(f => f.daysRemaining >= 0 && f.daysRemaining <= 3 && f.currentStatus !== 'Approved').length;
  const rejectedFiles = files.filter(f => f.currentStatus === 'Rejected').length;
  
  const slaComplianceRate = totalFiles > 0 
    ? Math.round(((totalFiles - overdueFiles) / totalFiles) * 100) 
    : 100;

  // Department-wise breakdown data for Bar Chart
  const deptData = departmentsList.map(dept => {
    const deptFiles = files.filter(f => f.department === dept);
    const appr = deptFiles.filter(f => f.currentStatus === 'Approved' || f.currentStatus === 'Disposed & Issued').length;
    const pend = deptFiles.filter(f => f.currentStatus !== 'Approved' && f.currentStatus !== 'Rejected' && f.currentStatus !== 'Disposed & Issued').length;
    const rej = deptFiles.filter(f => f.currentStatus === 'Rejected').length;
    const overdue = deptFiles.filter(f => f.daysRemaining < 0).length;

    return {
      name: dept.split(' ')[0], // short name
      fullName: dept,
      Total: deptFiles.length,
      Approved: appr,
      Pending: pend,
      Rejected: rej,
      Overdue: overdue,
      SLACompliance: deptFiles.length > 0 ? Math.round(((deptFiles.length - overdue) / deptFiles.length) * 100) : 100
    };
  });

  // Status breakdown data for Pie Chart
  const statusPieData = [
    { name: 'Approved / Issued', value: approvedFiles, color: '#059669' },
    { name: 'In Review / Process', value: files.filter(f => f.currentStatus === 'In Review').length, color: '#2563eb' },
    { name: 'Inspection Pending', value: files.filter(f => f.currentStatus === 'Inspection Pending').length, color: '#d97706' },
    { name: 'Clarification Req.', value: files.filter(f => f.currentStatus === 'Clarification Required').length, color: '#ea580c' },
    { name: 'Submitted / Inward', value: files.filter(f => f.currentStatus === 'Submitted').length, color: '#6366f1' },
    { name: 'Rejected', value: rejectedFiles, color: '#dc2626' }
  ].filter(d => d.value > 0);

  // Category breakdown for Pie Chart
  const categoryMap: { [key: string]: number } = {};
  files.forEach(f => {
    categoryMap[f.category] = (categoryMap[f.category] || 0) + 1;
  });
  const categoryPieData = Object.keys(categoryMap).map((cat, idx) => ({
    name: cat,
    value: categoryMap[cat],
    color: ['#0284c7', '#0d9488', '#16a34a', '#ca8a04', '#9333ea', '#e11d48'][idx % 6]
  }));

  // Filtered files list for Table
  const filteredFiles = files.filter(f => {
    const matchesDept = selectedDeptFilter === 'all' || f.department === selectedDeptFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'approved' && (f.currentStatus === 'Approved' || f.currentStatus === 'Disposed & Issued')) ||
      (statusFilter === 'pending' && f.currentStatus !== 'Approved' && f.currentStatus !== 'Rejected' && f.currentStatus !== 'Disposed & Issued') ||
      (statusFilter === 'overdue' && f.daysRemaining < 0) ||
      (statusFilter === 'rejected' && f.currentStatus === 'Rejected');

    const matchesSearch = searchQuery === '' || 
      f.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.zone.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesDept && matchesStatus && matchesSearch;
  });

  // Commissioner Fast-Track Direct Approval
  const handleCommissionerApprove = (file: GVMCFile, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onUpdateFile) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userName = user?.name || 'Sri P. Sampath Kumar, IAS';
    const userDesignation = user?.designation || 'Municipal Commissioner';

    const updatedStep = {
      id: 'm-comm-' + Date.now(),
      stepNumber: file.movementHistory.length + 1,
      department: 'General Administration' as Department,
      officerName: userName,
      designation: userDesignation,
      actionTaken: 'Executive Commissioner Direct Sanction & Sanction Order Issued',
      date: todayStr,
      time: timeStr,
      status: 'completed' as const,
      remarks: 'Sanctioned under Executive Powers of Municipal Commissioner, GVMC.',
      outwardNo: `GVMC/COMM/APPR/${Math.floor(1000 + Math.random() * 9000)}`
    };

    const newNote = {
      id: 'n-comm-' + Date.now(),
      pageNumber: file.noteSheet.length + 1,
      officerName: `${userName} (Commissioner)`,
      designation: userDesignation,
      department: 'General Administration' as Department,
      timestamp: `${todayStr} ${timeStr}`,
      noteText: 'Reviewed dossier and department notes. Sanction granted with immediate effect. Dispatch sanction order to applicant.',
      signatureCode: `SIG/GVMC/COMM/${Date.now().toString().slice(-5)}`
    };

    const updatedFile: GVMCFile = {
      ...file,
      currentStatus: 'Approved',
      currentCustodian: userName,
      currentCustodianDesignation: userDesignation,
      daysRemaining: 0,
      movementHistory: [...file.movementHistory, updatedStep],
      noteSheet: [...file.noteSheet, newNote]
    };

    onUpdateFile(updatedFile);
    setActionSuccessMsg(`File #${file.id} has been Approved under Commissioner Sanction!`);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  // Commissioner Direct Rejection
  const handleCommissionerReject = (file: GVMCFile, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onUpdateFile) return;

    const reason = window.prompt(
      `Specify official rejection reason / non-compliance notes for File #${file.id}:`,
      'Rejected during Municipal Commissioner review due to non-compliance with statutory regulations.'
    );

    if (!reason || !reason.trim()) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userName = user?.name || 'Sri P. Sampath Kumar, IAS';
    const userDesignation = user?.designation || 'Municipal Commissioner';

    const updatedStep = {
      id: 'm-comm-rej-' + Date.now(),
      stepNumber: file.movementHistory.length + 1,
      department: 'General Administration' as Department,
      officerName: userName,
      designation: userDesignation,
      actionTaken: 'Application Rejected by Municipal Commissioner',
      date: todayStr,
      time: timeStr,
      status: 'completed' as const,
      remarks: reason,
      outwardNo: `GVMC/COMM/REJ/${Math.floor(1000 + Math.random() * 9000)}`
    };

    const newNote = {
      id: 'n-comm-rej-' + Date.now(),
      pageNumber: file.noteSheet.length + 1,
      officerName: `${userName} (Commissioner)`,
      designation: userDesignation,
      department: 'General Administration' as Department,
      timestamp: `${todayStr} ${timeStr}`,
      noteText: `REJECTION ORDER: ${reason}`,
      signatureCode: `SIG/GVMC/COMM/REJ/${Date.now().toString().slice(-5)}`
    };

    const updatedFile: GVMCFile = {
      ...file,
      currentStatus: 'Rejected',
      currentCustodian: userName,
      currentCustodianDesignation: userDesignation,
      movementHistory: [...file.movementHistory, updatedStep],
      noteSheet: [...file.noteSheet, newNote]
    };

    onUpdateFile(updatedFile);
    setActionSuccessMsg(`File #${file.id} has been REJECTED by Municipal Commissioner!`);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* COMMISSIONER EXECUTIVE COMMAND HEADER */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-indigo-900/60 relative overflow-hidden">
        {/* Background Decorative Accent */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-full shadow inline-flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-slate-950" />
                <span>MUNICIPAL COMMISSIONER EXECUTIVE COMMAND</span>
              </span>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 font-extrabold text-xs rounded-full border border-emerald-500/30">
                Live Data Analytics Mode
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-snug">
              {user?.name || 'Sri P. Sampath Kumar, IAS'}
            </h1>
            
            <p className="text-xs sm:text-sm text-indigo-200 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="flex items-center gap-1">
                <Building className="w-4 h-4 text-amber-400" />
                <strong>GVMC Head Office, Visakhapatnam</strong>
              </span>
              <span className="flex items-center gap-1 text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <strong>7 Municipal Departments Oversight</strong>
              </span>
            </p>
          </div>

          {/* Quick Data Action Controls */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {onClearCitizenData && (
              <button
                onClick={onClearCitizenData}
                className="px-4 py-2.5 bg-rose-600/90 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-2 border border-rose-400/40"
                title="Wipe saved citizen profiles to start fresh"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear Citizen Database</span>
              </button>
            )}

            {onResetFilesData && (
              <button
                onClick={onResetFilesData}
                className="px-4 py-2.5 bg-indigo-600/80 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-2 border border-indigo-400/40"
                title="Reset file registry to fresh real data"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset File Registry</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ACTION SUCCESS ALERT TOAST */}
      {actionSuccessMsg && (
        <div className="bg-emerald-600 text-white font-extrabold text-sm p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-400 animate-bounce">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-white" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* TOP METRIC KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Files</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">{totalFiles}</p>
            <p className="text-[10px] font-semibold text-slate-500 mt-0.5">Across 7 depts</p>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Sanctioned</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-emerald-600">{approvedFiles}</p>
            <p className="text-[10px] font-semibold text-emerald-700 mt-0.5">
              {totalFiles > 0 ? Math.round((approvedFiles / totalFiles) * 100) : 0}% Approved
            </p>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">In Processing</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-blue-600">{pendingFiles}</p>
            <p className="text-[10px] font-semibold text-blue-700 mt-0.5">Active review</p>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Rejected</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-rose-600">{rejectedFiles}</p>
            <p className="text-[10px] font-semibold text-rose-700 mt-0.5">Disapproved / Returned</p>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">SLA Overdue</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-amber-700">{overdueFiles}</p>
            <p className="text-[10px] font-semibold text-amber-800 mt-0.5">{atRiskFiles} near deadline</p>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Compliance</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-indigo-700">{slaComplianceRate}%</p>
            <p className="text-[10px] font-semibold text-slate-500 mt-0.5">Timely score</p>
          </div>
        </div>

      </div>

      {/* SECTION 1: DATA VISUALIZATIONS & CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* BAR CHART: DEPARTMENT-WISE PROGRESS BREAKDOWN */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                <span>Department-Wise Application Progress Breakdown</span>
              </h3>
              <p className="text-xs text-slate-500">
                Comparative breakdown of Approved vs Active Pending vs Overdue files per department
              </p>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 700, fill: '#475569' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#475569' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  labelStyle={{ fontWeight: 'bold', color: '#fbbf24' }}
                />
                <Bar dataKey="Approved" fill="#059669" radius={[4, 4, 0, 0]} name="Approved / Disposed" />
                <Bar dataKey="Pending" fill="#2563eb" radius={[4, 4, 0, 0]} name="In Review / Pending" />
                <Bar dataKey="Overdue" fill="#dc2626" radius={[4, 4, 0, 0]} name="SLA Overdue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PIE CHART: STATUS & CATEGORY DISTRIBUTION */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-indigo-600" />
              <span>Corporation Status Distribution</span>
            </h3>
            <p className="text-xs text-slate-500">Live share of stages across current files</p>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
            {statusPieData.map((s, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                <span className="truncate text-slate-700 font-semibold text-[11px]">{s.name}: <strong>{s.value}</strong></span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* SECTION 2: DEPARTMENT EFFICIENCY MATRIX */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-600" />
              <span>Municipal Department Performance Matrix</span>
            </h3>
            <p className="text-xs text-slate-500">Click any department card to filter the file table below</p>
          </div>

          <button
            onClick={() => setSelectedDeptFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedDeptFilter === 'all'
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Show All Departments ({totalFiles})
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {deptData.map((dept, idx) => {
            const isSelected = selectedDeptFilter === dept.fullName;

            return (
              <div
                key={idx}
                onClick={() => setSelectedDeptFilter(isSelected ? 'all' : dept.fullName)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                  isSelected 
                    ? 'bg-indigo-950 text-white border-indigo-700 shadow-md ring-2 ring-indigo-500' 
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-900 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-black uppercase tracking-wider truncate ${isSelected ? 'text-amber-300' : 'text-indigo-950'}`}>
                    {dept.fullName}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-indigo-800 text-indigo-200' : 'bg-white text-slate-700 border border-slate-200'
                  }`}>
                    {dept.Total} Files
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1 text-center text-xs">
                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-indigo-900/80' : 'bg-white'}`}>
                    <p className="text-[10px] text-slate-400">Approved</p>
                    <p className="font-extrabold text-emerald-500">{dept.Approved}</p>
                  </div>
                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-indigo-900/80' : 'bg-white'}`}>
                    <p className="text-[10px] text-slate-400">Pending</p>
                    <p className="font-extrabold text-blue-500">{dept.Pending}</p>
                  </div>
                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-indigo-900/80' : 'bg-white'}`}>
                    <p className="text-[10px] text-slate-400">Overdue</p>
                    <p className={`font-extrabold ${dept.Overdue > 0 ? 'text-rose-500 font-black' : 'text-slate-400'}`}>
                      {dept.Overdue}
                    </p>
                  </div>
                </div>

                {/* SLA Compliance Mini Bar */}
                <div>
                  <div className="flex justify-between text-[10px] font-semibold mb-1">
                    <span className={isSelected ? 'text-indigo-200' : 'text-slate-500'}>SLA Efficiency</span>
                    <span className={dept.SLACompliance < 80 ? 'text-rose-400 font-extrabold' : isSelected ? 'text-emerald-300' : 'text-emerald-600'}>
                      {dept.SLACompliance}%
                    </span>
                  </div>
                  <div className={`w-full h-1.5 rounded-full overflow-hidden ${isSelected ? 'bg-indigo-900' : 'bg-slate-200'}`}>
                    <div 
                      className={`h-full rounded-full ${dept.SLACompliance < 80 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                      style={{ width: `${dept.SLACompliance}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: EXECUTIVE FILE REGISTRY & ACTION OVERSIGHT TABLE */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-600" />
              <span>Executive File Oversight Registry ({filteredFiles.length})</span>
            </h3>
            <p className="text-xs text-slate-500">
              {selectedDeptFilter !== 'all' ? `Filtered by ${selectedDeptFilter}` : 'Showing files across all municipal departments'}
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ref #, applicant, ward..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Active Pending ({pendingFiles})</option>
              <option value="approved">Sanctioned / Approved ({approvedFiles})</option>
              <option value="overdue">SLA Overdue ({overdueFiles})</option>
              <option value="rejected">Rejected ({rejectedFiles})</option>
            </select>
          </div>
        </div>

        {/* FILES TABLE */}
        {filteredFiles.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <FileText className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="font-extrabold text-slate-800 text-sm">No municipal files match the selected filter criteria.</p>
            <button
              onClick={() => { setSelectedDeptFilter('all'); setStatusFilter('all'); setSearchQuery(''); }}
              className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow hover:bg-indigo-700"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs text-slate-800 border-collapse">
              <thead className="bg-slate-100 text-slate-900 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3.5">File Reference ID</th>
                  <th className="p-3.5">Applicant Name</th>
                  <th className="p-3.5">Department</th>
                  <th className="p-3.5">Subject & Category</th>
                  <th className="p-3.5">Workflow Stage</th>
                  <th className="p-3.5">SLA Target & Custodian</th>
                  <th className="p-3.5 text-right">Executive Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredFiles.map((file) => {
                  const isApproved = file.currentStatus === 'Approved' || file.currentStatus === 'Disposed & Issued';
                  const isOverdue = file.daysRemaining < 0;

                  return (
                    <tr 
                      key={file.id} 
                      onClick={() => onSelectFile(file)}
                      className="hover:bg-indigo-50/60 transition-colors cursor-pointer"
                    >
                      <td className="p-3.5 font-mono font-black text-indigo-900">
                        {file.id}
                        {file.priority !== 'Normal' && (
                          <span className={`block mt-0.5 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded w-max ${
                            file.priority === 'Grievance' ? 'bg-rose-100 text-rose-800' :
                            file.priority === 'Tatkal' ? 'bg-amber-100 text-amber-900' :
                            'bg-purple-100 text-purple-900'
                          }`}>
                            {file.priority}
                          </span>
                        )}
                      </td>

                      <td className="p-3.5">
                        <p className="font-extrabold text-slate-900">{file.applicantName}</p>
                        <p className="text-[10px] text-slate-500">{file.zone} • {file.wardNo}</p>
                      </td>

                      <td className="p-3.5">
                        <span className="font-extrabold text-indigo-950 px-2 py-1 bg-indigo-50 rounded-lg border border-indigo-100 inline-block">
                          {file.department}
                        </span>
                      </td>

                      <td className="p-3.5 max-w-xs">
                        <p className="font-semibold text-slate-800 truncate" title={file.subject}>{file.subject}</p>
                        <p className="text-[10px] text-slate-500">{file.category}</p>
                      </td>

                      <td className="p-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase inline-block shadow-sm ${
                          isApproved ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                          file.currentStatus === 'Rejected' ? 'bg-rose-100 text-rose-900 border border-rose-300' :
                          file.currentStatus === 'Clarification Required' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                          'bg-indigo-100 text-indigo-900 border border-indigo-300'
                        }`}>
                          {file.currentStatus}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <p className={`font-mono font-bold text-[11px] ${isOverdue ? 'text-rose-600' : 'text-slate-900'}`}>
                          {file.slaDueDate} ({file.daysRemaining}d left)
                        </p>
                        <p className="text-[10px] text-slate-500 truncate" title={file.currentCustodian}>
                          Cust: {file.currentCustodian}
                        </p>
                      </td>

                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => onSelectFile(file)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] rounded-lg transition-colors"
                          >
                            Dossier
                          </button>

                          {!isApproved && file.currentStatus !== 'Rejected' && onUpdateFile && (
                            <>
                              <button
                                onClick={(e) => handleCommissionerApprove(file, e)}
                                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[11px] rounded-lg transition-all shadow flex items-center gap-1"
                                title="Direct Municipal Commissioner Executive Approval"
                              >
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                                <span>Sanction</span>
                              </button>

                              <button
                                onClick={(e) => handleCommissionerReject(file, e)}
                                className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-[11px] rounded-lg transition-all shadow flex items-center gap-1"
                                title="Direct Municipal Commissioner Executive Rejection"
                              >
                                <XCircle className="w-3.5 h-3.5 stroke-[2]" />
                                <span>Reject</span>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
