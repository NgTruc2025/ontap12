import React, { useState, useEffect, useRef } from 'react';
import { Question, AnswerMap } from '../types';
import { formatTime } from '../utils';
import { Timer, AlertTriangle, CheckCircle2, ChevronRight, ChevronLeft, LayoutGrid, XCircle, Clock, Disc, School } from 'lucide-react';

interface QuizScreenProps {
  questions: Question[];
  timeLeft: number;
  onTick: () => void;
  onSubmit: (answers: AnswerMap, isDisqualified?: boolean) => void;
  userName: string;
}

const MAX_VIOLATIONS = 3;

export const QuizScreen: React.FC<QuizScreenProps> = ({ 
  questions, 
  timeLeft, 
  onTick, 
  onSubmit,
  userName 
}) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerMap>({});
  const [violationCount, setViolationCount] = useState(0);
  const [warningMsg, setWarningMsg] = useState<string | null>(null);
  
  const currentQuestion = questions[currentQIndex];
  const progress = Object.keys(userAnswers).length;
  const progressPercent = (progress / questions.length) * 100;

  // Helper to handle violations
  const handleViolation = (reason: string) => {
    // If already disqualified, do nothing
    if (violationCount >= MAX_VIOLATIONS) return;

    const newCount = violationCount + 1;
    setViolationCount(newCount);
    
    if (newCount >= MAX_VIOLATIONS) {
      setWarningMsg(`Vi phạm ${newCount}/${MAX_VIOLATIONS}: ${reason}. Bài thi sẽ bị hủy!`);
      setTimeout(() => {
        onSubmit(userAnswers, true);
      }, 1500);
    } else {
      setWarningMsg(`Cảnh báo (${newCount}/${MAX_VIOLATIONS}): ${reason}`);
      setTimeout(() => setWarningMsg(null), 4000);
    }
  };

  // Anti-cheat: Focus and Visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleViolation("Rời khỏi màn hình làm bài");
      }
    };
    
    const handleBlur = () => {
       handleViolation("Mất tiêu điểm cửa sổ");
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
        e.preventDefault();
        handleViolation("Cố tình tải lại trang");
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [violationCount]);

  // Timer interval
  useEffect(() => {
    if (timeLeft <= 0) {
      onSubmit(userAnswers, false);
      return;
    }
    const timer = setInterval(onTick, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onTick, onSubmit, userAnswers]);

  const handleSelectOption = (option: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: option
    }));
  };

  const isAnswered = (qId: string) => !!userAnswers[qId];

  return (
    <div className="min-h-screen flex flex-col pb-6 relative">
      
      {/* Non-intrusive Notification Toast */}
      <div 
        className={`
          fixed top-24 right-6 z-50 max-w-sm transition-all duration-500 ease-in-out transform
          ${warningMsg ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0 pointer-events-none'}
        `}
      >
        <div className={`
          flex items-center gap-4 px-5 py-4 rounded-2xl shadow-2xl border-l-4 backdrop-blur-md
          ${violationCount >= MAX_VIOLATIONS 
            ? 'bg-red-600/90 border-red-800 text-white' 
            : 'bg-orange-100/90 border-orange-500 text-orange-900'}
        `}>
          <div className="p-2 bg-white/20 rounded-full">
            {violationCount >= MAX_VIOLATIONS ? <XCircle size={24} /> : <AlertTriangle size={24} />}
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wide">
              {violationCount >= MAX_VIOLATIONS ? 'Đình chỉ thi' : 'Cảnh báo gian lận'}
            </h4>
            <p className="text-sm font-medium mt-0.5 leading-tight">{warningMsg}</p>
          </div>
        </div>
      </div>

      {/* Header Bar */}
      <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm sticky top-0 z-30 transition-colors duration-300 border-b border-indigo-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-3">
          
          {/* School Name - Top small bar */}
          <div className="flex justify-center mb-2 md:hidden">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest flex items-center gap-1">
                 <School size={12} /> THPT Nguyễn Trung Trực
              </span>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 mb-3">
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
              <div className="flex flex-col">
                  <span className="hidden md:flex text-[10px] uppercase font-bold text-slate-400 tracking-widest items-center gap-1 mb-1">
                     <School size={12} /> THPT Nguyễn Trung Trực
                  </span>
                  <div className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-4 py-2 rounded-xl font-bold text-sm border border-indigo-100 dark:border-indigo-800 flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                     {userName}
                  </div>
              </div>
              
              <div className={`
                px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1.5 h-fit self-end mb-1
                ${violationCount > 0 ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}
              `}>
                <span className={`w-1.5 h-1.5 rounded-full ${violationCount > 0 ? 'bg-orange-500' : 'bg-emerald-500'}`}></span>
                Vi phạm: {violationCount}/{MAX_VIOLATIONS}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
               <div className={`flex items-center gap-2 font-mono text-xl font-bold px-4 py-1.5 rounded-xl border ${timeLeft < 300 ? 'text-red-600 border-red-200 bg-red-50 animate-pulse' : 'text-indigo-900 dark:text-indigo-200 border-indigo-100 dark:border-slate-700 bg-indigo-50 dark:bg-slate-800'} transition-colors`}>
                  <Clock size={20} className={timeLeft < 300 ? 'animate-spin' : 'text-indigo-500'} />
                  {formatTime(timeLeft)}
               </div>

               <button
                  onClick={() => onSubmit(userAnswers, false)}
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-red-500/20 hover:shadow-red-500/30 active:scale-95"
               >
                  <CheckCircle2 size={18} />
                  <span className="hidden sm:inline">Nộp bài</span>
               </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden transition-colors shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 transition-all duration-700 ease-out relative"
              style={{ width: `${progressPercent}%` }}
            >
               <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Question Area */}
        <div className="md:col-span-8 space-y-6 animate-pop-in">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur rounded-[2rem] shadow-xl shadow-indigo-500/5 p-6 md:p-10 min-h-[450px] flex flex-col transition-all duration-300 border border-white dark:border-slate-800">
            <div className="flex flex-col gap-4 mb-8">
               <div className="flex justify-between items-start">
                  <span className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm border border-indigo-200 dark:border-indigo-800">
                     Câu hỏi {currentQIndex + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                     {currentQuestion.category}
                  </span>
               </div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 leading-relaxed">
                {currentQuestion.question}
              </h2>
            </div>

            <div className="grid gap-4 mt-auto">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = userAnswers[currentQuestion.id] === option;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(option)}
                    className={`
                      relative w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 group
                      ${isSelected 
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-md transform scale-[1.01]' 
                        : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-600 hover:bg-indigo-50/50 dark:hover:bg-slate-800'
                      }
                    `}
                  >
                     {/* Gradient border for selected state */}
                     {isSelected && <div className="absolute inset-0 rounded-2xl border-2 border-indigo-500 pointer-events-none"></div>}

                    <div className="flex items-center gap-5 relative z-10">
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-colors shrink-0
                        ${isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/30'
                          : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 group-hover:border-indigo-300 dark:group-hover:border-slate-500 group-hover:text-indigo-600'
                        }
                      `}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className={`font-medium text-lg ${isSelected ? 'text-indigo-900 dark:text-indigo-100 font-bold' : 'text-slate-700 dark:text-slate-300'} transition-colors`}>
                         {option}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              disabled={currentQIndex === 0}
              onClick={() => setCurrentQIndex(c => c - 1)}
              className="flex items-center gap-2 px-6 py-3.5 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 font-bold transition-all hover:-translate-x-1"
            >
              <ChevronLeft size={20} /> Trước
            </button>
            
            {currentQIndex === questions.length - 1 ? (
              <button
                onClick={() => onSubmit(userAnswers, false)}
                className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-red-600 to-rose-600 rounded-2xl shadow-lg shadow-red-600/30 text-white hover:from-red-700 hover:to-rose-700 font-bold transition-all transform hover:-translate-y-1"
              >
                Nộp bài ngay <CheckCircle2 size={20} />
              </button>
            ) : (
              <button
                onClick={() => setCurrentQIndex(c => c + 1)}
                className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl shadow-lg shadow-indigo-600/30 text-white hover:from-indigo-700 hover:to-violet-700 font-bold transition-all transform hover:translate-x-1"
              >
                Tiếp theo <ChevronRight size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Grid (Sidebar) */}
        <div className="md:col-span-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur rounded-[2rem] shadow-xl p-6 sticky top-24 transition-colors duration-300 border border-indigo-50 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
               <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                  <LayoutGrid size={20} /> 
               </div>
               <span className="font-bold text-slate-700 dark:text-slate-200">Danh sách câu hỏi</span>
            </div>
            
            <div className="grid grid-cols-5 gap-2.5 max-h-[50vh] overflow-y-auto custom-scrollbar pr-2 pb-2">
              {questions.map((q, idx) => {
                const answered = isAnswered(q.id);
                const isActive = currentQIndex === idx;
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQIndex(idx)}
                    className={`
                      aspect-square rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center
                      ${isActive 
                        ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900 transform scale-105 z-10' 
                        : 'hover:scale-105'
                      }
                      ${answered
                        ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700'
                      }
                    `}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
            
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 transition-colors">
               <div className="flex items-center justify-between text-sm mb-3">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Tiến độ</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">{Math.round(progressPercent)}%</span>
               </div>
               <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
               </div>
               <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-indigo-50 dark:bg-slate-800/50 p-3 rounded-xl text-center border border-indigo-100 dark:border-slate-700">
                     <div className="text-indigo-600 dark:text-indigo-400 font-bold text-lg">{progress}</div>
                     <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">Đã làm</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl text-center border border-slate-200 dark:border-slate-700">
                     <div className="text-slate-600 dark:text-slate-400 font-bold text-lg">{questions.length - progress}</div>
                     <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">Chưa làm</div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};