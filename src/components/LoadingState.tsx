'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Brain, Cpu, Layers, ClipboardCheck } from 'lucide-react';

const LOADING_PHASES = [
  { text: 'Membaca data biner gambar...', icon: Brain, progress: 20 },
  { text: 'Mengidentifikasi jenis diagram...', icon: Cpu, progress: 45 },
  { text: 'Memetakan komponen dan relasi...', icon: Layers, progress: 70 },
  { text: 'Merumuskan ringkasan & kuis interaktif...', icon: ClipboardCheck, progress: 95 },
];

export default function LoadingState() {
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(0);

  // Cycle phases
  useEffect(() => {
    const phaseInterval = setInterval(() => {
      setPhase((prev) => {
        if (prev < LOADING_PHASES.length - 1) return prev + 1;
        return prev;
      });
    }, 2800);

    return () => clearInterval(phaseInterval);
  }, []);

  // Smooth progress count-up
  useEffect(() => {
    const targetProgress = LOADING_PHASES[phase].progress;
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < targetProgress) return prev + 1;
        if (prev > targetProgress) return prev - 1;
        return prev;
      });
    }, 25);

    return () => clearInterval(progressInterval);
  }, [phase]);

  const CurrentIcon = LOADING_PHASES[phase].icon;

  return (
    <div className="w-full max-w-4xl mx-auto py-6 space-y-10">
      
      {/* Top Progress Dashboard */}
      <div className="flex flex-col items-center text-center max-w-md mx-auto px-4">
        {/* Pulsing Core Badge */}
        <div className="relative flex items-center justify-center w-20 h-20 mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-850"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 border-r-indigo-400 dark:border-t-indigo-500 dark:border-r-indigo-400 animate-spin"></div>
          
          <motion.div
            key={phase}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative z-10 flex items-center justify-center w-14 h-14 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400"
          >
            <CurrentIcon className="w-6 h-6" />
          </motion.div>
          <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-amber-400 animate-bounce" />
        </div>

        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
          EduVision AI Berpikir
        </h3>
        
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5 min-h-[40px] font-medium">
          {LOADING_PHASES[phase].text}
        </p>

        {/* Progress Bar Container */}
        <div className="w-full bg-slate-200 dark:bg-slate-850 h-2.5 rounded-full overflow-hidden mb-1 border border-slate-250/20 dark:border-slate-800">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-650 rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut' }}
          ></motion.div>
        </div>
        <span className="text-xs font-bold text-slate-400 dark:text-slate-550">
          {progress}% Selesai
        </span>
      </div>

      {/* Grid of Skeleton placeholders simulating the results layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-40 select-none pointer-events-none">
        
        {/* Skeleton Card 1 (Main Header Box) */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse"></div>
            <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-850 rounded animate-pulse"></div>
          </div>
          <div className="space-y-2 pt-2">
            <div className="h-3.5 w-full bg-slate-150 dark:bg-slate-800 rounded animate-pulse"></div>
            <div className="h-3.5 w-5/6 bg-slate-150 dark:bg-slate-800 rounded animate-pulse"></div>
            <div className="h-3.5 w-2/3 bg-slate-150 dark:bg-slate-800 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Skeleton Card 2 (Quick Summary Box) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse"></div>
            <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-850 rounded animate-pulse"></div>
          </div>
          <div className="space-y-2 pt-2">
            <div className="h-3 w-full bg-slate-150 dark:bg-slate-800 rounded animate-pulse"></div>
            <div className="h-3 w-4/5 bg-slate-150 dark:bg-slate-800 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Skeleton Card 3 (Wide Components Box) */}
        <div className="md:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse"></div>
            <div className="h-4 w-1/4 bg-slate-200 dark:bg-slate-850 rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="h-10 bg-slate-100 dark:bg-slate-850 rounded-xl animate-pulse"></div>
            <div className="h-10 bg-slate-100 dark:bg-slate-850 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>

    </div>
  );
}
