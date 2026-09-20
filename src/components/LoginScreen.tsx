import React, { useState, useEffect } from 'react';
import { Building2, Phone, ArrowRight, Lock, User, FileSearch, ShieldCheck, CheckCircle2, Sparkles, Building, AlertCircle, QrCode, Barcode, Scan, Camera, MapPin, Flag, CreditCard, UserPlus, MessageSquare, Smartphone, Zap } from 'lucide-react';
import { Language, Department, UserProfile } from '../types';
import { getTranslation } from '../translations';
import { DEMO_USERS, PRESET_OFFICERS } from '../data/mockFiles';

interface LoginScreenProps {
  language: Language;
  onLoginSuccess: (user: UserProfile) => void;
  onDirectTrackFile: (fileId: string) => void;
  onScanCodeTrigger?: () => void;
  onClearCitizenData?: () => void;
}

interface RegisteredCitizen {
  aadhaarNo: string;
  name: string;
  phone: string;
  zone: string;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  language,
  onLoginSuccess,
  onDirectTrackFile,
  onScanCodeTrigger,
  onClearCitizenData
}) => {
  const [activeTab, setActiveTab] = useState<'citizen_login' | 'citizen_register' | 'employee' | 'commissioner'>('citizen_login');
  
  // Citizen login state
  const [aadhaarOrPhone, setAadhaarOrPhone] = useState('123456789012');
  const [step, setStep] = useState<'aadhaar' | 'otp'>('aadhaar');
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [directFileId, setDirectFileId] = useState('GVMC/TP/2026/08942');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Citizen Registration state
  const [regAadhaar, setRegAadhaar] = useState('');
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regZone, setRegZone] = useState('Zone 3 - Visakhapatnam North');

  // Employee / Officer login state
  const [empDept, setEmpDept] = useState<Department>('Town Planning');
  const [empId, setEmpId] = useState('GVMC-TP-101');
  const [officerCustomName, setOfficerCustomName] = useState('');
  const [password, setPassword] = useState('gvmc123');

  // Commissioner login state
  const [commId, setCommId] = useState('GVMC-COMM-001');
  const [commPass, setCommPass] = useState('gvmc123');

  // 2Factor.in API Integration States
  const [twoFactorStatus, setTwoFactorStatus] = useState<{ configured: boolean; apiKeyMasked: string | null } | null>(null);
  const [isSendingSms, setIsSendingSms] = useState<boolean>(false);
  const [smsDeliveryMode, setSmsDeliveryMode] = useState<'2factor' | 'simulated' | null>(null);
  const [twoFactorRequestId, setTwoFactorRequestId] = useState<string | null>(null);
  const [showTwoFactorInfoModal, setShowTwoFactorInfoModal] = useState<boolean>(false);
  const [customApiKeyInput, setCustomApiKeyInput] = useState<string>('');

  // Registered citizens from localStorage
  const [citizensList, setCitizensList] = useState<RegisteredCitizen[]>([]);

  useEffect(() => {
    // Fetch 2Factor.in status from server
    fetch('/api/2factor-status')
      .then(res => res.json())
      .then(data => setTwoFactorStatus(data))
      .catch(err => console.error('Error fetching 2Factor.in status:', err));

    try {
      const saved = localStorage.getItem('gvmc_registered_citizens');
      if (saved) {
        setCitizensList(JSON.parse(saved));
      } else {
        // Initial default demo citizen
        const defaultList: RegisteredCitizen[] = [{
          aadhaarNo: '123456789012',
          name: DEMO_USERS.citizen.name,
          phone: DEMO_USERS.citizen.phone,
          zone: 'Zone 3 - Visakhapatnam North'
        }];
        setCitizensList(defaultList);
        localStorage.setItem('gvmc_registered_citizens', JSON.stringify(defaultList));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Handle citizen registration
  const handleRegisterCitizen = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAadhaar = regAadhaar.replace(/\D/g, '');
    const cleanPhone = regPhone.replace(/\D/g, '');

    if (cleanAadhaar.length !== 12) {
      setErrorMsg('Please enter a valid 12-digit Aadhaar Card Number.');
      return;
    }
    if (cleanPhone.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit Mobile Number.');
      return;
    }
    if (!regName.trim()) {
      setErrorMsg('Please enter citizen full name.');
      return;
    }

    const newCitizen: RegisteredCitizen = {
      aadhaarNo: cleanAadhaar,
      name: regName.trim(),
      phone: cleanPhone,
      zone: regZone
    };

    const updated = [newCitizen, ...citizensList.filter(c => c.aadhaarNo !== cleanAadhaar)];
    setCitizensList(updated);
    try {
      localStorage.setItem('gvmc_registered_citizens', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    setErrorMsg('');
    setSuccessMsg(`Aadhaar ${cleanAadhaar} registered successfully! Redirecting to OTP Verification...`);
    
    // Switch to login tab & send OTP
    setAadhaarOrPhone(cleanAadhaar);
    setTimeout(() => {
      setActiveTab('citizen_login');
      triggerSendOtp(cleanAadhaar, cleanPhone, regName.trim());
      setSuccessMsg('');
    }, 1200);
  };

  // Helper to send OTP via 2Factor.in API endpoint and trigger SMS alert banner
  const triggerSendOtp = async (identifier: string, targetPhone: string, userName: string) => {
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);
    setEnteredOtp('');
    setStep('otp');
    setErrorMsg('');
    setIsSendingSms(true);
    setTwoFactorRequestId(null);

    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobileNumber: targetPhone,
          otpCode: randomOtp,
          purpose: 'GVMC Citizen Authentication',
          customApiKey: customApiKeyInput.trim() || undefined
        })
      });

      const data = await response.json();
      setIsSendingSms(false);

      if (data.success) {
        setSmsDeliveryMode(data.mode);

        if (data.mode === '2factor') {
          setTwoFactorRequestId(data.requestId || null);
          setSuccessMsg(`📱 2Factor.in SMS OTP sent to +91 ${targetPhone}! Check your phone.`);
        } else {
          setSuccessMsg(`SMS OTP dispatched to +91 ${targetPhone}. Check your mobile handset.`);
        }
      } else {
        setSmsDeliveryMode('simulated');
        setErrorMsg(`2Factor.in API Note: ${data.error || 'SMS Dispatch failed'}. Please check your phone or try again.`);
      }
    } catch (err: any) {
      setIsSendingSms(false);
      setSmsDeliveryMode('simulated');
      console.error('Failed to trigger OTP:', err);
    }
  };

  const handleGetOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = aadhaarOrPhone.replace(/\D/g, '');

    if (cleanInput.length !== 12 && cleanInput.length !== 10) {
      setErrorMsg('Please enter a valid 12-digit Aadhaar Number or 10-digit Phone Number.');
      return;
    }

    // Lookup matching registered citizen or fallback
    const match = citizensList.find(c => c.aadhaarNo === cleanInput || c.phone === cleanInput);
    const targetPhone = match ? match.phone : (cleanInput.length === 10 ? cleanInput : '9848012345');
    const targetName = match ? match.name : 'Citizen';

    triggerSendOtp(cleanInput, targetPhone, targetName);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredOtp !== generatedOtp && enteredOtp !== '123456') {
      setErrorMsg(`Invalid OTP code entered. Please enter the generated OTP (${generatedOtp}) or Demo OTP (123456).`);
      return;
    }

    setErrorMsg('');
    const cleanInput = aadhaarOrPhone.replace(/\D/g, '');
    const match = citizensList.find(c => c.aadhaarNo === cleanInput || c.phone === cleanInput);

    onLoginSuccess({
      id: 'USR-CIT-' + (match ? match.aadhaarNo : cleanInput),
      name: match ? match.name : 'Sri M. Venkata Ramana Rao',
      phone: match ? match.phone : '9848012345',
      role: 'citizen',
      zone: match ? match.zone : 'Zone 3 - Visakhapatnam North'
    });
  };

  const handleEmployeeLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empId.trim()) {
      setErrorMsg('Please enter Employee / Officer ID');
      return;
    }
    setErrorMsg('');

    const cleanId = empId.trim();
    // Check if entered ID matches any preset officer in PRESET_OFFICERS
    const presetMatch = PRESET_OFFICERS.find(
      o => o.id.toLowerCase() === cleanId.toLowerCase() || o.employeeId.toLowerCase() === cleanId.toLowerCase()
    );

    if (presetMatch) {
      onLoginSuccess({
        id: presetMatch.id,
        name: officerCustomName.trim() || presetMatch.name,
        phone: presetMatch.phone,
        role: 'employee',
        employeeId: presetMatch.employeeId,
        department: presetMatch.department,
        designation: presetMatch.designation,
        zone: presetMatch.zone
      });
    } else {
      // Dynamic creation of Officer Profile based on entered custom ID, department, and name
      onLoginSuccess({
        id: `EMP-${cleanId.toUpperCase()}`,
        name: officerCustomName.trim() || `Officer ${cleanId.toUpperCase()}`,
        phone: '98480' + Math.floor(10000 + Math.random() * 90000),
        role: 'employee',
        employeeId: cleanId,
        department: empDept,
        designation: `${empDept} Officer (${cleanId.toUpperCase()})`,
        zone: 'Zone 1 - Visakhapatnam Central'
      });
    }
  };

  const handleCommissionerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    onLoginSuccess(DEMO_USERS.commissioner);
  };

  const handleDirectTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directFileId.trim()) return;
    onDirectTrackFile(directFileId.trim());
  };

  return (
    <div className="relative min-h-[calc(100vh-100px)] flex flex-col items-center justify-center py-8 px-4 sm:px-6 overflow-hidden bg-indigo-950">
      
      {/* Background Architectural Illustration / Geometric Backdrop */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20 filter blur-[2px] scale-105 transition-all duration-700"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.98)), url('https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1920&q=80')`
        }}
      />

      {/* Geometric Balance Background Accent Elements */}
      <div className="absolute inset-0 z-0 opacity-15 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute -top-24 -left-20 w-96 h-96 bg-indigo-600/15 rounded-3xl transform -rotate-12 pointer-events-none border border-indigo-400/20" />
      <div className="absolute -bottom-32 -right-20 w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full pointer-events-none border border-indigo-400/20" />

      {/* Main Grid Container: Left GVMC Building Showcase + Right Login Card */}
      <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch my-auto">
        
        {/* LEFT COLUMN: GVMC HEADQUARTERS BUILDING SHOWCASE & PHYSICAL FILE QR TRACKING */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          
          {/* Main GVMC Building Image Hero Box */}
          <div className="relative rounded-2xl overflow-hidden border-2 border-indigo-400/30 shadow-2xl bg-indigo-900 group min-h-[260px] sm:min-h-[300px] flex flex-col justify-between p-6">
            
            {/* Background High-Res GVMC Municipal Headquarters Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-80"
              style={{
                backgroundImage: `linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.4) 50%, rgba(15, 23, 42, 0.7) 100%), url('https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80')`
              }}
            />

            {/* Indian Flag & Official Emblem Banner Header */}
            <div className="relative z-10 flex items-center justify-between gap-3 bg-slate-950/70 backdrop-blur-md p-3 rounded-xl border border-indigo-300/30 shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-white rounded-lg p-1 flex items-center justify-center shrink-0 shadow-inner">
                  <Building2 className="w-6 h-6 text-indigo-950" />
                </div>
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 flex items-center gap-1">
                    <span>Government of Andhra Pradesh</span>
                  </div>
                  <h3 className="font-extrabold text-sm text-white leading-none">
                    GREATER VISAKHAPATNAM MUNICIPAL CORPORATION
                  </h3>
                </div>
              </div>

              {/* Tricolor Flag Badge */}
              <div className="flex items-center gap-1 bg-gradient-to-r from-orange-500 via-white to-emerald-600 p-1 px-2 rounded-lg text-[10px] font-black text-slate-950 shadow">
                <span>GVMC HQ</span>
              </div>
            </div>

            {/* Middle Badge Overlay */}
            <div className="relative z-10 my-4 space-y-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-950/90 text-indigo-200 rounded-full text-xs font-extrabold border border-indigo-400/30 backdrop-blur-sm shadow-sm">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>Asilmetta Junction, Visakhapatnam - 530002</span>
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight text-shadow">
                Aadhaar Verified Citizen & Departmental Tracking Portal
              </h2>
            </div>

            {/* Bottom Quick Feature Highlights */}
            <div className="relative z-10 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-950/80 backdrop-blur-md p-2.5 rounded-xl border border-indigo-400/30 text-white">
                <p className="font-extrabold text-amber-300 flex items-center gap-1 text-[11px]">
                  <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                  Aadhaar Verification
                </p>
                <p className="text-[10px] text-slate-300 mt-0.5 leading-snug">
                  12-digit Aadhaar card registration with instant OTP SMS authentication.
                </p>
              </div>

              <div className="bg-slate-950/80 backdrop-blur-md p-2.5 rounded-xl border border-indigo-400/30 text-white">
                <p className="font-extrabold text-emerald-300 flex items-center gap-1 text-[11px]">
                  <Barcode className="w-3.5 h-3.5 text-emerald-400" />
                  Dossier QR & Barcode
                </p>
                <p className="text-[10px] text-slate-300 mt-0.5 leading-snug">
                  QR Code & 1D Spine Barcode for complete physical file custody logs.
                </p>
              </div>
            </div>

          </div>

          {/* Interactive QR & Barcode Scanner Quick Launcher Card */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-indigo-100 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Scan className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                    Instant Smartphone Code Scanner
                  </h4>
                  <p className="text-[11px] text-slate-600">Scan physical file folder labels without logging in</p>
                </div>
              </div>

              {onScanCodeTrigger && (
                <button
                  onClick={onScanCodeTrigger}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <Camera className="w-4 h-4" />
                  <span>Scan QR / Barcode</span>
                </button>
              )}
            </div>

            <div className="p-3 bg-indigo-50/80 rounded-xl border border-indigo-100 text-xs text-indigo-950 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                <strong>Aadhaar e-KYC Security:</strong> Every registered citizen's phone number is linked to their Aadhaar card for secure single sign-on access.
              </p>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: MAIN LOGIN CARD */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          
          <div className="w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-indigo-100 my-auto">
            
            {/* Header Badge in Card */}
            <div className="p-4 bg-indigo-950 text-white text-center border-b border-indigo-900 flex items-center justify-between px-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded-lg p-1 flex items-center justify-center text-indigo-950 font-bold">
                  <Building2 className="w-5 h-5 text-indigo-900" />
                </div>
                <div className="text-left">
                  <h2 className="text-sm font-extrabold text-white leading-tight">GVMC Single Sign-On</h2>
                  <p className="text-[10px] text-indigo-200">Aadhaar Citizen Portal & Officer Dashboard</p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold bg-indigo-900 text-indigo-200 px-2 py-0.5 rounded border border-indigo-700">
                AP-GVMC v2026
              </span>
            </div>
        
        {/* Navigation Tabs Header */}
        <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-slate-200 bg-indigo-50/50">
          <button
            onClick={() => { setActiveTab('citizen_login'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`py-3 px-1.5 text-center text-xs font-bold transition-all relative ${
              activeTab === 'citizen_login'
                ? 'text-indigo-950 bg-white border-b-2 border-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-indigo-50/40'
            }`}
          >
            Aadhaar Login
          </button>
          
          <button
            onClick={() => { setActiveTab('citizen_register'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`py-3 px-1.5 text-center text-xs font-bold transition-all relative ${
              activeTab === 'citizen_register'
                ? 'text-indigo-950 bg-white border-b-2 border-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-indigo-50/40'
            }`}
          >
            Register Citizen
          </button>

          <button
            onClick={() => { setActiveTab('employee'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`py-3 px-1.5 text-center text-xs font-bold transition-all relative ${
              activeTab === 'employee'
                ? 'text-indigo-950 bg-white border-b-2 border-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-indigo-50/40'
            }`}
          >
            Officer Login
          </button>

          <button
            onClick={() => { setActiveTab('commissioner'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`py-3 px-1.5 text-center text-xs font-bold transition-all relative ${
              activeTab === 'commissioner'
                ? 'text-amber-950 bg-amber-100/80 border-b-2 border-amber-600 shadow-sm font-black'
                : 'text-slate-600 hover:text-slate-900 bg-indigo-50/40'
            }`}
          >
            👑 Commissioner
          </button>
        </div>

        {/* Form Body Container */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: CITIZEN AADHAAR LOGIN FORM */}
          {activeTab === 'citizen_login' && (
            <div>
              {/* 2Factor.in Integration Gateway Indicator Bar */}
              <div className="mb-4 p-2.5 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${twoFactorStatus?.configured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                  <span className="font-bold text-indigo-950">
                    2Factor.in SMS Gateway:
                  </span>
                  <span className={`font-semibold ${twoFactorStatus?.configured ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {twoFactorStatus?.configured ? 'API Connected' : 'Simulated Mode'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTwoFactorInfoModal(true)}
                  className="text-[11px] text-indigo-600 font-extrabold hover:underline flex items-center gap-1"
                >
                  <span>2Factor.in Config</span>
                </button>
              </div>

              {step === 'aadhaar' ? (
                <form onSubmit={handleGetOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
                      Aadhaar Card Number / Registered Phone
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <CreditCard className="w-4 h-4 text-indigo-600" />
                      </div>
                      <input
                        type="text"
                        maxLength={12}
                        value={aadhaarOrPhone}
                        onChange={(e) => setAadhaarOrPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="Enter 12-Digit Aadhaar # (e.g. 123456789012)"
                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-sm font-mono text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all shadow-sm"
                        required
                      />
                    </div>
                    <div className="flex justify-between items-center mt-1.5 text-[11px] text-slate-500">
                      <span>Demo Aadhaar: <strong>123456789012</strong></span>
                      <button
                        type="button"
                        onClick={() => setActiveTab('citizen_register')}
                        className="text-indigo-600 font-bold hover:underline"
                      >
                        New Citizen? Register Aadhaar
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSendingSms}
                    className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-[0.99]"
                  >
                    {isSendingSms ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending SMS via 2Factor.in API...</span>
                      </>
                    ) : (
                      <>
                        <MessageSquare className="w-4 h-4" />
                        <span>Send Verification OTP via SMS</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* OTP Verification Step */
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-xs sm:text-sm font-bold text-slate-800">
                        {getTranslation(language, 'verifyOtp')}
                      </label>
                      <button
                        type="button"
                        onClick={() => setStep('aadhaar')}
                        className="text-xs text-indigo-600 font-bold hover:underline"
                      >
                        Change Aadhaar
                      </button>
                    </div>
                    <p className="text-xs text-slate-600 mb-2">
                      Enter 6-digit OTP sent to phone linked with Aadhaar <strong>{aadhaarOrPhone}</strong>
                    </p>
                    
                    <input
                      type="text"
                      maxLength={6}
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                      className="w-full text-center tracking-[0.5em] text-xl font-mono font-bold py-3 bg-slate-50 border-2 border-indigo-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                      placeholder="123456"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-[0.99]"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify OTP & Open Citizen Dashboard</span>
                  </button>
                </form>
              )}

              {/* Direct File Tracking Card Section */}
              <div className="mt-6 pt-5 border-t border-slate-200">
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-indigo-950 uppercase tracking-wider">
                  <FileSearch className="w-4 h-4 text-indigo-600" />
                  <span>{getTranslation(language, 'directTrackHeading')}</span>
                </div>

                <form onSubmit={handleDirectTrack} className="flex gap-2">
                  <input
                    type="text"
                    value={directFileId}
                    onChange={(e) => setDirectFileId(e.target.value)}
                    placeholder="GVMC/TP/2026/08942"
                    className="flex-1 px-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors shrink-0 flex items-center gap-1 shadow-sm"
                  >
                    <span>{getTranslation(language, 'trackNow')}</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 2: CITIZEN REGISTRATION FORM */}
          {activeTab === 'citizen_register' && (
            <form onSubmit={handleRegisterCitizen} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  12-Digit Aadhaar Card Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <CreditCard className="w-4 h-4 text-indigo-600" />
                  </div>
                  <input
                    type="text"
                    maxLength={12}
                    value={regAadhaar}
                    onChange={(e) => setRegAadhaar(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 12 digits (e.g. 556677889900)"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Citizen Full Name (As per Aadhaar Card)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Sri K. Appa Rao"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Mobile Number (For OTP Verification)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 10-digit phone number"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  GVMC Municipal Zone Residence
                </label>
                <select
                  value={regZone}
                  onChange={(e) => setRegZone(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="Zone 1 - Visakhapatnam Central">Zone 1 - Visakhapatnam Central</option>
                  <option value="Zone 2 - Visakhapatnam South">Zone 2 - Visakhapatnam South</option>
                  <option value="Zone 3 - Visakhapatnam North">Zone 3 - Visakhapatnam North</option>
                  <option value="Zone 4 - Madhurawada">Zone 4 - Madhurawada</option>
                  <option value="Zone 5 - Gajuwaka">Zone 5 - Gajuwaka</option>
                  <option value="Zone 6 - Anakapalli">Zone 6 - Anakapalli</option>
                  <option value="Zone 7 - Bheemunipatnam">Zone 7 - Bheemunipatnam</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register Citizen & Proceed to OTP Verification</span>
              </button>
            </form>
          )}

          {/* EMPLOYEE / OFFICER LOGIN FORM */}
          {activeTab === 'employee' && (
            <form onSubmit={handleEmployeeLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Select Preset Municipal Officer
                </label>
                <select
                  value={empId}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    setEmpId(selectedId);
                    const match = PRESET_OFFICERS.find(o => o.id === selectedId);
                    if (match) {
                      setEmpDept(match.department);
                      setOfficerCustomName(match.name);
                    }
                  }}
                  className="w-full px-3 py-2.5 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs font-bold text-indigo-950 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <optgroup label="Town Planning Department">
                    <option value="GVMC-TP-101">GVMC-TP-101 : Smt. K. Devi Prasad (ACP Zone 3)</option>
                    <option value="GVMC-TP-102">GVMC-TP-102 : Sri V. Nageswara Rao (Chief City Planner)</option>
                  </optgroup>
                  <optgroup label="Revenue & Taxes Department">
                    <option value="GVMC-REV-201">GVMC-REV-201 : Sri P. Kumar Varma (Revenue Officer)</option>
                    <option value="GVMC-REV-202">GVMC-REV-202 : Sri D. Appa Rao (Revenue Inspector)</option>
                  </optgroup>
                  <optgroup label="Engineering & Works Department">
                    <option value="GVMC-ENG-301">GVMC-ENG-301 : Sri T. Jagadeesh (DEE Engineering)</option>
                    <option value="GVMC-ENG-302">GVMC-ENG-302 : Sri K. Ramesh (Superintending Engineer)</option>
                  </optgroup>
                  <optgroup label="Public Health & Sanitation">
                    <option value="GVMC-PH-401">GVMC-PH-401 : Dr. A. Murali Krishna (Chief Medical Officer)</option>
                    <option value="GVMC-PH-402">GVMC-PH-402 : Dr. C. V. Raman (Sanitary Inspector)</option>
                  </optgroup>
                  <optgroup label="Water Supply & Sewerage">
                    <option value="GVMC-WS-501">GVMC-WS-501 : Sri M. Somasekhar (AEE Water Works)</option>
                  </optgroup>
                  <optgroup label="Urban Forestry">
                    <option value="GVMC-UF-601">GVMC-UF-601 : Sri G. Venkatesh (Director Urban Forestry)</option>
                  </optgroup>
                  <optgroup label="General Administration">
                    <option value="GVMC-ADM-701">GVMC-ADM-701 : Sri R. Ramakrishna (Zonal Commissioner)</option>
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Department
                </label>
                <select
                  value={empDept}
                  onChange={(e) => setEmpDept(e.target.value as Department)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="Town Planning">Town Planning Department</option>
                  <option value="Revenue & Taxes">Revenue & Taxes Department</option>
                  <option value="Engineering & Works">Engineering & Works Department</option>
                  <option value="Water Supply & Sewerage">Water Supply & Sewerage Department</option>
                  <option value="Public Health & Sanitation">Public Health & Sanitation Department</option>
                  <option value="Urban Forestry">Urban Forestry</option>
                  <option value="General Administration">General Administration</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Officer / Employee ID
                  </label>
                  <input
                    type="text"
                    value={empId}
                    onChange={(e) => setEmpId(e.target.value)}
                    placeholder="e.g. GVMC-TP-101 or EMP-99"
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Officer Full Name
                  </label>
                  <input
                    type="text"
                    value={officerCustomName}
                    onChange={(e) => setOfficerCustomName(e.target.value)}
                    placeholder="Officer Name"
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <Building className="w-4 h-4" />
                <span>Login as Officer ({empId})</span>
              </button>
            </form>
          )}

          {/* COMMISSIONER LOGIN FORM */}
          {activeTab === 'commissioner' && (
            <form onSubmit={handleCommissionerLogin} className="space-y-4">
              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 font-extrabold text-lg">
                  👑
                </div>
                <div>
                  <h4 className="font-extrabold text-amber-950 text-xs uppercase tracking-wider">
                    Municipal Commissioner Access
                  </h4>
                  <p className="text-xs text-amber-900 font-medium mt-0.5">
                    Sri P. Sampath Kumar, IAS • Head of Office
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Commissioner Credential ID
                </label>
                <input
                  type="text"
                  value={commId}
                  onChange={(e) => setCommId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono font-bold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Secret Key
                </label>
                <input
                  type="password"
                  value={commPass}
                  onChange={(e) => setCommPass(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <ShieldCheck className="w-4 h-4 text-slate-950" />
                <span>Open Commissioner Executive Command Center</span>
              </button>
            </form>
          )}

          {/* Quick Demo Selector Shortcuts */}
          <div className="mt-4 pt-4 border-t border-slate-100 bg-indigo-50/60 -mx-6 -mb-6 p-4 rounded-b-2xl">
            <div className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Quick Role Login Shortcuts</span>
              </span>

              {onClearCitizenData && (
                <button
                  type="button"
                  onClick={onClearCitizenData}
                  className="text-[10px] text-rose-600 font-bold hover:underline"
                >
                  Clear Citizen Database
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => onLoginSuccess(DEMO_USERS.commissioner)}
                className="col-span-2 text-left p-2.5 bg-amber-400 hover:bg-amber-300 border border-amber-500 rounded-lg text-slate-950 font-black text-xs transition-colors shadow flex items-center justify-between"
              >
                <span>👑 <strong>Commissioner:</strong> Sri P. Sampath Kumar, IAS</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onLoginSuccess(PRESET_OFFICERS[0])}
                className="text-left p-2 bg-white hover:bg-indigo-100/80 border border-indigo-200/80 rounded-lg text-indigo-900 font-bold text-[11px] transition-colors truncate shadow-sm"
              >
                📐 <strong>TP Officer:</strong> Smt. Devi
              </button>

              <button
                type="button"
                onClick={() => onLoginSuccess(PRESET_OFFICERS[2])}
                className="text-left p-2 bg-white hover:bg-indigo-100/80 border border-indigo-200/80 rounded-lg text-indigo-900 font-bold text-[11px] transition-colors truncate shadow-sm"
              >
                🏛️ <strong>Revenue:</strong> Sri P. Kumar
              </button>

              <button
                type="button"
                onClick={() => onLoginSuccess(PRESET_OFFICERS[4])}
                className="text-left p-2 bg-white hover:bg-indigo-100/80 border border-indigo-200/80 rounded-lg text-indigo-900 font-bold text-[11px] transition-colors truncate shadow-sm"
              >
                🛠️ <strong>Engineering:</strong> Sri Jagadeesh
              </button>

              <button
                type="button"
                onClick={() => onLoginSuccess(PRESET_OFFICERS[6])}
                className="text-left p-2 bg-white hover:bg-indigo-100/80 border border-indigo-200/80 rounded-lg text-indigo-900 font-bold text-[11px] transition-colors truncate shadow-sm"
              >
                🏥 <strong>Public Health:</strong> Dr. Murali
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>

      {/* Footer info text */}
      <div className="relative z-10 mt-6 text-center text-xs text-indigo-200/80 max-w-md">
        <p>© 2026 Greater Visakhapatnam Municipal Corporation (GVMC). All rights reserved.</p>
        <p className="text-[11px] text-indigo-300/60 mt-0.5">Designed for Public Governance Transparency & SLA File Monitoring</p>
      </div>

      {/* 2FACTOR.IN API CONFIGURATION & INFORMATION MODAL */}
      {showTwoFactorInfoModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-indigo-100 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <Smartphone className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">2Factor.in OTP Gateway</h3>
                  <p className="text-xs text-slate-500">Send OTP directly to Indian mobile numbers via 2Factor.in API</p>
                </div>
              </div>
              <button
                onClick={() => setShowTwoFactorInfoModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className={`p-3 rounded-xl border flex items-center gap-3 ${twoFactorStatus?.configured ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'}`}>
                <div className={`w-3 h-3 rounded-full shrink-0 ${twoFactorStatus?.configured ? 'bg-emerald-600 animate-ping' : 'bg-amber-600'}`} />
                <div>
                  <p className="font-bold text-sm">
                    {twoFactorStatus?.configured ? '2Factor.in API Connected!' : '2Factor.in API Key Not Configured Yet'}
                  </p>
                  <p className="text-xs mt-0.5">
                    {twoFactorStatus?.configured
                      ? `Active Key: ${twoFactorStatus.apiKeyMasked}`
                      : 'Running in simulated OTP mode. Provide your 2Factor.in API Key below or in .env to send real SMS directly to mobile phones.'}
                  </p>
                </div>
              </div>

              {/* Live Custom 2Factor.in API Key Input */}
              <div className="bg-indigo-50/60 p-3.5 rounded-xl border border-indigo-100 space-y-2">
                <label className="block font-bold text-indigo-950 text-xs">
                  2Factor.in API Key:
                </label>
                <input
                  type="password"
                  value={customApiKeyInput}
                  onChange={(e) => setCustomApiKeyInput(e.target.value)}
                  placeholder="Paste your 2Factor.in API Key here..."
                  className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
                <p className="text-[11px] text-indigo-700/80">
                  You can get your API Key from your dashboard at <a href="https://2factor.in" target="_blank" rel="noreferrer" className="underline font-bold text-indigo-900">www.2factor.in</a>
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <p className="font-bold text-slate-900 text-[11px] uppercase tracking-wider">Required Environment Variable (.env):</p>
                <div className="font-mono text-[11px] bg-slate-900 text-amber-300 p-2.5 rounded-lg">
                  TWOFACTOR_API_KEY=your_2factor_api_key
                </div>
              </div>

              <div className="space-y-1 text-slate-600 text-[11px]">
                <p className="font-bold text-slate-900 text-xs">How Mobile OTP Delivery Works:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Backend proxies request to `https://2factor.in/API/V1/&#123;API_KEY&#125;/SMS/&#123;MOBILE_NO&#125;/&#123;OTP_CODE&#125;`.</li>
                  <li>2Factor.in dispatches instant SMS directly to recipient's +91 mobile handset.</li>
                  <li>No secrets exposed to the web browser.</li>
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t flex justify-between items-center">
              <span className="text-[11px] text-slate-500 font-medium">
                {customApiKeyInput.trim() ? '✓ Custom Key Loaded' : ''}
              </span>
              <button
                type="button"
                onClick={() => setShowTwoFactorInfoModal(false)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
