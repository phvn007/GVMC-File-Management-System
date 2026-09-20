import React, { useState } from 'react';
import { Search, Filter, AlertOctagon, CheckCircle2, XCircle, Clock, Eye, Send, ArrowRight, Shield, AlertTriangle, FileText, ChevronRight, User } from 'lucide-react';
import { GVMCFile, Language, UserProfile, Department } from '../types';
import { getTranslation } from '../translations';

interface EmployeeDashboardProps {
  language: Language;
  user: UserProfile;
  files: GVMCFile[];
  onSelectFile: (file: GVMCFile) => void;
  onUpdateFile?: (file: GVMCFile) => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({
  language,
  user,
  files,
  onSelectFile,
  onUpdateFile
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState<string>(user.department || 'all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const handleEmployeeApprove = (file: GVMCFile, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onUpdateFile) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const updatedStep = {
      id: 'm-emp-app-' + Date.now(),
      stepNumber: file.movementHistory.length + 1,
      department: file.department,
      officerName: user.name,
      designation: user.designation || 'Department Officer',
      actionTaken: 'Sanction Order Granted & Digital Proceedings Signed',
      date: todayStr,
      time: timeStr,
      status: 'completed' as const,
      remarks: 'Sanction approved after technical and statutory verification.',
      outwardNo: `GVMC/SANCTION/2026/${Math.floor(10000 + Math.random() * 90000)}`
    };

    const newNote = {
      id: 'n-emp-app-' + Date.now(),
      pageNumber: file.noteSheet.length + 1,
      officerName: user.name,
      designation: user.designation || 'Department Officer',
      department: file.department,
      timestamp: `${todayStr} ${timeStr}`,
      noteText: 'Approved after verification. Sanction order signed.',
      signatureCode: `SIG/GVMC/APPROVED/${Math.floor(10000 + Math.random() * 90000)}`
    };

    const updatedFile: GVMCFile = {
      ...file,
      currentStatus: 'Approved',
      currentCustodian: user.name,
      currentCustodianDesignation: user.designation || 'Department Officer',
      movementHistory: [...file.movementHistory, updatedStep],
      noteSheet: [...file.noteSheet, newNote]
    };

    onUpdateFile(updatedFile);
    setActionSuccessMsg(`File #${file.id} has been SANCTIONED / APPROVED!`);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  const handleEmployeeReject = (file: GVMCFile, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onUpdateFile) return;

    const reason = window.prompt(
      `Specify official rejection reason / non-compliance notes for File #${file.id}:`,
      'Rejected during departmental review due to non-compliance with statutory regulations.'
    );

    if (!reason || !reason.trim()) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const updatedStep = {
      id: 'm-emp-rej-' + Date.now(),
      stepNumber: file.movementHistory.length + 1,
      department: file.department,
      officerName: user.name,
      designation: user.designation || 'Department Officer',
      actionTaken: 'Application Rejected by Department Officer',
      date: todayStr,
      time: timeStr,
      status: 'completed' as const,
      remarks: reason,
      outwardNo: `GVMC/REJECT/2026/${Math.floor(10000 + Math.random() * 90000)}`
    };

    const newNote = {
      id: 'n-emp-rej-' + Date.now(),
      pageNumber: file.noteSheet.length + 1,
      officerName: user.name,
      designation: user.designation || 'Department Officer',
      department: file.department,
      timestamp: `${todayStr} ${timeStr}`,
      noteText: `REJECTION ORDER: ${reason}`,
      signatureCode: `SIG/GVMC/REJECTED/${Math.floor(10000 + Math.random() * 90000)}`
    };

    const updatedFile: GVMCFile = {
      ...file,
      currentStatus: 'Rejected',
      currentCustodian: user.name,
      currentCustodianDesignation: user.designation || 'Department Officer',
      movementHistory: [...file.movementHistory, updatedStep],
      noteSheet: [...file.noteSheet, newNote]
    };

    onUpdateFile(updatedFile);
    setActionSuccessMsg(`File #${file.id} has been REJECTED with official remarks.`);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  // Filter files by department, priority, and status if selected
  const filteredFiles = files.filter(f => {
    const matchesDept = deptFilter === 'all' || f.department === deptFilter;
    const matchesPriority = priorityFilter === 'all' || f.priority === priorityFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'pending' && f.currentStatus !== 'Approved' && f.currentStatus !== 'Rejected' && f.currentStatus !== 'Disposed & Issued') ||
      (statusFilter === 'approved' && (f.currentStatus === 'Approved' || f.currentStatus === 'Disposed & Issued')) ||
      (statusFilter === 'rejected' && f.currentStatus === 'Rejected') ||
      (statusFilter === f.currentStatus);

    const matchesSearch = 
      f.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.wardNo.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesDept && matchesPriority && matchesStatus && matchesSearch;
  });

  const pendingCount = files.filter(f => f.currentStatus !== 'Approved' && f.currentStatus !== 'Disposed & Issued' && f.currentStatus !== 'Rejected').length;
  const overdueCount = files.filter(f => f.daysRemaining <= 0 && f.currentStatus !== 'Approved' && f.currentStatus !== 'Rejected').length;
  const approvedCount = files.filter(f => f.currentStatus === 'Approved' || f.currentStatus === 'Disposed & Issued').length;
  const rejectedCount = files.filter(f => f.currentStatus === 'Rejected').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      
      {/* Officer Header Card */}
      <div className="bg-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border-l-8 border-indigo-600 relative overflow-hidden">
        {/* Geometric Background Overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-3xl transform rotate-12 border border-indigo-400/20 pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-800/80 text-indigo-200 text-xs font-bold px-3 py-1 rounded-full border border-indigo-600/50 uppercase tracking-wide shadow-sm">
                Officer Desk • {user.department}
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-400/30">
                Active Duty
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {user.name}
            </h2>
            <p className="text-xs sm:text-sm text-indigo-200">
              {user.designation} • {user.zone || 'GVMC Head Office'}
            </p>
          </div>

          <div className="bg-indigo-900/60 backdrop-blur-sm px-5 py-3 rounded-xl border border-indigo-700/60 text-right shadow-md">
            <p className="text-xs text-indigo-200 uppercase font-bold tracking-wider">Inward SLA Target</p>
            <p className="text-xl font-black text-amber-300 mt-0.5">94.2% On-Time Disposal</p>
          </div>
        </div>
      </div>

      {/* Success Notification Banner */}
      {actionSuccessMsg && (
        <div className="bg-emerald-600 text-white font-bold p-4 rounded-2xl shadow-lg border border-emerald-500 flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
          <button onClick={() => setActionSuccessMsg(null)} className="text-white hover:text-emerald-100 font-extrabold text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Counter Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-indigo-100 shadow-sm flex items-center justify-between hover:border-indigo-200 transition-all">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Inward Queue</p>
            <p className="text-2xl font-black text-indigo-950 mt-1">{pendingCount}</p>
          </div>
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-700 shadow-inner">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-indigo-100 shadow-sm flex items-center justify-between hover:border-indigo-200 transition-all">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Rejected Files</p>
            <p className="text-2xl font-black text-rose-600 mt-1">{rejectedCount}</p>
          </div>
          <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 shadow-inner">
            <XCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-indigo-100 shadow-sm flex items-center justify-between hover:border-indigo-200 transition-all">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">SLA At Risk</p>
            <p className="text-2xl font-black text-amber-600 mt-1">{overdueCount}</p>
          </div>
          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 shadow-inner">
            <AlertOctagon className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-indigo-100 shadow-sm flex items-center justify-between hover:border-indigo-200 transition-all">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Disposed</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">{approvedCount}</p>
          </div>
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shadow-inner">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-indigo-100 shadow-sm flex items-center justify-between hover:border-indigo-200 transition-all">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Tatkal / Grievance</p>
            <p className="text-2xl font-black text-purple-700 mt-1">
              {files.filter(f => f.priority === 'Tatkal' || f.priority === 'Grievance').length}
            </p>
          </div>
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-700 shadow-inner">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Files Work Queue Table */}
      <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden">
        
        {/* Table Filters Toolbar */}
        <div className="p-5 border-b border-indigo-100 bg-indigo-50/40 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex-1 min-w-[260px] relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by File ID, Citizen Name, Subject, Ward..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-600">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Active Pending ({pendingCount})</option>
                <option value="approved">Approved / Disposed ({approvedCount})</option>
                <option value="rejected">Rejected ({rejectedCount})</option>
                <option value="Clarification Required">Clarification Required</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-600">Department:</span>
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                <option value="all">All Departments</option>
                <option value="Town Planning">Town Planning</option>
                <option value="Revenue & Taxes">Revenue & Taxes</option>
                <option value="Engineering & Works">Engineering & Works</option>
                <option value="Water Supply & Sewerage">Water Supply</option>
                <option value="Public Health & Sanitation">Public Health</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-600">Priority:</span>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                <option value="all">All Priorities</option>
                <option value="Normal">Normal</option>
                <option value="Tatkal">Tatkal</option>
                <option value="Grievance">Grievance</option>
              </select>
            </div>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-indigo-50/80 text-indigo-950 text-xs uppercase font-extrabold tracking-wider border-b border-indigo-100">
                <th className="py-3.5 px-4">File ID & Priority</th>
                <th className="py-3.5 px-4">Subject & Category</th>
                <th className="py-3.5 px-4">Applicant / Ward</th>
                <th className="py-3.5 px-4">Current Custodian</th>
                <th className="py-3.5 px-4">SLA Deadline</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm font-medium text-slate-800">
              {filteredFiles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500 font-semibold">
                    No files found matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-indigo-50/30 transition-colors">
                    
                    {/* File ID & Priority Badge */}
                    <td className="py-4 px-4 align-top">
                      <div className="font-mono font-extrabold text-indigo-950 text-xs bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200 inline-block">
                        {file.id}
                      </div>
                      <div className="mt-1">
                        {file.priority === 'Tatkal' && (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-300 uppercase">
                            ⚡ Tatkal
                          </span>
                        )}
                        {file.priority === 'Grievance' && (
                          <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded border border-rose-300 uppercase">
                            🚨 Grievance
                          </span>
                        )}
                        {file.priority === 'Normal' && (
                          <span className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded">
                            Normal
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Subject */}
                    <td className="py-4 px-4 align-top max-w-xs">
                      <p className="font-bold text-slate-900 line-clamp-2 leading-snug">
                        {file.subject}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 font-semibold">
                        {file.category}
                      </p>
                    </td>

                    {/* Applicant */}
                    <td className="py-4 px-4 align-top">
                      <div className="font-semibold text-slate-900">
                        {file.applicantName}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 truncate">
                        {file.wardNo}
                      </div>
                    </td>

                    {/* Custodian */}
                    <td className="py-4 px-4 align-top">
                      <div className="font-semibold text-slate-800 text-xs">
                        {file.currentCustodian}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {file.currentCustodianDesignation}
                      </div>
                    </td>

                    {/* SLA Target */}
                    <td className="py-4 px-4 align-top">
                      <div className="font-bold text-xs">
                        {file.slaDueDate}
                      </div>
                      <div className="mt-0.5">
                        {file.daysRemaining > 0 ? (
                          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            {file.daysRemaining} days left
                          </span>
                        ) : (
                          <span className="text-[11px] font-extrabold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            Overdue / Breached
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 align-top text-center">
                      <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full border ${
                        file.currentStatus === 'Approved' 
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : file.currentStatus === 'Rejected'
                          ? 'bg-rose-100 text-rose-800 border-rose-300'
                          : file.currentStatus === 'Clarification Required'
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-indigo-100 text-indigo-800 border-indigo-300'
                      }`}>
                        {file.currentStatus}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-4 px-4 align-top text-right">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        {file.currentStatus !== 'Approved' && file.currentStatus !== 'Rejected' && file.currentStatus !== 'Disposed & Issued' && onUpdateFile && (
                          <>
                            <button
                              onClick={(e) => handleEmployeeApprove(file, e)}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-extrabold rounded-lg shadow-sm inline-flex items-center gap-1 transition-all active:scale-95"
                              title="Direct Sanction / Approval"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Sanction</span>
                            </button>

                            <button
                              onClick={(e) => handleEmployeeReject(file, e)}
                              className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-extrabold rounded-lg shadow-sm inline-flex items-center gap-1 transition-all active:scale-95"
                              title="Reject Application"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => onSelectFile(file)}
                          className="px-3 py-1.5 bg-indigo-900 hover:bg-indigo-800 text-white text-[11px] font-bold rounded-lg shadow-sm inline-flex items-center gap-1 transition-all active:scale-95"
                        >
                          <span>Dossier</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
