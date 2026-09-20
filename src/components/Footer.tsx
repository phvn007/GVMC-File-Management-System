import React from 'react';
import { Building2, Phone, Mail, Globe, Shield, MapPin, ExternalLink } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../translations';

interface FooterProps {
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
  return (
    <footer className="bg-indigo-950 text-white border-t-4 border-indigo-600 mt-16 relative overflow-hidden">
      {/* Background Geometric Grid Accent */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs sm:text-sm relative z-10">
        
        {/* Col 1: Brand */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-white rounded-xl p-1 flex items-center justify-center shrink-0 shadow-md">
              <Building2 className="w-6 h-6 text-indigo-900" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base leading-tight">
                {getTranslation(language, 'portalName')}
              </h3>
              <p className="text-[11px] text-indigo-300 font-semibold uppercase tracking-wider">
                GVMC Municipal Portal
              </p>
            </div>
          </div>
          <p className="text-xs text-indigo-200/90 leading-relaxed pt-1">
            Official Municipal File Management & Approval Tracking System for Greater Visakhapatnam Municipal Corporation.
          </p>
        </div>

        {/* Col 2: Key Municipal Services */}
        <div className="space-y-2">
          <h4 className="font-extrabold text-white text-sm uppercase tracking-wider text-indigo-300">
            Municipal Services
          </h4>
          <ul className="space-y-1.5 text-xs text-indigo-200 font-medium">
            <li className="hover:text-white cursor-pointer transition-colors flex items-center gap-1">
              <span>• Town Planning & AP-DPMS Permissions</span>
            </li>
            <li className="hover:text-white cursor-pointer transition-colors flex items-center gap-1">
              <span>• Property Tax Mutation & Assessment</span>
            </li>
            <li className="hover:text-white cursor-pointer transition-colors flex items-center gap-1">
              <span>• Commercial Water Line Tapping</span>
            </li>
            <li className="hover:text-white cursor-pointer transition-colors flex items-center gap-1">
              <span>• GVMC Trade License Renewal</span>
            </li>
            <li className="hover:text-white cursor-pointer transition-colors flex items-center gap-1">
              <span>• Spandana Public Grievances</span>
            </li>
          </ul>
        </div>

        {/* Col 3: Zonal Head Offices */}
        <div className="space-y-2">
          <h4 className="font-extrabold text-white text-sm uppercase tracking-wider text-indigo-300">
            Zonal Administrative Offices
          </h4>
          <ul className="space-y-1.5 text-xs text-indigo-200">
            <li className="flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
              <span>GVMC Head Office, Tenneti Bhavan, Asilmetta Junction, Visakhapatnam - 530002</span>
            </li>
            <li className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Toll Free Call Center: 1800-425-0001</span>
            </li>
            <li className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>commissioner_gvmc@ap.gov.in</span>
            </li>
          </ul>
        </div>

        {/* Col 4: Right to Information */}
        <div className="space-y-2">
          <h4 className="font-extrabold text-white text-sm uppercase tracking-wider text-indigo-300">
            Transparency & SLA
          </h4>
          <div className="p-3.5 bg-indigo-900/60 rounded-xl border border-indigo-700/50 text-xs text-indigo-100 space-y-1.5 shadow-inner">
            <div className="flex items-center gap-1.5 font-bold text-amber-300">
              <Shield className="w-4 h-4" />
              <span>AP Public Service Delivery Guarantee</span>
            </div>
            <p className="text-[11px] leading-relaxed text-indigo-200">
              Files are tracked under automated SLA monitoring. Unresolved files are escalated to the Commissioner office automatically upon SLA expiry.
            </p>
          </div>
        </div>

      </div>

      <div className="bg-indigo-950/90 py-4 text-center text-xs text-indigo-300/80 border-t border-indigo-900/80 relative z-10">
        <p>© 2026 Greater Visakhapatnam Municipal Corporation. Content owned and maintained by GVMC IT Cell.</p>
      </div>
    </footer>
  );
};
