'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image as ImageIcon, X, AlertCircle, Sparkles } from 'lucide-react';

interface UploadAreaProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
  isAnalyzing: boolean;
  onAnalyze: () => void;
  error?: string | null;
}

export default function UploadArea({
  onFileSelect,
  selectedFile,
  onClear,
  isAnalyzing,
  onAnalyze,
  error: propError,
}: UploadAreaProps) {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    // Clean up
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  // Clipboard Paste Listener
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (isAnalyzing || selectedFile) return;
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            validateAndSelectFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isAnalyzing, selectedFile]);

  const validateAndSelectFile = (file: File) => {
    setError(null);
    
    if (!file.type.startsWith('image/')) {
      setError('Format berkas harus berupa gambar (PNG, JPG, WebP, dll.)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran gambar terlalu besar. Maksimum batas ukuran adalah 5MB.');
      return;
    }

    onFileSelect(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSelectFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSelectFile(e.target.files[0]);
    }
  };

  const triggerInput = () => {
    if (isAnalyzing) return;
    fileInputRef.current?.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      triggerInput();
    }
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!previewUrl || !selectedFile ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={triggerInput}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="button"
            aria-label="Upload educational diagram image"
            aria-disabled={isAnalyzing}
            className={`relative flex flex-col items-center justify-center min-h-[320px] p-8 border-2 border-dashed rounded-3xl cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none transition-all duration-300 group ${
              dragActive
                ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/15 scale-[1.01] shadow-xl shadow-indigo-500/10'
                : 'border-slate-300 dark:border-slate-800 bg-white hover:bg-slate-50/50 dark:bg-slate-900/60 dark:hover:bg-slate-900 hover:border-slate-400 dark:hover:border-slate-700 shadow-sm'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleChange}
              disabled={isAnalyzing}
            />

            {/* Grid Pattern Background */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none rounded-3xl"></div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="p-4 mb-5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors duration-300 group-hover:bg-indigo-50 group-hover:text-indigo-600 dark:group-hover:bg-indigo-950/40 dark:group-hover:text-indigo-400 shadow-sm"
              >
                <Upload className="w-8 h-8" />
              </motion.div>
              
              <h3 className="mb-2 text-lg font-bold text-slate-800 dark:text-white">
                Unggah Diagram Edukasi
              </h3>
              
              <p className="max-w-md mb-5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Tarik & lepas berkas ke sini, klik untuk menjelajahi komputer, atau cukup lakukan <span className="font-semibold text-indigo-500 dark:text-indigo-400">Paste (Ctrl+V)</span> langsung dari clipboard Anda.
              </p>

              <div className="flex flex-wrap justify-center gap-2 max-w-lg mt-2">
                {['Flowchart', 'UML Class', 'ERD Schema', 'Network Topology', 'Process Map', 'Chart/Graph'].map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 text-xs font-semibold rounded-xl bg-slate-100/80 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/50 dark:border-slate-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className="mt-5 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                Mendukung PNG, JPG, WebP hingga batas 5MB.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center w-full"
          >
            <div className="relative w-full max-w-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl shadow-slate-200/40 dark:shadow-none transition-all duration-300">
              {/* Preview Header */}
              <div className="flex items-center justify-between px-5 py-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-200">
                  <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-bold truncate max-w-xs md:max-w-md">
                      {selectedFile?.name}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                      {selectedFile ? (selectedFile.size / (1024 * 1024)).toFixed(2) : '0.00'} MB
                    </span>
                  </div>
                </div>
                <button
                  onClick={onClear}
                  disabled={isAnalyzing}
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                  aria-label="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Preview Image Frame */}
              <div className="flex justify-center p-6 bg-slate-50/50 dark:bg-slate-950/40 min-h-[220px] max-h-[420px] overflow-y-auto">
                <img
                  src={previewUrl}
                  alt="Diagram Preview"
                  className="object-contain max-h-[360px] rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-800"
                />
              </div>

              {/* Error Alert inside Preview Card */}
              {propError && (
                <div className="mx-6 mb-4 p-4 text-sm rounded-2xl text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 flex items-start gap-2.5 shadow-sm">
                  <AlertCircle className="w-4.5 h-4.5 text-rose-600 dark:text-rose-500 shrink-0 mt-0.5" />
                  <div className="text-left">
                    <span className="font-bold">Analisis gagal:</span> {propError}
                  </div>
                </div>
              )}

              {/* Actions Footer */}
              <div className="p-5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-3 justify-end items-center">
                <button
                  onClick={onClear}
                  disabled={isAnalyzing}
                  className="w-full sm:w-auto px-5 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 disabled:opacity-50"
                >
                  Ganti Gambar
                </button>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={onAnalyze}
                  disabled={isAnalyzing}
                  className="w-full sm:w-auto px-6 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all duration-200 shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Analisis Gambar</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2.5 mt-4 p-4 text-sm rounded-2xl text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 shadow-sm"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}
    </div>
  );
}
