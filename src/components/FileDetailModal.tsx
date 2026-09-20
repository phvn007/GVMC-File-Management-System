import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, Clock, MapPin, Calendar, FileText, Send, AlertTriangle, ArrowRight, Download, Printer, UserCheck, ShieldCheck, ChevronRight, FileCheck, Layers, MessageSquare, Plus, QrCode, Barcode as BarcodeIcon, Smartphone, Check, FileSpreadsheet, Activity } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import Barcode from 'react-barcode';
import { GVMCFile, Language, UserProfile, Department } from '../types';
import { getTranslation } from '../translations';
import { PrintFolderLabelModal } from './PrintFolderLabelModal';

interface FileDetailModalProps {
  language: Language;
  file: GVMCFile;
  currentUser: UserProfile | null;
  onClose: () => void;
  onUpdateFile: (updatedFile: GVMCFile) => void;
}

export const FileDetailModal: React.FC<FileDetailModalProps> = ({
  language,
  file,
  currentUser,
  onClose,
  onUpdateFile
}) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'notesheet' | 'enclosures' | 'action'>('timeline');
  const [showPrintLabelModal, setShowPrintLabelModal] = useState(false);

  // Action form state for officers
  const [remarkText, setRemarkText] = useState('');
  const [forwardToOfficer, setForwardToOfficer] = useState('Sri V. Nageswara Rao (Chief City Planner)');
  const [targetDept, setTargetDept] = useState<Department>(file.department);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  const isOfficer = currentUser?.role === 'employee' || currentUser?.role === 'commissioner';

  // Determine current workflow stage for the visual progress bar
  const getStageInfo = (status: string) => {
    switch (status) {
      case 'Submitted':
        return { activeIndex: 0, percentage: 25, label: 'Submitted & Inwarded', color: 'bg-indigo-600' };
      case 'In Review':
        return { activeIndex: 1, percentage: 50, label: 'Under Technical Scrutiny', color: 'bg-blue-600' };
      case 'Inspection Pending':
        return { activeIndex: 1, percentage: 55, label: 'Field Site Verification', color: 'bg-amber-600' };
      case 'Clarification Required':
        return { activeIndex: 2, percentage: 70, label: 'Applicant Action Required', color: 'bg-orange-600' };
      case 'Approved':
      case 'Disposed & Issued':
        return { activeIndex: 3, percentage: 100, label: 'Approved & Sanction Order Issued', color: 'bg-emerald-600' };
      case 'Rejected':
        return { activeIndex: 3, percentage: 100, label: 'Application Rejected', color: 'bg-rose-600' };
      default:
        return { activeIndex: 1, percentage: 50, label: 'In Processing', color: 'bg-indigo-600' };
    }
  };

  const stageInfo = getStageInfo(file.currentStatus);

  const handleForwardFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remarkText.trim()) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const newStepNumber = file.movementHistory.length + 1;

    // Create new movement step
    const newStep = {
      id: 'm_' + Date.now(),
      stepNumber: newStepNumber,
      department: targetDept,
      officerName: forwardToOfficer,
      designation: 'Department Officer',
      actionTaken: `File Forwarded by ${currentUser?.name} (${currentUser?.designation})`,
      date: todayStr,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'current' as const,
      remarks: remarkText,
      outwardNo: `GVMC/FWD/${todayStr.replace(/-/g, '')}/${Math.floor(1000 + Math.random() * 9000)}`
    };

    // Update previous current step to completed
    const updatedHistory = file.movementHistory.map(step => ({
      ...step,
      status: step.status === 'current' ? ('completed' as const) : step.status
    }));

    updatedHistory.push(newStep);

    // Add note sheet entry
    const newNote = {
      id: 'n_' + Date.now(),
      pageNumber: file.noteSheet.length + 1,
      officerName: currentUser?.name || 'Officer',
      designation: currentUser?.designation || 'Department Officer',
      department: currentUser?.department || file.department,
      timestamp: `${todayStr} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      noteText: remarkText,
      signatureCode: `SIG/GVMC/${currentUser?.employeeId || 'EMP'}/${Math.floor(1000 + Math.random() * 9000)}`
    };

    const updatedFile: GVMCFile = {
      ...file,
      currentCustodian: forwardToOfficer,
      currentCustodianDesignation: 'Department Officer',
      department: targetDept,
      movementHistory: updatedHistory,
      noteSheet: [...file.noteSheet, newNote]
    };

    onUpdateFile(updatedFile);
    setActionSuccessMsg(`File successfully forwarded to ${forwardToOfficer}!`);
    setRemarkText('');
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  const handleApproveFile = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const updatedHistory = file.movementHistory.map(step => ({
      ...step,
      status: 'completed' as const
    }));

    const finalStep = {
      id: 'm_approved_' + Date.now(),
      stepNumber: file.movementHistory.length + 1,
      department: file.department,
      officerName: currentUser?.name || 'Zonal Commissioner',
      designation: currentUser?.designation || 'Approving Authority',
      actionTaken: 'Sanction Order Issued & Digital Proceedings Signed',
      date: todayStr,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'completed' as const,
      remarks: 'Application approved after technical and statutory verification.',
      outwardNo: `GVMC/SANCTION/2026/${Math.floor(10000 + Math.random() * 90000)}`
    };

    updatedHistory.push(finalStep);

    const newNote = {
      id: 'n_approved_' + Date.now(),
      pageNumber: file.noteSheet.length + 1,
      officerName: currentUser?.name || 'Approving Authority',
      designation: currentUser?.designation || 'Zonal Commissioner',
      department: file.department,
      timestamp: `${todayStr} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      noteText: 'Order passed. Building/Permission certificate digitally signed and ready for issue.',
      signatureCode: `SIG/GVMC/APPROVED/${Math.floor(10000 + Math.random() * 90000)}`
    };

    const updatedFile: GVMCFile = {
      ...file,
      currentStatus: 'Approved',
      movementHistory: updatedHistory,
      noteSheet: [...file.noteSheet, newNote]
    };

    onUpdateFile(updatedFile);
    setActionSuccessMsg('File status updated to APPROVED & Sanction Order Issued!');
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  const handleRejectFile = () => {
    let rejectionReason = remarkText.trim();
    if (!rejectionReason) {
      const promptReason = window.prompt(
        `Specify official rejection reason / non-compliance notes for File #${file.id}:`,
        'Application rejected due to statutory non-compliance and incomplete documentation.'
      );
      if (!promptReason || !promptReason.trim()) {
        return;
      }
      rejectionReason = promptReason.trim();
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const updatedHistory = file.movementHistory.map(step => ({
      ...step,
      status: 'completed' as const
    }));

    const finalStep = {
      id: 'm_rejected_' + Date.now(),
      stepNumber: file.movementHistory.length + 1,
      department: file.department,
      officerName: currentUser?.name || 'Reviewing Officer',
      designation: currentUser?.designation || 'Reviewing Authority',
      actionTaken: 'Application Rejected & Rejection Order Issued',
      date: todayStr,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'completed' as const,
      remarks: rejectionReason,
      outwardNo: `GVMC/REJECT/2026/${Math.floor(10000 + Math.random() * 90000)}`
    };

    updatedHistory.push(finalStep);

    const newNote = {
      id: 'n_rejected_' + Date.now(),
      pageNumber: file.noteSheet.length + 1,
      officerName: currentUser?.name || 'Reviewing Officer',
      designation: currentUser?.designation || 'Reviewing Authority',
      department: file.department,
      timestamp: `${todayStr} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      noteText: `REJECTION ORDER: ${rejectionReason}`,
      signatureCode: `SIG/GVMC/REJECTED/${Math.floor(10000 + Math.random() * 90000)}`
    };

    const updatedFile: GVMCFile = {
      ...file,
      currentStatus: 'Rejected',
      movementHistory: updatedHistory,
      noteSheet: [...file.noteSheet, newNote]
    };

    onUpdateFile(updatedFile);
    setActionSuccessMsg('File status updated to REJECTED with official remarks recorded.');
    setRemarkText('');
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto">
        
        {/* Modal Header */}
        <div className="bg-indigo-950 text-white p-5 sm:p-6 flex items-start justify-between gap-4 shrink-0 relative overflow-hidden">
          {/* Background Grid Accent */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          <div className="space-y-1 relative z-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold bg-indigo-900/80 text-indigo-200 px-2.5 py-1 rounded-lg border border-indigo-700/80">
                {file.id}
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-md border border-emerald-400/30">
                {file.department}
              </span>
              <span className="bg-amber-400/20 text-amber-200 text-xs font-bold px-2.5 py-0.5 rounded-md border border-amber-300/30">
                Status: {file.currentStatus}
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold leading-snug text-white">
              {file.subject}
            </h2>

            <div className="text-xs text-indigo-200 flex flex-wrap gap-x-4 gap-y-1 pt-1">
              <span>Applicant: <strong>{file.applicantName}</strong></span>
              <span>•</span>
              <span>Location: <strong>{file.wardNo}</strong></span>
              <span>•</span>
              <span>SLA Target: <strong>{file.slaDueDate}</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 relative z-10">
            <button
              onClick={() => setShowPrintLabelModal(true)}
              className="px-3 py-1.5 bg-indigo-900/90 hover:bg-indigo-800 text-indigo-100 border border-indigo-700/80 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              title="Print Physical Folder Cover QR & Spine Barcode Label"
            >
              <QrCode className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Print Folder Label (QR & Barcode)</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-indigo-200 hover:text-white bg-indigo-900/80 hover:bg-indigo-800 rounded-xl transition-colors shrink-0"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-indigo-100 bg-indigo-50/40 px-4 sm:px-6 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'timeline'
                ? 'border-indigo-600 text-indigo-950 bg-white shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>File Movement Timeline</span>
          </button>

          <button
            onClick={() => setActiveTab('notesheet')}
            className={`py-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'notesheet'
                ? 'border-indigo-600 text-indigo-950 bg-white shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Digital Note Sheet ({file.noteSheet.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('enclosures')}
            className={`py-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'enclosures'
                ? 'border-indigo-600 text-indigo-950 bg-white shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Enclosures & Drawings ({file.enclosures.length})</span>
          </button>

          {isOfficer && (
            <button
              onClick={() => setActiveTab('action')}
              className={`py-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'action'
                  ? 'border-emerald-600 text-emerald-800 bg-white shadow-sm'
                  : 'border-transparent text-emerald-800 hover:text-emerald-900'
              }`}
            >
              <Send className="w-4 h-4 text-emerald-600" />
              <span>Officer Action Panel</span>
            </button>
          )}
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {actionSuccessMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{actionSuccessMsg}</span>
            </div>
          )}

          {/* REJECTION BANNER IF FILE IS REJECTED */}
          {file.currentStatus === 'Rejected' && (
            <div className="bg-rose-50 border-2 border-rose-300 text-rose-900 p-4 rounded-xl flex items-start gap-3 shadow-sm">
              <XCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-rose-950 uppercase tracking-wide">
                  Application Status: REJECTED
                </h4>
                <p className="text-xs text-rose-800 leading-relaxed">
                  This application was reviewed and officially <strong>REJECTED</strong>. Check the <strong>File Movement Timeline</strong> and <strong>Digital Note Sheet</strong> below for the official non-compliance remarks and order details.
                </p>
              </div>
            </div>
          )}

          {/* QUICK OFFICER DECISION DESK BAR (If file is pending review) */}
          {isOfficer && file.currentStatus !== 'Approved' && file.currentStatus !== 'Rejected' && (
            <div className="bg-indigo-900 text-white p-3.5 px-5 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-md border border-indigo-800">
              <div className="flex items-center gap-2 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>Officer Decision Desk:</strong> Review dossier and issue immediate executive sanction or rejection order.
                </span>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={handleApproveFile}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-lg shadow transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Sanction File</span>
                </button>
                <button
                  type="button"
                  onClick={handleRejectFile}
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-lg shadow transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Reject File</span>
                </button>
              </div>
            </div>
          )}

          {/* VISUAL WORKFLOW STAGE PROGRESS BAR COMPONENT */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-5 rounded-2xl border border-indigo-900/80 shadow-xl text-white space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-800/60 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-400" />
                <div>
                  <h4 className="font-extrabold text-sm text-white leading-none">
                    Live Application Workflow Stage Progress
                  </h4>
                  <p className="text-[11px] text-indigo-200 mt-0.5">
                    Real-time status tracking for File #{file.id}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white shadow ${
                  file.currentStatus === 'Approved' ? 'bg-emerald-600' :
                  file.currentStatus === 'Rejected' ? 'bg-rose-600' :
                  file.currentStatus === 'Clarification Required' ? 'bg-amber-500 text-slate-950 font-bold' :
                  'bg-indigo-600'
                }`}>
                  Stage {stageInfo.activeIndex + 1} of 4: {file.currentStatus}
                </span>
              </div>
            </div>

            {/* Progress Bar Track */}
            <div className="relative pt-1 pb-1">
              <div className="flex justify-between text-[11px] text-indigo-200 font-semibold mb-1.5">
                <span>Application Stage Progress ({stageInfo.percentage}%)</span>
                <span>SLA Target: {file.slaDueDate} ({file.daysRemaining} days left)</span>
              </div>

              {/* Background Bar */}
              <div className="w-full h-3.5 bg-indigo-950/90 rounded-full overflow-hidden p-0.5 border border-indigo-700/60 shadow-inner">
                <div 
                  className={`h-full rounded-full transition-all duration-700 shadow-md ${stageInfo.color}`}
                  style={{ width: `${stageInfo.percentage}%` }}
                />
              </div>

              {/* Stage Indicator Nodes */}
              <div className="grid grid-cols-4 gap-1 mt-4">
                {[
                  { title: '1. Inward Submission', desc: 'Acknowledgement' },
                  { title: '2. Field Inspection', desc: 'Site Verification' },
                  { title: '3. Dept Scrutiny', desc: 'Technical Scrutiny' },
                  { title: '4. Final Approval', desc: 'Sanction Order' },
                ].map((stg, idx) => {
                  const isCompleted = idx < stageInfo.activeIndex || (idx === 3 && file.currentStatus === 'Approved');
                  const isCurrent = idx === stageInfo.activeIndex && file.currentStatus !== 'Approved';
                  
                  return (
                    <div key={idx} className="flex flex-col items-center text-center space-y-1.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all border-2 ${
                        isCompleted 
                          ? 'bg-emerald-500 border-emerald-300 text-slate-950 shadow-md' 
                          : isCurrent 
                            ? 'bg-amber-400 border-white text-slate-950 font-black ring-4 ring-amber-400/30 animate-pulse'
                            : 'bg-indigo-900/60 border-indigo-700 text-indigo-300'
                      }`}>
                        {isCompleted ? (
                          <Check className="w-4 h-4 stroke-[3]" />
                        ) : (
                          <span>{idx + 1}</span>
                        )}
                      </div>
                      
                      <div className="px-1">
                        <p className={`text-[11px] font-extrabold leading-tight ${
                          isCurrent ? 'text-amber-300' : isCompleted ? 'text-emerald-300' : 'text-indigo-200/80'
                        }`}>
                          {stg.title}
                        </p>
                        <p className="text-[10px] text-indigo-300/70 hidden sm:block mt-0.5">
                          {stg.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* DUAL CODES CARD: QR CODE (FILE DOSSIER) + BARCODE (SPINE) */}
          <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-lg border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                <Smartphone className="w-4 h-4" />
                <span>Mobile Scan-able Dossier QR Code & 1D Spine Barcode</span>
              </div>
              <button
                onClick={() => setShowPrintLabelModal(true)}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-all shadow flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Folder Label Sticker</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              {/* CODE 1: QR CODE */}
              <div className="p-3 bg-white rounded-xl text-slate-900 flex items-center gap-3 border border-slate-200">
                <div className="shrink-0 p-1 bg-slate-50 rounded-lg">
                  <QRCodeSVG 
                    value={`GVMC MUNICIPAL FILE DOSSIER\n====================================\nFile Ref ID: ${file.id}\nApplicant: ${file.applicantName} (${file.applicantPhone})\nDepartment: ${file.department}\nZone / Ward: Zone ${file.zone}, Ward #${file.wardNo}\nSubject: ${file.subject}\nCategory: ${file.category} | Priority: ${file.priority}\nInward Entry Date: ${file.submissionDate}\nSLA Target Date: ${file.slaDueDate} (${file.slaDays} Days SLA)\nCurrent Custodian: ${file.currentCustodian} (${file.currentCustodianDesignation})\nWorkflow Stage: ${file.currentStatus}\nMovement Steps Logged: ${file.movementHistory.length}\nDirect Tracking Link: ${window.location.origin}/?fileId=${encodeURIComponent(file.id)}`}
                    size={105}
                    level="M"
                    includeMargin={true}
                    bgColor="#ffffff"
                    fgColor="#090d16"
                  />
                </div>
                <div className="text-xs space-y-1">
                  <span className="inline-block px-2 py-0.5 bg-indigo-100 text-indigo-900 font-extrabold text-[10px] rounded uppercase">
                    Code 1: Dossier QR
                  </span>
                  <p className="font-extrabold text-slate-900">Applicant File Data</p>
                  <p className="text-[11px] text-slate-600 leading-tight">
                    Contains applicant name, department, inward date, SLA days & movement steps.
                  </p>
                </div>
              </div>

              {/* CODE 2: 1D BARCODE */}
              <div className="p-3 bg-white rounded-xl text-slate-900 flex items-center gap-3 border border-slate-200 overflow-hidden">
                <div className="shrink-0 p-1 bg-slate-50 rounded-lg overflow-x-auto max-w-[140px]">
                  <Barcode 
                    value={file.id} 
                    width={1.2} 
                    height={40} 
                    fontSize={10} 
                    margin={2} 
                    background="#ffffff" 
                    lineColor="#0f172a" 
                  />
                </div>
                <div className="text-xs space-y-1">
                  <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-900 font-extrabold text-[10px] rounded uppercase">
                    Code 2: Spine Barcode
                  </span>
                  <p className="font-extrabold text-slate-900">Custody Tracking Barcode</p>
                  <p className="text-[11px] text-slate-600 leading-tight">
                    Scanned by officers when physically receiving or forwarding file folders.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* TAB 1: FILE MOVEMENT TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-extrabold text-slate-900 text-base">
                  Sequential Departmental Approval History
                </h3>
                <span className="text-xs font-bold text-slate-500">
                  Total Steps: {file.movementHistory.length}
                </span>
              </div>

              {/* Vertical Timeline Tree */}
              <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-300">
                {file.movementHistory.map((step, idx) => (
                  <div key={step.id || idx} className="relative group">
                    
                    {/* Node Dot */}
                    <div className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shadow ${
                      step.status === 'completed'
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                        : step.status === 'current'
                        ? 'bg-[#0747a6] text-white ring-4 ring-blue-100 animate-pulse'
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      {step.status === 'completed' ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <span>{step.stepNumber}</span>
                      )}
                    </div>

                    {/* Content Box */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 hover:border-blue-300 transition-all shadow-sm">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-2 mb-2">
                        <div>
                          <span className="text-xs font-bold text-[#00317b] uppercase tracking-wider">
                            Step {step.stepNumber}: {step.department}
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                            {step.officerName}
                          </h4>
                          <p className="text-xs text-slate-600 font-medium">
                            {step.designation}
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-bold text-slate-700 bg-white px-2.5 py-1 rounded border border-slate-200">
                            {step.date} • {step.time}
                          </span>
                          {step.outwardNo && (
                            <div className="text-[11px] font-mono text-slate-500 mt-1">
                              Ref: {step.outwardNo}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-800">
                        <p className="font-bold text-[#0747a6]">
                          Action: {step.actionTaken}
                        </p>
                        {step.remarks && (
                          <div className="p-2.5 bg-white rounded border border-slate-200 text-slate-700 italic">
                            "{step.remarks}"
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: DIGITAL NOTE SHEET */}
          {activeTab === 'notesheet' && (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-xs text-amber-900 flex items-center justify-between">
                <span className="font-bold">Official Municipal Record • Note Sheet Registry</span>
                <span className="font-mono text-[11px]">Dossier: {file.id}</span>
              </div>

              <div className="space-y-4">
                {file.noteSheet.map((note) => (
                  <div key={note.id} className="bg-white border-2 border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
                    <div className="flex justify-between items-center text-xs border-b border-slate-200 pb-2">
                      <span className="font-bold text-[#00317b] bg-blue-50 px-2 py-0.5 rounded">
                        Note Sheet Page #{note.pageNumber}
                      </span>
                      <span className="text-slate-500 font-mono text-[11px]">
                        {note.timestamp}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-serif whitespace-pre-line">
                      {note.noteText}
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex justify-between items-end text-xs">
                      <div>
                        <div className="font-bold text-slate-900">{note.officerName}</div>
                        <div className="text-slate-500">{note.designation} ({note.department})</div>
                      </div>
                      <div className="text-right font-mono text-[10px] text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                        Digital Seal: {note.signatureCode}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ENCLOSURES */}
          {activeTab === 'enclosures' && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">
                Submitted Drawings, Deeds, & Inspection Enclosures
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {file.enclosures.map((enc) => (
                  <div key={enc.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between hover:border-blue-300 transition-all">
                    <div className="space-y-1">
                      <p className="font-bold text-xs text-slate-900 truncate max-w-[220px]">
                        {enc.name}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {enc.type} • {enc.size} • Uploaded by {enc.uploadedBy} ({enc.uploadedAt})
                      </p>
                    </div>

                    <button
                      onClick={() => alert(`Downloading ${enc.name}...`)}
                      className="p-2 bg-white hover:bg-blue-50 text-[#0747a6] border border-slate-300 rounded-lg shadow-sm transition-colors shrink-0"
                      title="Download Document"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: OFFICER ACTION PANEL */}
          {activeTab === 'action' && isOfficer && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-xs text-blue-900 space-y-1">
                <p className="font-bold text-sm text-[#00317b]">Officer Workflow Action Desk</p>
                <p>Forward this file to the next reviewing authority or pass sanction order.</p>
              </div>

              <form onSubmit={handleForwardFile} className="space-y-4 bg-white p-5 border border-slate-200 rounded-xl">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Select Target Department
                  </label>
                  <select
                    value={targetDept}
                    onChange={(e) => setTargetDept(e.target.value as Department)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0747a6]"
                  >
                    <option value="Town Planning">Town Planning Department</option>
                    <option value="Revenue & Taxes">Revenue & Taxes Department</option>
                    <option value="Engineering & Works">Engineering & Works Department</option>
                    <option value="Water Supply & Sewerage">Water Supply Department</option>
                    <option value="Public Health & Sanitation">Public Health Department</option>
                    <option value="General Administration">General Administration (Zonal Commissioner)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Forward To Officer / Designation
                  </label>
                  <input
                    type="text"
                    value={forwardToOfficer}
                    onChange={(e) => setForwardToOfficer(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0747a6]"
                    placeholder="Officer Name & Designation"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Official Note / Remarks (Will be appended to Note Sheet)
                  </label>
                  <textarea
                    rows={4}
                    value={remarkText}
                    onChange={(e) => setRemarkText(e.target.value)}
                    placeholder="Enter formal departmental observation, inspection notes, or sanction recommendation..."
                    className="w-full p-3 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0747a6]"
                    required
                  />
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#0747a6] hover:bg-[#00317b] text-white font-bold text-xs rounded-lg shadow flex items-center gap-2 transition-all active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                    <span>Forward File to Next Officer</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRejectFile}
                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg shadow flex items-center gap-2 transition-all active:scale-95"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject File / Issue Disapproval</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleApproveFile}
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow flex items-center gap-2 transition-all active:scale-95 ml-auto"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Issue Sanction Order</span>
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

        {/* Modal Footer Bar */}
        <div className="bg-slate-100 p-4 px-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => alert(`Official Acknowledgement Receipt for ${file.id} generated!`)}
              className="px-4 py-2 bg-white hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4 text-indigo-700" />
              <span>Print Acknowledgement PDF</span>
            </button>

            <button
              onClick={() => setShowPrintLabelModal(true)}
              className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Barcode className="w-4 h-4 text-emerald-700" />
              <span>Print Cover QR & Spine Barcode</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-colors ml-auto"
          >
            Close Dossier
          </button>
        </div>

      </div>

      {showPrintLabelModal && (
        <PrintFolderLabelModal
          file={file}
          onClose={() => setShowPrintLabelModal(false)}
        />
      )}
    </div>
  );
};
