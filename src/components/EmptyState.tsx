'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Cpu, Award, ArrowRight } from 'lucide-react';

interface EmptyStateProps {
  onTriggerUpload: () => void;
}

export default function EmptyState({ onTriggerUpload }: EmptyStateProps) {
  const steps = [
    {
      icon: Upload,
      title: '1. Unggah Diagram',
      description: 'Seret gambar diagram atau gunakan clipboard paste (Ctrl+V) langsung ke area unggah.',
      color: 'bg-blue-50 dark:bg-blue-950/45 text-blue-600 dark:text-blue-400',
    },
    {
      icon: Cpu,
      title: '2. Pemrosesan AI',
      description: 'Model Gemini 2.5 Flash membaca gambar, memetakan relasi, dan memformulasikan ulasan.',
      color: 'bg-indigo-50 dark:bg-indigo-950/45 text-indigo-600 dark:text-indigo-400',
    },
    {
      icon: Award,
      title: '3. Evaluasi & Latihan',
      description: 'Pelajari penjelasan rinci dan uji pemahaman Anda dengan 5 kuis interaktif ber-skor.',
      color: 'bg-emerald-50 dark:bg-emerald-950/45 text-emerald-600 dark:text-emerald-400',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full flex flex-col items-center text-center max-w-4xl mx-auto"
    >
      {/* Decorative Floating Illustration */}
      <div className="relative w-full max-w-[280px] h-[180px] mb-8 flex items-center justify-center">
        {/* Background glow orb */}
        <div className="absolute w-44 h-44 rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl"></div>

        {/* Animated Stacked Visual Cards */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-40 h-28 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none flex items-center justify-center p-4 -rotate-6 translate-x-[-45px] translate-y-[-10px] z-10"
        >
          {/* Flowchart Mock Shape */}
          <div className="w-full space-y-2">
            <div className="h-3 w-1/2 bg-blue-150 dark:bg-blue-950 rounded"></div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded"></div>
            <div className="h-2 w-3/4 bg-slate-100 dark:bg-slate-800 rounded"></div>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute w-40 h-28 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none flex items-center justify-center p-4 rotate-6 translate-x-[45px] translate-y-[15px] z-20"
        >
          {/* Pie Chart Mock Shape */}
          <div className="w-full flex gap-3 items-center">
            <div className="w-10 h-10 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin-slow"></div>
            <div className="flex-1 space-y-2">
              <div className="h-3 w-3/4 bg-indigo-150 dark:bg-indigo-950 rounded"></div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded"></div>
            </div>
          </div>
        </motion.div>

        {/* Main Center Floating Card */}
        <motion.div
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-44 h-32 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl shadow-2xl shadow-indigo-500/20 flex flex-col justify-between p-4 text-white z-30"
        >
          <div className="flex justify-between items-start">
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-sm">
              <Cpu className="w-5 h-5 text-indigo-200" />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-200">
              Multimodal AI
            </span>
          </div>
          <div className="text-left">
            <div className="text-xs font-bold mb-0.5">EduVision Engine</div>
            <div className="text-[9px] text-white/80">Menganalisis pola diagram visual...</div>
          </div>
        </motion.div>
      </div>

      <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-850 dark:text-white mb-3 leading-tight">
        Bagaimana Cara Kerja Aplikasi?
      </h2>
      
      <p className="max-w-xl text-slate-500 dark:text-slate-400 text-sm md:text-base mb-10 leading-relaxed">
        EduVision AI membantu mendalami isi diagram apa pun secara instan. Unggah diagram Anda, ikuti metode tiga langkah mudah di bawah ini.
      </p>

      {/* Step by Step Timeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-10 text-left">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.15, ease: 'easeOut' }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className={`inline-flex items-center justify-center p-3 rounded-2xl mb-4 ${step.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2">
                  {step.title}
                </h3>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* CTA Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onTriggerUpload}
        className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-indigo-650 hover:bg-indigo-600 rounded-2xl transition-all duration-200 shadow-lg shadow-indigo-650/15 hover:shadow-indigo-600/30"
      >
        <span>Unggah Diagram Sekarang</span>
        <ArrowRight className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
}
