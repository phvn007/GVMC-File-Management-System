/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { LoginScreen } from './components/LoginScreen';
import { CitizenDashboard } from './components/CitizenDashboard';
import { EmployeeDashboard } from './components/EmployeeDashboard';
import { CommissionerDashboard } from './components/CommissionerDashboard';
import { FileDetailModal } from './components/FileDetailModal';
import { NewApplicationModal } from './components/NewApplicationModal';
import { ScanCodeModal } from './components/ScanCodeModal';
import { Footer } from './components/Footer';
import { Language, UserProfile, GVMCFile } from './types';
import { MOCK_FILES } from './data/mockFiles';

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [files, setFiles] = useState<GVMCFile[]>(MOCK_FILES);
  const [selectedFile, setSelectedFile] = useState<GVMCFile | null>(null);
  const [isNewAppModalOpen, setIsNewAppModalOpen] = useState(false);
  const [isScanCodeModalOpen, setIsScanCodeModalOpen] = useState(false);
  const [searchNotificationMsg, setSearchNotificationMsg] = useState<string | null>(null);

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedFile(null);
  };

  const handleDirectTrackFile = (fileId: string) => {
    const matched = files.find(
      f => f.id.toLowerCase() === fileId.toLowerCase() || f.id.toLowerCase().includes(fileId.toLowerCase())
    );

    if (matched) {
      setSelectedFile(matched);
      setSearchNotificationMsg(null);
    } else {
      setSearchNotificationMsg(`No municipal file found matching '${fileId}'. Please verify your application ID.`);
      setTimeout(() => setSearchNotificationMsg(null), 5000);
    }
  };

  const handleUpdateFile = (updatedFile: GVMCFile) => {
    setFiles(prev => prev.map(f => f.id === updatedFile.id ? updatedFile : f));
    setSelectedFile(updatedFile);
  };

  const handleCreateNewFile = (newFile: GVMCFile) => {
    setFiles(prev => [newFile, ...prev]);
    setSelectedFile(newFile);
  };

  const handleClearCitizenData = () => {
    try {
      localStorage.removeItem('gvmc_registered_citizens');
      alert('✅ Citizen database successfully cleared! All registered Aadhaar credentials have been wiped from local storage.');
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetFilesData = () => {
    if (window.confirm('Are you sure you want to clear all current application files? You will be able to create new real files from scratch.')) {
      setFiles([]);
      setSelectedFile(null);
      alert('✅ File registry cleared! You can now create real files and track/approve them.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f5f7] text-[#091c35] font-['Public_Sans',sans-serif]">
      
      {/* Top Municipal Navigation Header */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        currentUser={currentUser}
        onLogout={handleLogout}
        onScanCodeTrigger={() => setIsScanCodeModalOpen(true)}
        onDirectSearchTrigger={() => {
          const promptId = prompt('Enter File / Application Number (e.g. GVMC/TP/2026/08942):', 'GVMC/TP/2026/08942');
          if (promptId) handleDirectTrackFile(promptId);
        }}
        
      />

      {/* Direct Search Notification Message Toast */}
      {searchNotificationMsg && (
        <div className="bg-indigo-900 text-white font-bold text-center py-2.5 px-4 text-xs shadow-md border-b border-indigo-700 flex items-center justify-center gap-2">
          <span>⚠️ {searchNotificationMsg}</span>
        </div>
      )}

      {/* Main View Router */}
      <main className="flex-1">
        {!currentUser ? (
          /* INITIAL SCREEN: Login - GVMC Portal */
          <LoginScreen
            language={language}
            onLoginSuccess={handleLoginSuccess}
            onDirectTrackFile={handleDirectTrackFile}
            onScanCodeTrigger={() => setIsScanCodeModalOpen(true)}
            onClearCitizenData={handleClearCitizenData}
          />
        ) : currentUser.role === 'commissioner' ? (
          /* MUNICIPAL COMMISSIONER EXECUTIVE DASHBOARD */
          <CommissionerDashboard
            files={files}
            language={language}
            user={currentUser}
            onSelectFile={(f) => setSelectedFile(f)}
            onUpdateFile={handleUpdateFile}
            onClearCitizenData={handleClearCitizenData}
            onResetFilesData={handleResetFilesData}
          />
        ) : currentUser.role === 'citizen' ? (
          /* CITIZEN PORTAL DASHBOARD */
          <CitizenDashboard
            language={language}
            user={currentUser}
            files={files}
            onSelectFile={(f) => setSelectedFile(f)}
            onOpenNewApplicationModal={() => setIsNewAppModalOpen(true)}
          />
        ) : (
          /* EMPLOYEE / DEPARTMENTAL PORTAL DASHBOARD */
          <EmployeeDashboard
            language={language}
            user={currentUser}
            files={files}
            onSelectFile={(f) => setSelectedFile(f)}
            onUpdateFile={handleUpdateFile}
          />
        )}
      </main>

      {/* FILE DOSSIER / MOVEMENT TIMELINE MODAL */}
      {selectedFile && (
        <FileDetailModal
          language={language}
          file={selectedFile}
          currentUser={currentUser}
          onClose={() => setSelectedFile(null)}
          onUpdateFile={handleUpdateFile}
        />
      )}

      {/* NEW APPLICATION FORM MODAL (CITIZEN) */}
      {isNewAppModalOpen && currentUser && (
        <NewApplicationModal
          language={language}
          currentUser={currentUser}
          onClose={() => setIsNewAppModalOpen(false)}
          onSubmitNewFile={handleCreateNewFile}
        />
      )}

      {/* QR CODE & SPINE BARCODE SCANNER MODAL */}
      {isScanCodeModalOpen && (
        <ScanCodeModal
          files={files}
          currentUser={currentUser}
          onClose={() => setIsScanCodeModalOpen(false)}
          onUpdateFile={handleUpdateFile}
          onSelectFile={(f) => setSelectedFile(f)}
        />
      )}

      {/* Footer */}
      <Footer language={language} />

    </div>
  );
}
