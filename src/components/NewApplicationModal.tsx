import React, { useState } from 'react';
import { X, FilePlus, Building2, MapPin, Send, CheckCircle2, Upload } from 'lucide-react';
import { GVMCFile, Language, UserProfile, Department, FilePriority } from '../types';
import { getTranslation } from '../translations';

interface NewApplicationModalProps {
  language: Language;
  currentUser: UserProfile;
  onClose: () => void;
  onSubmitNewFile: (newFile: GVMCFile) => void;
}

export const NewApplicationModal: React.FC<NewApplicationModalProps> = ({
  language,
  currentUser,
  onClose,
  onSubmitNewFile
}) => {
  const [department, setDepartment] = useState<Department>('Town Planning');
  const [category, setCategory] = useState('Building Plan Approval (Residential G+2)');
  const [subject, setSubject] = useState('');
  const [wardNo, setWardNo] = useState('Ward 24 (MVP Colony)');
  const [zone, setZone] = useState('Zone 3 - Visakhapatnam North');
  const [priority, setPriority] = useState<FilePriority>('Normal');
  const [applicantAddress, setApplicantAddress] = useState('Plot No. 18, Ward 24, Visakhapatnam');
  const [fileName, setFileName] = useState('Registered_Sale_Deed_Property.pdf');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;

    const randomNo = Math.floor(10000 + Math.random() * 90000);
    const deptPrefix = 
      department === 'Town Planning' ? 'TP' :
      department === 'Revenue & Taxes' ? 'REV' :
      department === 'Water Supply & Sewerage' ? 'WS' :
      department === 'Engineering & Works' ? 'ENG' : 'PH';

    const newFileId = `GVMC/${deptPrefix}/2026/${randomNo}`;
    const todayStr = new Date().toISOString().split('T')[0];

    const newFile: GVMCFile = {
      id: newFileId,
      subject: subject,
      applicantName: currentUser.name,
      applicantPhone: currentUser.phone,
      applicantAddress: applicantAddress,
      wardNo: wardNo,
      zone: zone,
      department: department,
      category: category,
      priority: priority,
      currentStatus: 'Submitted',
      currentCustodian: 'Central Inward Desk',
      currentCustodianDesignation: 'Inward Scrutiny Officer',
      submissionDate: todayStr,
      slaDays: priority === 'Tatkal' ? 7 : 15,
      slaDueDate: '2026-08-15',
      daysRemaining: priority === 'Tatkal' ? 7 : 15,
      movementHistory: [
        {
          id: 'm_init_' + Date.now(),
          stepNumber: 1,
          department: 'General Administration',
          officerName: 'Citizen Service Center (CSC Desk 1)',
          designation: 'Inward Scrutiny Officer',
          actionTaken: 'Application Received & Digital Registration Completed',
          date: todayStr,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'completed',
          remarks: 'Citizen submission received with required document attachments.',
          outwardNo: `GVMC/INW/2026/${randomNo}`
        },
        {
          id: 'm_curr_' + Date.now(),
          stepNumber: 2,
          department: department,
          officerName: 'Inward Field Inspector',
          designation: 'Department Inspector',
          actionTaken: 'Assigned for Inward Verification',
          date: todayStr,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'current',
          remarks: 'File placed in department queue.'
        }
      ],
      noteSheet: [
        {
          id: 'n_init_' + Date.now(),
          pageNumber: 1,
          officerName: 'Citizen Service Portal',
          designation: 'System Auto-Inward',
          department: 'General Administration',
          timestamp: `${todayStr} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          noteText: `Application filed by ${currentUser.name} (Phone: ${currentUser.phone}). Subject: ${subject}. Application fees recorded.`,
          signatureCode: `SIG/GVMC/AUTO/${randomNo}`
        }
      ],
      enclosures: [
        {
          id: 'e_init_' + Date.now(),
          name: fileName,
          size: '1.5 MB',
          type: 'PDF Document',
          uploadedBy: 'Applicant',
          uploadedAt: todayStr
        }
      ]
    };

    onSubmitNewFile(newFile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        
        {/* Header */}
        <div className="bg-indigo-950 text-white p-5 flex items-center justify-between relative overflow-hidden">
          {/* Background Grid Accent */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          <div className="flex items-center gap-2 relative z-10">
            <FilePlus className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-lg text-white">
              {getTranslation(language, 'newApplication')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-indigo-200 hover:text-white rounded-xl transition-colors relative z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Select Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as Department)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                <option value="Town Planning">Town Planning</option>
                <option value="Revenue & Taxes">Revenue & Taxes</option>
                <option value="Water Supply & Sewerage">Water Supply</option>
                <option value="Engineering & Works">Engineering & Works</option>
                <option value="Public Health & Sanitation">Public Health</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Application Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as FilePriority)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                <option value="Normal">Normal (Standard SLA)</option>
                <option value="Tatkal">Tatkal (Fast-Track 7 Days)</option>
                <option value="Grievance">Spandana Public Grievance</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Category / Service Type
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., Building Permission, Property Mutation, New Water Connection"
              className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Application Subject / Description
            </label>
            <textarea
              rows={3}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Provide brief details of your request (e.g., Construction of residential G+1 building in Ward 24)..."
              className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Ward No / Area
              </label>
              <input
                type="text"
                value={wardNo}
                onChange={(e) => setWardNo(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Municipal Zone
              </label>
              <select
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                <option value="Zone 1 - Visakhapatnam Central">Zone 1 - Visakhapatnam Central</option>
                <option value="Zone 2 - Visakhapatnam South">Zone 2 - Visakhapatnam South</option>
                <option value="Zone 3 - Visakhapatnam North">Zone 3 - Visakhapatnam North</option>
                <option value="Zone 4 - Anakapalle">Zone 4 - Anakapalle</option>
                <option value="Zone 5 - Gajuwaka">Zone 5 - Gajuwaka</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Upload Supporting Document / Blueprint
            </label>
            <div className="p-4 border-2 border-dashed border-indigo-200/90 rounded-2xl bg-indigo-50/40 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-600" />
                <span className="text-xs font-semibold text-slate-800 truncate">{fileName}</span>
              </div>
              <button
                type="button"
                onClick={() => setFileName(`Document_${Math.floor(100 + Math.random()*900)}.pdf`)}
                className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-800 shadow-sm"
              >
                Attach File
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Submit Application & Generate File No</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
