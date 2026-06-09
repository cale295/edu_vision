'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface AnalysisCardProps {
  title: string;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  borderColor: string;
  children: React.ReactNode;
}

export default function AnalysisCard({
  title,
  icon: Icon,
  iconColor,
  bgColor,
  borderColor,
  children,
}: AnalysisCardProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0 },
      }}
      className="relative overflow-hidden p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300 group"
    >
      {/* Decorative gradient top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${borderColor}`}></div>

      <div className="flex items-center gap-3.5 mb-4">
        {/* Animated icon container */}
        <div
          className={`flex items-center justify-center p-2.5 rounded-2xl transition-all duration-300 group-hover:scale-110 ${bgColor} ${iconColor} shadow-sm`}
        >
          <Icon className="w-5 h-5" />
        </div>
        
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          {title}
        </h4>
      </div>

      <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed space-y-2">
        {children}
      </div>
    </motion.div>
  );
}
