'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  BookOpen,
  Layers,
  ClipboardList,
  Lightbulb,
  Award,
  Check,
  X,
  RefreshCw,
  Info,
} from 'lucide-react';
import { AnalysisResult } from '@/types/analysis';
import AnalysisCard from './AnalysisCard';

interface ResultSectionProps {
  result: AnalysisResult;
  isMocked?: boolean;
}

export default function ResultSection({ result, isMocked }: ResultSectionProps) {
  // Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState<{ [key: number]: boolean }>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const handleSelectOption = (qIndex: number, option: string) => {
    if (showResults[qIndex]) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIndex]: option }));
  };

  const handleCheckAnswer = (qIndex: number) => {
    if (!selectedAnswers[qIndex]) return;
    setShowResults((prev) => ({ ...prev, [qIndex]: true }));

    const nextShowResults = { ...showResults, [qIndex]: true };
    if (Object.keys(nextShowResults).length === result.questions.length) {
      let score = 0;
      result.questions.forEach((q, idx) => {
        const userAnswer = selectedAnswers[idx];
        if (userAnswer === q.answer) {
          score += 1;
        }
      });
      setQuizScore(score);
    }
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setShowResults({});
    setQuizScore(null);
  };

  // Framer Motion Container Variant for Staggering
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Alert banner if results are mocked */}
      {isMocked && (
        <motion.div
          variants={{
            hidden: { opacity: 0, y: -10 },
            visible: { opacity: 1, y: 0 },
          }}
          className="flex items-start gap-3.5 p-4.5 text-sm rounded-3xl text-amber-800 dark:text-amber-300 bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 shadow-sm"
        >
          <Info className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold">Mode Simulasi:</span> Kunci API Gemini tidak terdeteksi. Hasil analisis di bawah ini disimulasikan secara dinamis berdasarkan nama file diagram Anda.
          </div>
        </motion.div>
      )}

      {/* Grid for Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Jenis Diagram */}
        <AnalysisCard
          title="Jenis Diagram"
          icon={FileText}
          iconColor="text-blue-600 dark:text-blue-400"
          bgColor="bg-blue-50 dark:bg-blue-950/40"
          borderColor="from-blue-500 to-indigo-500"
        >
          <div className="text-lg font-black text-slate-805 dark:text-white">
            {result.diagramType}
          </div>
        </AnalysisCard>

        {/* Ringkasan */}
        <AnalysisCard
          title="Ringkasan Ulasan"
          icon={ClipboardList}
          iconColor="text-emerald-600 dark:text-emerald-400"
          bgColor="bg-emerald-50 dark:bg-emerald-950/40"
          borderColor="from-emerald-500 to-teal-500"
        >
          <p className="text-slate-600 dark:text-slate-300 font-semibold leading-relaxed">
            {result.summary}
          </p>
        </AnalysisCard>

        {/* Penjelasan */}
        <div className="md:col-span-2">
          <AnalysisCard
            title="Penjelasan Diagram"
            icon={BookOpen}
            iconColor="text-indigo-600 dark:text-indigo-400"
            bgColor="bg-indigo-50 dark:bg-indigo-950/40"
            borderColor="from-indigo-500 to-purple-500"
          >
            <p className="text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed">
              {result.explanation}
            </p>
          </AnalysisCard>
        </div>

        {/* Komponen Penting */}
        <AnalysisCard
          title="Komponen Penting"
          icon={Layers}
          iconColor="text-violet-600 dark:text-violet-400"
          bgColor="bg-violet-50 dark:bg-violet-950/40"
          borderColor="from-violet-500 to-fuchsia-500"
        >
          <ul className="space-y-4">
            {result.components.map((component, idx) => (
              <li key={idx} className="flex gap-3 items-start text-slate-600 dark:text-slate-300">
                <span className="flex items-center justify-center w-5.5 h-5.5 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 text-xs font-bold shrink-0 mt-0.5 shadow-sm">
                  {idx + 1}
                </span>
                <span className="text-sm font-medium leading-relaxed">{component}</span>
              </li>
            ))}
          </ul>
        </AnalysisCard>

        {/* Saran Perbaikan */}
        <AnalysisCard
          title="Saran Perbaikan"
          icon={Lightbulb}
          iconColor="text-amber-600 dark:text-amber-400"
          bgColor="bg-amber-50 dark:bg-amber-950/40"
          borderColor="from-amber-500 to-orange-500"
        >
          {result.improvements && result.improvements.length > 0 ? (
            <ul className="space-y-3.5">
              {result.improvements.map((imp, idx) => (
                <li key={idx} className="flex gap-3 items-start text-slate-600 dark:text-slate-300">
                  <span className="flex items-center justify-center w-5.5 h-5.5 rounded-full bg-amber-100 dark:bg-amber-950/45 text-amber-700 dark:text-amber-300 text-xs font-bold shrink-0 mt-0.5 shadow-sm">
                    💡
                  </span>
                  <span className="text-sm font-medium leading-relaxed">{imp}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-450 dark:text-slate-500 italic text-sm">
              Tidak ada saran perbaikan yang diidentifikasi. Struktur diagram terlihat sudah optimal.
            </p>
          )}
        </AnalysisCard>
      </div>

      {/* Soal Latihan (Interactive Quiz Section) */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 15 },
          visible: { opacity: 1, y: 0 },
        }}
        className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm transition-all duration-300"
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <div className="flex items-center justify-center p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 shadow-sm">
                <Award className="w-5.5 h-5.5" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                Latihan Pemahaman Diagram
              </h3>
            </div>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium">
              Uji tingkat kognisi Anda dengan menjawab 5 soal pilihan ganda berikut.
            </p>
          </div>

          {quizScore !== null && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-4.5 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 px-5 py-3.5 rounded-2xl shadow-sm"
            >
              <div>
                <span className="text-[10px] text-slate-450 dark:text-slate-500 block uppercase tracking-wider font-bold">Skor Anda</span>
                <span className="text-2xl font-black text-indigo-650 dark:text-indigo-400">
                  {quizScore} <span className="text-slate-400 text-xs font-normal">/ {result.questions.length}</span>
                </span>
              </div>
              <button
                onClick={resetQuiz}
                className="p-2.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100/50 dark:hover:bg-indigo-950/50 rounded-xl transition-all duration-200"
                title="Ulangi Kuis"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </div>

        {/* Questions Checklist */}
        <div className="space-y-8">
          {result.questions.map((q, qIdx) => {
            const hasSubmitted = showResults[qIdx];
            const selectedOpt = selectedAnswers[qIdx];

            return (
              <div
                key={qIdx}
                className="p-5 md:p-6 bg-slate-50 dark:bg-slate-950/30 border border-slate-200/50 dark:border-slate-850 rounded-2xl space-y-4"
              >
                <h4 className="text-sm md:text-base font-bold text-slate-800 dark:text-white flex gap-2.5 leading-snug">
                  <span className="text-indigo-500 dark:text-indigo-400 font-mono">Soal {qIdx + 1}.</span>
                  <span>{q.question}</span>
                </h4>

                {/* Options List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {q.options.map((option, optIdx) => {
                    const isSelected = selectedOpt === option;
                    const isCorrect = option === q.answer;
                    
                    let optStyle = 'border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 bg-white dark:bg-slate-900';
                    
                    if (isSelected) {
                      optStyle = 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/10 dark:bg-indigo-950/20';
                    }

                    if (hasSubmitted) {
                      if (isCorrect) {
                        optStyle = 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 ring-2 ring-emerald-500/20';
                      } else if (isSelected) {
                        optStyle = 'border-rose-500 bg-rose-50/20 dark:bg-rose-950/20 text-rose-800 dark:text-rose-455 ring-2 ring-rose-500/20';
                      } else {
                        optStyle = 'border-slate-200 dark:border-slate-800 opacity-50 bg-white dark:bg-slate-900';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(qIdx, option)}
                        disabled={hasSubmitted}
                        className={`p-4 text-left text-sm font-medium rounded-xl border transition-all duration-200 flex items-center justify-between gap-3 group focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none ${optStyle}`}
                      >
                        <span className="flex-1 leading-snug">{option}</span>
                        {hasSubmitted && isCorrect && <Check className="w-4.5 h-4.5 text-emerald-500 shrink-0" />}
                        {hasSubmitted && isSelected && !isCorrect && <X className="w-4.5 h-4.5 text-rose-500 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Submit button and explanation */}
                <div className="flex flex-col gap-3">
                  {!hasSubmitted ? (
                    <div className="flex justify-end">
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleCheckAnswer(qIdx)}
                        disabled={!selectedOpt}
                        className="px-4.5 py-2.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 dark:bg-indigo-650 dark:hover:bg-indigo-600 rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Periksa Jawaban
                      </motion.button>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs md:text-sm shadow-sm space-y-1.5 text-left"
                    >
                      <div className="flex items-center gap-1.5 font-bold">
                        {selectedOpt === q.answer ? (
                          <span className="text-emerald-600 dark:text-emerald-450 flex items-center gap-1">
                            <Check className="w-4 h-4" /> Jawaban Benar
                          </span>
                        ) : (
                          <span className="text-rose-600 dark:text-rose-455 flex items-center gap-1">
                            <X className="w-4 h-4" /> Jawaban Salah
                          </span>
                        )}
                        <span className="text-slate-400 dark:text-slate-500 font-normal">| Kunci: {q.answer.substring(0, 1)}</span>
                      </div>
                      <p className="text-slate-550 dark:text-slate-400 leading-relaxed font-medium">
                        {q.explanation}
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom repeat trigger */}
        {quizScore !== null && (
          <div className="flex justify-center mt-8 pt-6 border-t border-slate-105 dark:border-slate-800">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={resetQuiz}
              className="flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-indigo-650 hover:bg-indigo-600 rounded-2xl shadow-md shadow-indigo-650/15 hover:shadow-indigo-600/30 transition-all duration-200"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Ulangi Seluruh Kuis</span>
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
