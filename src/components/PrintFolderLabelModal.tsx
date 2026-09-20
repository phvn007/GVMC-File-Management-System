import React from 'react';
import { X, Printer, QrCode, Barcode as BarcodeIcon, Building2, Shield, CheckCircle2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import Barcode from 'react-barcode';
import { GVMCFile } from '../types';

interface PrintFolderLabelModalProps {
  file: GVMCFile;
  onClose: () => void;
}

export const PrintFolderLabelModal: React.FC<PrintFolderLabelModalProps> = ({ file, onClose }) => {
  
  const handlePrint = () => {
    window.print();
  };

  // Construct comprehensive file payload string for mobile QR scanners
  const qrFilePayload = `GVMC MUNICIPAL FILE DOSSIER
====================================
File Ref ID: ${file.id}
Applicant: ${file.applicantName} (${file.applicantPhone})
Department: ${file.department}
Zone / Ward: Zone ${file.zone}, Ward #${file.wardNo}
Subject: ${file.subject}
Category: ${file.category} | Priority: ${file.priority}
Inward Entry Date: ${file.submissionDate}
SLA Target Date: ${file.slaDueDate} (${file.slaDays} Days SLA)
Current Custodian: ${file.currentCustodian} (${file.currentCustodianDesignation})
Workflow Stage: ${file.currentStatus}
Movement Steps Logged: ${file.movementHistory.length}
Direct Tracking Web Link: ${window.location.origin}/?fileId=${encodeURIComponent(file.id)}`;

  // Spine barcode custody log payload string
  const barcodePayload = `GVMC-CUSTODY:${file.id}:${file.currentCustodian.replace(/\s+/g, '_')}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto">
        
        {/* Header */}
        <div className="bg-indigo-950 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-indigo-300" />
            <h3 className="font-extrabold text-base text-white">
              Official Physical File Folder Cover & Spine Barcode Label
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-indigo-200 hover:text-white rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Print Label Content Area */}
        <div className="p-6 space-y-6 overflow-y-auto print:p-0">
          
          <p className="text-xs text-slate-600 bg-amber-50 border border-amber-200 p-3 rounded-xl">
            <strong>Printing Instructions:</strong> Print this sheet on adhesive sticker paper. Affix <strong>Label A (QR Code)</strong> on the front cover of the physical file folder and <strong>Label B (Barcode)</strong> along the physical file folder spine.
          </p>

          {/* PRINTABLE AREA CONTAINER */}
          <div className="border-2 border-slate-800 rounded-2xl p-6 bg-white space-y-6 shadow-md print:border-none print:shadow-none">
            
            {/* GVMC Official Header */}
            <div className="border-b-2 border-indigo-900 pb-4 flex justify-between items-start gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-900 text-white rounded-xl flex items-center justify-center font-black text-xl shrink-0">
                  <Building2 className="w-7 h-7 text-indigo-200" />
                </div>
                <div>
                  <h2 className="font-black text-base text-indigo-950 uppercase tracking-tight">
                    GREATER VISAKHAPATNAM MUNICIPAL CORPORATION
                  </h2>
                  <p className="text-xs font-bold text-slate-600 uppercase">
                    PHYSICAL FILE MANAGEMENT & TRACKING LABEL
                  </p>
                  <p className="text-[11px] font-semibold text-indigo-900">
                    Zone: {file.zone} • Ward: {file.wardNo}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-block bg-indigo-950 text-white font-mono text-xs font-bold px-3 py-1 rounded-lg">
                  {file.id}
                </span>
                <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold">Category: {file.priority}</p>
              </div>
            </div>

            {/* LABEL A: COVER PRINTED QR CODE LABEL */}
            <div className="p-4 bg-slate-50 border-2 border-indigo-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between border-b border-indigo-200/80 pb-2">
                <span className="font-extrabold text-xs uppercase text-indigo-950 tracking-wider flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-indigo-700" />
                  LABEL A: PHYSICAL FILE COVER QR CODE
                </span>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Affix on Folder Cover</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-5">
                {/* Visual Real Scan-able QR Code Display */}
                <div className="p-3 bg-white border-2 border-slate-900 rounded-xl shadow-sm text-center shrink-0 flex flex-col items-center justify-center">
                  <QRCodeSVG 
                    value={qrFilePayload}
                    size={140}
                    level="M"
                    includeMargin={true}
                    bgColor="#ffffff"
                    fgColor="#090d16"
                  />
                  <p className="font-mono text-[10px] font-bold text-indigo-950 mt-1">
                    SCAN WITH MOBILE CAMERA
                  </p>
                </div>

                <div className="space-y-1.5 text-xs flex-1">
                  <p><strong>File ID:</strong> <span className="font-mono font-extrabold text-indigo-900">{file.id}</span></p>
                  <p><strong>Department:</strong> {file.department}</p>
                  <p><strong>Applicant Name:</strong> {file.applicantName}</p>
                  <p><strong>Subject:</strong> {file.subject}</p>
                  <p><strong>Entry Date:</strong> {file.submissionDate} • SLA Target: {file.slaDueDate}</p>
                  <p className="text-[11px] text-slate-500 italic mt-1">
                    * Scanning this QR Code displays creator details, department, date entered, reference number, and complete movement history.
                  </p>
                </div>
              </div>
            </div>

            {/* LABEL B: SPINE PRINTED PROCESS BARCODE LABEL */}
            <div className="p-4 bg-emerald-50/80 border-2 border-emerald-300 rounded-xl space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-300 pb-2">
                <span className="font-extrabold text-xs uppercase text-emerald-950 tracking-wider flex items-center gap-1.5">
                  <BarcodeIcon className="w-4 h-4 text-emerald-700" />
                  LABEL B: FOLDER SPINE PROCESS TRACKING BARCODE
                </span>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Affix along Spine</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="p-2 bg-white border-2 border-slate-900 rounded-xl text-center shrink-0 flex flex-col items-center justify-center overflow-x-auto max-w-full">
                  <Barcode 
                    value={file.id} 
                    width={1.5} 
                    height={50} 
                    fontSize={11} 
                    margin={4} 
                    background="#ffffff" 
                    lineColor="#064e3b" 
                  />
                  <p className="font-mono text-[9px] font-black text-emerald-950 tracking-wider mt-0.5">
                    OFFICIAL FILE SPINE CODE
                  </p>
                </div>

                <div className="text-xs space-y-1 flex-1">
                  <p><strong>Current Custodian:</strong> {file.currentCustodian} ({file.currentCustodianDesignation})</p>
                  <p><strong>Current Stage:</strong> {file.currentStatus}</p>
                  <p><strong>SLA Deadline:</strong> {file.slaDueDate} ({file.daysRemaining} days remaining)</p>
                  <p className="text-[11px] text-emerald-800 font-semibold mt-1">
                    * Officers scan this 1D Barcode when receiving/forwarding file to create automatic timestamped custody logs.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-between items-center shrink-0">
          <p className="text-xs text-slate-500 font-medium">GVMC Barcode Standard v2026</p>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2 bg-indigo-900 hover:bg-indigo-800 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print Folder Stickers</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
