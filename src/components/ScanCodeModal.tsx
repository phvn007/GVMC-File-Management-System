import React, { useState } from 'react';
import { 
  X, 
  QrCode, 
  Barcode as BarcodeIcon, 
  Camera, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  UserCheck, 
  Building2, 
  Calendar, 
  FileText, 
  ArrowRight, 
  ShieldAlert, 
  RefreshCw,
  Printer,
  History,
  Layers,
  Search,
  Smartphone
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import Barcode from 'react-barcode';
import { GVMCFile, UserProfile, MovementStep } from '../types';
import { getTranslation } from '../translations';

interface ScanCodeModalProps {
  files: GVMCFile[];
  currentUser: UserProfile | null;
  onClose: () => void;
  onUpdateFile?: (file: GVMCFile) => void;
  onSelectFile?: (file: GVMCFile) => void;
  initialScanMode?: 'qr' | 'barcode';
  initialFileId?: string;
}

export const ScanCodeModal: React.FC<ScanCodeModalProps> = ({
  files,
  currentUser,
  onClose,
  onUpdateFile,
  onSelectFile,
  initialScanMode = 'qr',
  initialFileId
}) => {
  const [scanMode, setScanMode] = useState<'qr' | 'barcode'>(initialScanMode);
  const [selectedFileId, setSelectedFileId] = useState<string>(initialFileId || files[0]?.id || '');
  const [isScanningActive, setIsScanningActive] = useState<boolean>(true);
  const [customInput, setCustomInput] = useState<string>('');
  const [custodySuccessMsg, setCustodySuccessMsg] = useState<string | null>(null);

  const matchedFile = files.find(
    f => f.id.toLowerCase() === selectedFileId.toLowerCase() || f.id.toLowerCase().includes(selectedFileId.toLowerCase())
  );

  const handleSimulateScan = (fileId: string) => {
    setSelectedFileId(fileId);
    setIsScanningActive(false);
    setCustodySuccessMsg(null);
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    const found = files.find(f => f.id.toLowerCase().includes(customInput.trim().toLowerCase()));
    if (found) {
      setSelectedFileId(found.id);
      setIsScanningActive(false);
      setCustodySuccessMsg(null);
    } else {
      alert(`No municipal file found matching barcode/QR: '${customInput}'`);
    }
  };

  const handleTakeCustody = (file: GVMCFile) => {
    if (!currentUser || currentUser.role !== 'employee') {
      alert('Only authorized municipal officers can log physical file custody.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Build new movement step
    const newStepNumber = file.movementHistory.length + 1;
    const newStep: MovementStep = {
      id: 'm-' + Date.now(),
      stepNumber: newStepNumber,
      department: currentUser.department || file.department,
      officerName: currentUser.name,
      designation: currentUser.designation || 'Municipal Officer',
      actionTaken: `Physical File Received & Custody Verified via Barcode Scan`,
      date: today,
      time: timeStr,
      status: 'current',
      remarks: `Scanned file spine barcode at ${currentUser.zone || 'GVMC Office'}. Automatic custody log generated.`
    };

    // Update previous steps to 'completed'
    const updatedHistory: MovementStep[] = [
      ...file.movementHistory.map(step => ({
        ...step,
        status: (step.status === 'current' ? 'completed' : step.status) as MovementStep['status']
      })),
      newStep
    ];

    const updatedFile: GVMCFile = {
      ...file,
      currentCustodian: currentUser.name,
      currentCustodianDesignation: currentUser.designation || 'Municipal Officer',
      department: currentUser.department || file.department,
      movementHistory: updatedHistory,
      daysRemaining: Math.max(1, file.daysRemaining)
    };

    if (onUpdateFile) {
      onUpdateFile(updatedFile);
    }

    setCustodySuccessMsg(
      `Custody Logged Successfully! You (${currentUser.name}, ${currentUser.designation}) are now registered as the official physical custodian of File #${file.id}.`
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-indigo-100 overflow-hidden flex flex-col max-h-[92vh] my-auto">
        
        {/* Modal Top Header */}
        <div className="bg-indigo-950 text-white p-5 flex items-center justify-between shrink-0 relative overflow-hidden">
          {/* Background Grid */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 bg-indigo-900 border border-indigo-700/80 rounded-xl flex items-center justify-center text-indigo-200 shadow-inner">
              {scanMode === 'qr' ? <QrCode className="w-6 h-6 text-indigo-300" /> : <Barcode className="w-6 h-6 text-emerald-400" />}
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white leading-tight">
                {scanMode === 'qr' ? 'Physical File Cover QR Scanner' : 'Spine Barcode Process & Custody Tracker'}
              </h3>
              <p className="text-xs text-indigo-200">
                {scanMode === 'qr' 
                  ? 'Scan printed folder cover QR code for complete movement history' 
                  : 'Scan file spine barcode to track workflow stage & update custody log'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-indigo-200 hover:text-white bg-indigo-900/80 hover:bg-indigo-800 rounded-xl transition-colors relative z-10"
            title="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scan Mode Toggle Bar */}
        <div className="bg-indigo-50/60 p-3 border-b border-indigo-100 flex flex-wrap justify-between items-center gap-3 shrink-0">
          <div className="flex bg-white rounded-xl p-1 border border-indigo-200/80 shadow-sm">
            <button
              onClick={() => { setScanMode('qr'); setIsScanningActive(true); setCustodySuccessMsg(null); }}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
                scanMode === 'qr' 
                  ? 'bg-indigo-900 text-white shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-indigo-50'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>1. Cover QR Code (Movement History)</span>
            </button>

            <button
              onClick={() => { setScanMode('barcode'); setIsScanningActive(true); setCustodySuccessMsg(null); }}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
                scanMode === 'barcode' 
                  ? 'bg-emerald-700 text-white shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-indigo-50'
              }`}
            >
              <Barcode className="w-4 h-4" />
              <span>2. Spine Barcode (Process & Custody Log)</span>
            </button>
          </div>

          <button
            onClick={() => setIsScanningActive(!isScanningActive)}
            className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm"
          >
            <Camera className="w-3.5 h-3.5 text-indigo-600" />
            <span>{isScanningActive ? 'Pause Camera' : 'Re-activate Camera'}</span>
          </button>
        </div>

        {/* Modal Body Container */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Simulated Scanner Camera Feed view if active */}
          {isScanningActive && (
            <div className="relative bg-slate-950 rounded-2xl overflow-hidden p-6 text-center text-white border border-slate-800 shadow-inner flex flex-col items-center justify-center min-h-[220px]">
              
              {/* Laser animation */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent shadow-[0_0_15px_#f43f5e] animate-pulse" />

              {/* Target Bounding Box */}
              <div className="w-48 h-36 border-2 border-dashed border-emerald-400/80 rounded-xl relative flex items-center justify-center bg-emerald-500/5 my-2">
                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-emerald-400" />
                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-emerald-400" />
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-emerald-400" />
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-emerald-400" />

                {scanMode === 'qr' ? (
                  <QrCode className="w-16 h-16 text-emerald-400/70 animate-pulse" />
                ) : (
                  <Barcode className="w-20 h-20 text-emerald-400/70 animate-pulse" />
                )}
              </div>

              <p className="text-xs font-bold text-slate-300">
                Point smartphone or optical scanner at physical file cover QR or spine barcode
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Select a physical demo file below or type file number manually
              </p>

              {/* Quick Select Buttons for Demo Files */}
              <div className="mt-4 flex flex-wrap justify-center gap-2 max-w-xl">
                {files.map(f => (
                  <button
                    key={f.id}
                    onClick={() => handleSimulateScan(f.id)}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-indigo-200 border border-slate-700 rounded-lg text-[11px] font-mono font-bold transition-all"
                  >
                    Scan #{f.id.split('/').pop()}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Manual Input Search Bar */}
          <form onSubmit={handleManualSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Or enter printed File ID / Barcode No. (e.g., GVMC/TP/2026/08942)"
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl transition-colors shrink-0"
            >
              Decode Code
            </button>
          </form>

          {custodySuccessMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-start gap-3 shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-extrabold text-sm text-emerald-950">Custody Transfer Recorded!</p>
                <p className="text-xs text-emerald-800 mt-0.5">{custodySuccessMsg}</p>
              </div>
            </div>
          )}

          {/* RESULT CARD IF FILE MATCHED */}
          {matchedFile ? (
            <div className="space-y-6">
              
              {/* File Info Bar Header */}
              <div className="p-4 bg-indigo-50/80 border border-indigo-200 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-extrabold bg-indigo-900 text-white px-2.5 py-1 rounded-lg">
                      {matchedFile.id}
                    </span>
                    <span className="text-xs font-bold bg-white text-indigo-950 px-2.5 py-1 rounded-lg border border-indigo-200">
                      {matchedFile.department}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm mt-1.5">
                    {matchedFile.subject}
                  </h4>
                </div>

                {onSelectFile && (
                  <button
                    onClick={() => { onSelectFile(matchedFile); onClose(); }}
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Open Full Dossier</span>
                  </button>
                )}
              </div>

              {/* MODE 1: COVER QR CODE SCAN RESULT (Creator, Department, Date Entered, Ref No, Complete Movement History) */}
              {scanMode === 'qr' && (
                <div className="space-y-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2 text-indigo-950 font-extrabold text-sm">
                      <QrCode className="w-5 h-5 text-indigo-600" />
                      <span>Physical File Cover QR Audit Summary</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                      Printed Folder Label Match
                    </span>
                  </div>

                  {/* Live Mobile Scan-able QR Code Box */}
                  <div className="p-4 bg-indigo-950 text-white rounded-2xl flex flex-col sm:flex-row items-center gap-5 shadow-lg">
                    <div className="p-2 bg-white rounded-xl shadow shrink-0">
                      <QRCodeSVG 
                        value={`GVMC MUNICIPAL FILE DOSSIER\n====================================\nFile Ref ID: ${matchedFile.id}\nApplicant: ${matchedFile.applicantName} (${matchedFile.applicantPhone})\nDepartment: ${matchedFile.department}\nZone / Ward: Zone ${matchedFile.zone}, Ward #${matchedFile.wardNo}\nSubject: ${matchedFile.subject}\nCategory: ${matchedFile.category} | Priority: ${matchedFile.priority}\nInward Entry Date: ${matchedFile.submissionDate}\nSLA Target Date: ${matchedFile.slaDueDate} (${matchedFile.slaDays} Days SLA)\nCurrent Custodian: ${matchedFile.currentCustodian} (${matchedFile.currentCustodianDesignation})\nWorkflow Stage: ${matchedFile.currentStatus}\nMovement Steps Logged: ${matchedFile.movementHistory.length}\nDirect Tracking Link: ${window.location.origin}/?fileId=${encodeURIComponent(matchedFile.id)}`}
                        size={135}
                        level="M"
                        includeMargin={true}
                        bgColor="#ffffff"
                        fgColor="#090d16"
                      />
                    </div>
                    <div className="space-y-1.5 text-center sm:text-left flex-1">
                      <div className="flex items-center gap-1.5 justify-center sm:justify-start text-xs font-bold text-amber-300">
                        <Smartphone className="w-4 h-4 text-amber-400" />
                        <span>Mobile Camera Scan-able QR Code</span>
                      </div>
                      <h4 className="font-extrabold text-sm text-white">
                        Scan with your Mobile Phone Camera
                      </h4>
                      <p className="text-xs text-indigo-200 leading-relaxed">
                        Point your iOS Camera, Google Lens, or WhatsApp scanner at this QR code. Your mobile phone will instantly read and display the applicant name, reference number, department, SLA target, current custodian officer, and full movement history!
                      </p>
                    </div>
                  </div>

                  {/* 5 Key Cover Information Points */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-[11px] font-bold text-slate-500 uppercase">Created By / Applicant</p>
                      <p className="font-extrabold text-slate-900 mt-1">{matchedFile.applicantName}</p>
                      <p className="text-[11px] text-slate-600">{matchedFile.applicantPhone}</p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-[11px] font-bold text-slate-500 uppercase">Department & Zone</p>
                      <p className="font-extrabold text-slate-900 mt-1">{matchedFile.department}</p>
                      <p className="text-[11px] text-slate-600">{matchedFile.zone}</p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-[11px] font-bold text-slate-500 uppercase">Date Entered / Inward</p>
                      <p className="font-extrabold text-slate-900 mt-1">{matchedFile.submissionDate}</p>
                      <p className="text-[11px] text-slate-600">Category: {matchedFile.category}</p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-[11px] font-bold text-slate-500 uppercase">Reference Number</p>
                      <p className="font-mono font-extrabold text-indigo-900 mt-1">{matchedFile.id}</p>
                      <p className="text-[11px] text-emerald-700 font-bold">Verified Digital ID</p>
                    </div>
                  </div>

                  {/* Complete Movement History Timeline (Which officer had it and when) */}
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <h5 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-2">
                      <History className="w-4 h-4 text-indigo-600" />
                      <span>Complete Custody & Movement History Log</span>
                    </h5>

                    <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
                      {matchedFile.movementHistory.map((step) => (
                        <div key={step.id} className="relative pl-8 flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                          <div className={`absolute left-2 w-3.5 h-3.5 rounded-full border-2 ${
                            step.status === 'completed' 
                              ? 'bg-emerald-500 border-white ring-2 ring-emerald-200'
                              : step.status === 'current'
                              ? 'bg-amber-500 border-white ring-2 ring-amber-200 animate-pulse'
                              : 'bg-slate-300 border-white'
                          }`} />

                          <div>
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                              <span>Step {step.stepNumber}: {step.officerName}</span>
                              <span className="text-[11px] text-slate-600 font-normal">({step.designation})</span>
                            </div>
                            <p className="text-xs text-slate-600 mt-0.5">{step.actionTaken}</p>
                            {step.remarks && (
                              <p className="text-[11px] text-slate-500 italic mt-0.5">"{step.remarks}"</p>
                            )}
                          </div>

                          <div className="text-right text-[11px] text-slate-500 shrink-0">
                            <span className="font-bold text-slate-700">{step.date}</span> • {step.time}
                            {step.outwardNo && (
                              <div className="font-mono text-[10px] text-indigo-700 font-semibold">{step.outwardNo}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* MODE 2: SPINE BARCODE SCAN RESULT (Current stage, Who has it right now, Days at stage, SLA Status, Take Custody Action) */}
              {scanMode === 'barcode' && (
                <div className="space-y-5 bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2 text-emerald-950 font-extrabold text-sm">
                      <BarcodeIcon className="w-6 h-6 text-emerald-600" />
                      <span>Process Tracking & Active Custody Barcode Analysis</span>
                    </div>
                    <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-md">
                      File Spine Barcode Match
                    </span>
                  </div>

                  {/* Live Mobile Scan-able 1D Barcode Box */}
                  <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-center gap-5 shadow-lg">
                    <div className="p-2.5 bg-white rounded-xl shadow shrink-0 overflow-x-auto max-w-full">
                      <Barcode 
                        value={matchedFile.id} 
                        width={1.5} 
                        height={55} 
                        fontSize={11} 
                        margin={4} 
                        background="#ffffff" 
                        lineColor="#064e3b" 
                      />
                    </div>
                    <div className="space-y-1.5 text-center sm:text-left flex-1">
                      <div className="flex items-center gap-1.5 justify-center sm:justify-start text-xs font-bold text-emerald-400">
                        <Smartphone className="w-4 h-4 text-emerald-400" />
                        <span>Code 128 Folder Spine Barcode</span>
                      </div>
                      <h4 className="font-extrabold text-sm text-white">
                        Scanned Spine Barcode: {matchedFile.id}
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Contains official municipal file ID, current custodian officer <strong>{matchedFile.currentCustodian}</strong>, and workflow stage <strong>{matchedFile.currentStatus}</strong>.
                      </p>
                    </div>
                  </div>

                  {/* Process Stage & SLA Status Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    
                    <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200">
                      <p className="text-[11px] font-bold text-emerald-900 uppercase">Current Workflow Stage</p>
                      <p className="font-extrabold text-slate-900 mt-1">{matchedFile.currentStatus}</p>
                      <p className="text-[11px] text-emerald-800 font-medium">Department: {matchedFile.department}</p>
                    </div>

                    <div className="p-3 bg-indigo-50/80 rounded-xl border border-indigo-200">
                      <p className="text-[11px] font-bold text-indigo-900 uppercase">Current Custodian</p>
                      <p className="font-extrabold text-slate-900 mt-1">{matchedFile.currentCustodian}</p>
                      <p className="text-[11px] text-indigo-800 font-medium">{matchedFile.currentCustodianDesignation}</p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-[11px] font-bold text-slate-500 uppercase">Days at Current Stage</p>
                      <p className="font-extrabold text-slate-900 mt-1">
                        {Math.max(1, matchedFile.slaDays - matchedFile.daysRemaining)} Days Active
                      </p>
                      <p className="text-[11px] text-slate-600">Total SLA: {matchedFile.slaDays} Days</p>
                    </div>

                    <div className={`p-3 rounded-xl border ${
                      matchedFile.daysRemaining < 0 
                        ? 'bg-rose-50 border-rose-200 text-rose-900' 
                        : matchedFile.daysRemaining <= 2
                        ? 'bg-amber-50 border-amber-200 text-amber-900'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    }`}>
                      <p className="text-[11px] font-bold uppercase">SLA Compliance Status</p>
                      <p className="font-extrabold text-sm mt-1">
                        {matchedFile.daysRemaining < 0 
                          ? '🚨 Overdue / Breached' 
                          : matchedFile.daysRemaining <= 2
                          ? '⚠️ Critical (SLA Near Expiry)'
                          : '✅ Within Defined SLA'}
                      </p>
                      <p className="text-[11px] opacity-90">{matchedFile.daysRemaining} days remaining till due date ({matchedFile.slaDueDate})</p>
                    </div>

                  </div>

                  {/* Officer Action Bar: Scan Barcode to Log Custody */}
                  <div className="p-4 bg-slate-900 text-white rounded-xl flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="font-extrabold text-sm text-white flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-emerald-400" />
                        <span>Log Automatic Physical Custody Entry</span>
                      </p>
                      <p className="text-xs text-slate-300 mt-0.5">
                        {currentUser && currentUser.role === 'employee' 
                          ? `Officer logged in as: ${currentUser.name} (${currentUser.designation || 'Officer'})`
                          : 'Login as Department Officer to update custody upon receiving physical folder.'}
                      </p>
                    </div>

                    {currentUser && currentUser.role === 'employee' ? (
                      <button
                        onClick={() => handleTakeCustody(matchedFile)}
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95"
                      >
                        <Barcode className="w-4 h-4" />
                        <span>Scan & Receive File into My Custody</span>
                      </button>
                    ) : (
                      <span className="text-xs text-amber-300 font-semibold bg-amber-900/40 px-3 py-1.5 rounded-lg border border-amber-500/30">
                        Employee Authentication Required
                      </span>
                    )}
                  </div>

                </div>
              )}

            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
              <QrCode className="w-12 h-12 text-slate-400 mx-auto mb-2" />
              <p className="font-bold text-sm text-slate-700">No file scanned yet</p>
              <p className="text-xs text-slate-500">Select any sample file code above or scan physical QR/Barcode.</p>
            </div>
          )}

        </div>

        {/* Modal Bottom Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-between items-center text-xs text-slate-600 shrink-0">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-700" />
            <span className="font-bold">GVMC Integrated Physical File Barcode Audit System</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
