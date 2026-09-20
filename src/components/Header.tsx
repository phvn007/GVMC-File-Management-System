import React from 'react';
import { Building2, Languages, LogOut, Phone, ShieldCheck, UserCheck, Search, QrCode, Barcode } from 'lucide-react';
import { Language, UserProfile } from '../types';
import { getTranslation } from '../translations';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  currentUser: UserProfile | null;
  onLogout: () => void;
  onDirectSearchTrigger?: () => void;
  onScanCodeTrigger?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  currentUser,
  onLogout,
  onDirectSearchTrigger,
  onScanCodeTrigger
}) => {
  return (
    <header className="bg-indigo-950 text-white shadow-lg border-b border-indigo-800/80 sticky top-0 z-40 relative overflow-hidden">
      {/* Decorative Geometric Grid Overlay */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      {/* Top Utility Bar */}
      <div className="bg-indigo-900/90 text-xs py-1.5 px-4 sm:px-8 border-b border-indigo-800/60 relative z-10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4 text-indigo-200 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Government of Andhra Pradesh • Municipal Portal
            </span>
            <span className="hidden md:inline-block text-indigo-400/40">|</span>
            <span className="hidden md:flex items-center gap-1.5 text-amber-300">
              <Phone className="w-3 h-3" />
              Toll Free Helpline: <strong className="text-white">1800-425-0001</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Scan QR / Barcode Button */}
            {onScanCodeTrigger && (
              <button
                onClick={onScanCodeTrigger}
                className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 px-2.5 py-1 rounded-lg text-xs font-bold text-white transition-all shadow-sm active:scale-95"
                title="Scan Physical File Folder Cover QR or Spine Barcode"
              >
                <QrCode className="w-3.5 h-3.5 text-white" />
                <span>Scan QR / Barcode</span>
              </button>
            )}

            {/* Direct search trigger shortcut if logged in */}
            {currentUser && onDirectSearchTrigger && (
              <button
                onClick={onDirectSearchTrigger}
                className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 px-2.5 py-1 rounded-lg text-xs font-bold text-white transition-all shadow-sm"
                title="Search any file ID"
              >
                <Search className="w-3 h-3" />
                <span>Track File ID</span>
              </button>
            )}

            {/* Language Switcher */}
            <button
              onClick={() => onLanguageChange(language === 'en' ? 'te' : 'en')}
              className="flex items-center gap-1.5 bg-indigo-900/80 hover:bg-indigo-800/90 px-2.5 py-1 rounded-lg text-xs font-bold text-white transition-all border border-indigo-700/80 active:scale-95 shadow-sm"
              title="Toggle Language / భాషను మార్చండి"
            >
              <Languages className="w-3.5 h-3.5 text-indigo-300" />
              <span>{getTranslation(language, 'switchLanguage')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Brand */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3.5">
          {/* Geometric Emblem Logo */}
          <div className="w-11 h-11 bg-white rounded-xl p-1.5 flex items-center justify-center shadow-lg border border-indigo-200 shrink-0 transform hover:rotate-3 transition-transform">
            <div className="w-full h-full rounded-lg bg-indigo-900 flex flex-col items-center justify-center text-white font-bold leading-none">
              <Building2 className="w-6 h-6 text-indigo-200" />
            </div>
          </div>

          <div>
            <h1 className="text-xl sm:text-22px font-extrabold tracking-tight text-white leading-tight">
              {getTranslation(language, 'portalName')}
            </h1>
            <p className="text-xs sm:text-13px text-indigo-200 font-medium tracking-wide uppercase">
              {getTranslation(language, 'govName')}
            </p>
          </div>
        </div>

        {/* User Status Bar if logged in */}
        {currentUser ? (
          <div className="flex items-center gap-3 bg-indigo-900/60 border border-indigo-700/60 rounded-xl p-1.5 pl-3 shadow-md backdrop-blur-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/50 text-white flex items-center justify-center font-bold text-xs border border-indigo-400/40 shadow-inner">
                {(currentUser.name || 'U').charAt(0)}
              </div>
              <div className="text-left text-xs">
                <div className="font-bold text-white flex items-center gap-1.5">
                  {currentUser.name}
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.2 rounded font-semibold border border-emerald-500/40 uppercase">
                    {currentUser.role}
                  </span>
                </div>
                <div className="text-indigo-200 text-[11px]">
                  {currentUser.role === 'employee'
                    ? `${currentUser.designation || 'Officer'} • ${currentUser.department || 'GVMC'}`
                    : currentUser.role === 'commissioner'
                    ? `${currentUser.designation || 'Municipal Commissioner'} • Executive`
                    : `${currentUser.phone || ''} • ${currentUser.zone || 'Visakhapatnam'}`}
                </div>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="ml-2 bg-rose-600/90 hover:bg-rose-600 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all shadow-sm active:scale-95"
              title={getTranslation(language, 'logout')}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{getTranslation(language, 'logout')}</span>
            </button>
          </div>
        ) : (
          <div className="text-xs text-indigo-200 hidden sm:flex items-center gap-2 bg-indigo-900/60 px-3.5 py-1.5 rounded-xl border border-indigo-700/60 shadow-sm">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>Official GVMC Public Service Portal</span>
          </div>
        )}
      </div>
    </header>
  );
};
