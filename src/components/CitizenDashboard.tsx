import React, { useState } from 'react';
import { Search, Plus, FileText, Clock, CheckCircle2, AlertTriangle, Eye, ArrowUpRight, Download, Filter, MapPin, Building, Calendar, PhoneCall, ChevronRight } from 'lucide-react';
import { GVMCFile, Language, UserProfile } from '../types';
import { getTranslation } from '../translations';

interface CitizenDashboardProps {
  language: Language;
  user: UserProfile;
  files: GVMCFile[];
  onSelectFile: (file: GVMCFile) => void;
  onOpenNewApplicationModal: () => void;
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({
  language,
  user,
  files,
  onSelectFile,
  onOpenNewApplicationModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter citizen relevant files by phone or name or aadhaar
  const isDemoCitizen = user.id === 'CITIZEN-DEMO' || user.phone === '9848012345';
  
  const myFiles = files.filter(f => {
    if (isDemoCitizen) {
      return f.applicantPhone === '9848012345' || f.applicantName.toLowerCase().includes('ramana');
    }
    return (
      (Boolean(f.applicantPhone) && f.applicantPhone === user.phone) ||
      (Boolean(f.applicantAadhaar) && Boolean(user.aadhaar) && f.applicantAadhaar === user.aadhaar) ||
      (Boolean(f.applicantName) && f.applicantName.toLowerCase().trim() === user.name.toLowerCase().trim())
    );
  });

  const displayFiles = myFiles.filter(f => {
    const matchesSearch = 
      f.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.wardNo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || f.currentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
      case 'Disposed & Issued':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            {status}
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-1 rounded-full border border-rose-300">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            Rejected
          </span>
        );
      case 'In Review':
      case 'Inspection Pending':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            {status}
          </span>
        );
      case 'Clarification Required':
        return (
          <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 text-xs font-bold px-2.5 py-1 rounded-full border border-red-300">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
            {status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full border border-blue-300">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-indigo-800/60">
        {/* Background Geometric Grid Overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="absolute -right-8 -bottom-8 w-60 h-60 bg-indigo-500/15 rounded-3xl transform rotate-12 border border-indigo-400/20 pointer-events-none" />

        <div className="relative z-10 flex flex-wrap justify-between items-center gap-6">
          <div>
            <span className="inline-block bg-indigo-800/60 text-indigo-200 text-xs font-bold px-3 py-1 rounded-full border border-indigo-600/40 mb-2 uppercase tracking-wide shadow-sm">
              Welcome, Citizen • {user.zone}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {user.name}
            </h2>
            <p className="text-sm text-indigo-200 mt-1 max-w-xl">
              Track real-time departmental movement, site verification reports, and digital approval status for all your GVMC civic applications.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={onOpenNewApplicationModal}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <span>{getTranslation(language, 'newApplication')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Quick Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-indigo-100 shadow-sm flex items-center justify-between hover:border-indigo-200 transition-all">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">My Total Applications</p>
            <p className="text-2xl font-black text-indigo-950 mt-1">{myFiles.length}</p>
          </div>
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-700 shadow-inner">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-indigo-100 shadow-sm flex items-center justify-between hover:border-indigo-200 transition-all">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">In Progress / Pending</p>
            <p className="text-2xl font-black text-amber-600 mt-1">
              {myFiles.filter(f => f.currentStatus === 'In Review' || f.currentStatus === 'Inspection Pending' || f.currentStatus === 'Submitted').length}
            </p>
          </div>
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 shadow-inner">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-indigo-100 shadow-sm flex items-center justify-between hover:border-indigo-200 transition-all">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Sanctioned / Disposed</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">
              {myFiles.filter(f => f.currentStatus === 'Approved' || f.currentStatus === 'Disposed & Issued').length}
            </p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shadow-inner">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-indigo-100 shadow-sm flex items-center justify-between hover:border-indigo-200 transition-all">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Rejected / Disapproved</p>
            <p className="text-2xl font-black text-rose-600 mt-1">
              {myFiles.filter(f => f.currentStatus === 'Rejected').length}
            </p>
          </div>
          <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 shadow-inner">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden">
        
        {/* Controls Toolbar */}
        <div className="p-5 border-b border-indigo-100/80 bg-indigo-50/40 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex-1 min-w-[260px] relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={getTranslation(language, 'searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="all">All Statuses</option>
              <option value="In Review">In Review</option>
              <option value="Inspection Pending">Inspection Pending</option>
              <option value="Approved">Approved</option>
              <option value="Clarification Required">Clarification Required</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Applications List Grid */}
        <div className="divide-y divide-slate-100">
          {displayFiles.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <FileText className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p className="font-bold text-base text-slate-700">No applications found matching search.</p>
              <p className="text-xs text-slate-500 mt-1">Try clearing filters or click "Submit New File / Application" above.</p>
            </div>
          ) : (
            displayFiles.map((file) => (
              <div 
                key={file.id} 
                className="p-5 sm:p-6 hover:bg-indigo-50/30 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-extrabold bg-indigo-50 text-indigo-950 px-2.5 py-1 rounded-lg border border-indigo-200">
                      {file.id}
                    </span>
                    {getStatusBadge(file.currentStatus)}
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md">
                      {file.department}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 leading-snug">
                    {file.subject}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600 pt-1">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{file.wardNo}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">Custodian: <strong>{file.currentCustodian}</strong></span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Submitted: <strong>{file.submissionDate}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => onSelectFile(file)}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-all hover:shadow active:scale-95"
                  >
                    <Eye className="w-4 h-4" />
                    <span>{getTranslation(language, 'viewDetails')}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* Quick Public Helper Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-amber-50/80 border border-amber-200/90 p-5 rounded-2xl flex items-start gap-4 shadow-sm">
          <PhoneCall className="w-8 h-8 text-amber-700 shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-sm text-amber-900">Need Help with SLA Delays?</h4>
            <p className="text-xs text-amber-800 mt-1 leading-relaxed">
              As per the Andhra Pradesh Right to Services Act, municipal applications must be processed within the statutory SLA days. If your file is delayed past the target date, contact the Zonal Commissioner grievance cell directly at <strong>1800-425-0001</strong>.
            </p>
          </div>
        </div>

        <div className="bg-indigo-50/80 border border-indigo-200/90 p-5 rounded-2xl flex items-start gap-4 shadow-sm">
          <CheckCircle2 className="w-8 h-8 text-indigo-700 shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-sm text-indigo-950">AP-DPMS Building Permission Portal</h4>
            <p className="text-xs text-indigo-900/90 mt-1 leading-relaxed">
              Town Planning drawings and Auto-DCR scrutiny reports are synchronized in real-time with the AP-DPMS state server. You can download digitally signed sanction proceedings anytime.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
