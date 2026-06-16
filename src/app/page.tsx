'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Sparkles, BookOpen, GraduationCap, AlertCircle, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import UploadArea from '@/components/UploadArea';
import LoadingState from '@/components/LoadingState';
import ResultSection from '@/components/ResultSection';
import EmptyState from '@/components/EmptyState';
import { AnalysisResult, AnalysisResponse } from '@/types/analysis';

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isMocked, setIsMocked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync theme state on mount
  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
    } else {
      setDarkMode(false);
    }
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDarkMode(true);
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setError(null);
    setResult(null);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setResult(null);
    setError(null);
  };

  // Convert file to Base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
    });
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const base64Image = await convertToBase64(selectedFile);
      
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
          mimeType: selectedFile.type,
          fileName: selectedFile.name,
        }),
      });

      const data: AnalysisResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Terjadi kesalahan saat menganalisis diagram.');
      }

      if (data.data) {
        setResult(data.data);
        setIsMocked(!!data.isMocked);
      } else {
        throw new Error('Data analisis kosong atau tidak valid.');
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || 'Gagal memproses analisis diagram.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const triggerScrollToUpload = () => {
    const uploadElement = document.getElementById('upload-section');
    if (uploadElement) {
      uploadElement.scrollIntoView({ behavior: 'smooth' });
      // focus
      setTimeout(() => {
        uploadElement.focus();
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 relative overflow-hidden font-sans pb-20">
      
      {/* Decorative Orbs */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.015] pointer-events-none"></div>
      <div className="absolute top-[-15%] left-[-15%] w-[60vw] h-[60vw] rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-[140px] pointer-events-none animate-float"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-500/10 dark:bg-purple-500/3 blur-[140px] pointer-events-none animate-float" style={{ animationDelay: '2s' }}></div>

      {/* Header bar */}
      <header className="sticky top-0 z-40 w-full bg-white/70 dark:bg-slate-950/70 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-900/50 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-indigo-600 to-violet-600 text-white rounded-xl shadow-md shadow-indigo-600/15">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-lg font-black tracking-tight bg-gradient-to-r from-slate-900 to-indigo-900 dark:from-white dark:to-indigo-200 bg-clip-text text-transparent">
              EduVision AI
            </span>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 bg-slate-100 dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800 rounded-xl transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 md:pt-16 relative z-10">
        
        <AnimatePresence mode="wait">
          {/* State 1: Loading skeleton screen */}
          {isAnalyzing ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-900 rounded-3xl p-6 md:p-10 shadow-xl shadow-slate-200/30 dark:shadow-none"
            >
              <LoadingState />
            </motion.div>
          ) : result ? (
            /* State 2: Result presentation details */
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200/60 dark:border-slate-900">
                <div>
                  <button
                    onClick={handleClear}
                    className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors uppercase tracking-wider mb-2"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Kembali ke Beranda</span>
                  </button>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white leading-tight">
                    Hasil Analisis Diagram Anda
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left image column */}
                <div className="lg:sticky lg:top-24 space-y-4">
                  <div className="overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
                    <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2.5">
                      <BookOpen className="w-4 h-4 text-indigo-500" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                        {selectedFile?.name}
                      </span>
                    </div>
                    <div className="p-4 flex items-center justify-center bg-slate-50/50 dark:bg-slate-950/40">
                      <img
                        src={URL.createObjectURL(selectedFile!)}
                        alt="Analyzed Diagram"
                        className="object-contain max-h-[280px] rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-800"
                      />
                    </div>
                  </div>
                  
                  <button
                    onClick={handleClear}
                    className="w-full px-5 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl transition-all duration-200 shadow-sm"
                  >
                    Analisis Gambar Baru
                  </button>
                </div>

                {/* Right analysis cards column */}
                <div className="lg:col-span-2">
                  <ResultSection result={result} isMocked={isMocked} onNewQuiz={handleClear} />
                </div>
              </div>
            </motion.div>
          ) : (
            /* State 3: Empty layout dashboard */
            <motion.div
              key="main-dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-16"
            >
              {/* Hero Banner Intro */}
              <div className="text-center max-w-3xl mx-auto animate-fade-in">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-5 border border-indigo-100 dark:border-indigo-900/40">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Teknologi Edukasi Cerdas</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-800 dark:text-white tracking-tight leading-none mb-4">
                  Visualisasikan Diagram,
                  <span className="block text-indigo-600 dark:text-indigo-400 mt-2 bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                    Akselerasi Pembelajaran.
                  </span>
                </h1>
                
                <p className="text-sm sm:text-base md:text-lg text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
                  EduVision AI menggunakan kekuatan visi Gemini 2.5 Flash untuk membaca diagram pembelajaran, mengekstrak relasi database, membedah diagram kelas UML, dan menyusun kuis evaluasi pemahaman secara otomatis.
                </p>
              </div>

              {/* Upload Card Panel */}
              <div
                id="upload-section"
                tabIndex={-1}
                className="max-w-2xl mx-auto focus:outline-none"
              >
                <UploadArea
                  onFileSelect={handleFileSelect}
                  selectedFile={selectedFile}
                  onClear={handleClear}
                  isAnalyzing={isAnalyzing}
                  onAnalyze={handleAnalyze}
                  error={error}
                />
              </div>

              {/* Empty state illustration and descriptions */}
              <EmptyState onTriggerUpload={triggerScrollToUpload} />
            </motion.div>
          )}
        </AnimatePresence>



      </main>
    </div>
  );
}
