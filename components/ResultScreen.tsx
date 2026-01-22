import React, { useMemo } from 'react';
import { Question, AnswerMap, QuizResult, UserInfo } from '../types';
import { AlertTriangle, RefreshCw, Clock, Award, Star, BookOpen, ThumbsUp, Sparkles, School, CheckCircle2, XCircle, BarChart3 } from 'lucide-react';

interface ResultScreenProps {
  result: QuizResult;
  questions: Question[];
  userAnswers: AnswerMap;
  userInfo: UserInfo;
  onRestart: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  result,
  questions,
  userInfo,
  onRestart
}) => {
  // Logic đánh giá chi tiết
  const feedback = useMemo(() => {
    if (result.isDisqualified) {
       return {
         title: "VI PHẠM QUY CHẾ",
         level: "Hủy kết quả",
         message: "Bài làm không được công nhận do phát hiện gian lận hoặc vi phạm quy chế thi nhiều lần.",
         advice: "Hãy trung thực trong học tập. Kiến thức thực tế quan trọng hơn điểm số ảo.",
         color: "text-red-600",
         bg: "bg-red-50 dark:bg-red-900/20",
         border: "border-red-200 dark:border-red-900/50",
         icon: <AlertTriangle size={64} className="text-red-500" strokeWidth={1.5} />
       };
    }
    
    const score = result.score;
    
    if (score >= 9) {
      return {
        title: "XUẤT SẮC",
        level: "Giỏi",
        message: "Chúc mừng em! Em đã nắm rất vững kiến thức và hoàn thành bài thi một cách tuyệt vời.",
        advice: "Hãy tiếp tục phát huy và thử sức với các bài tập nâng cao hơn nhé!",
        color: "text-green-600 dark:text-green-400",
        bg: "bg-green-50 dark:bg-green-900/20",
        border: "border-green-200 dark:border-green-900/50",
        icon: <Award size={64} className="text-green-500 dark:text-green-400" strokeWidth={1.5} />
      };
    } else if (score >= 7.5) {
      return {
        title: "KẾT QUẢ TỐT",
        level: "Khá",
        message: "Em có kiến thức nền tảng tốt. Tuy nhiên vẫn còn một vài lỗi nhỏ.",
        advice: "Hãy xem lại những câu làm sai để rút kinh nghiệm. Em hoàn toàn có thể đạt điểm tối đa!",
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-50 dark:bg-blue-900/20",
        border: "border-blue-200 dark:border-blue-900/50",
        icon: <Star size={64} className="text-blue-500 dark:text-blue-400" strokeWidth={1.5} />
      };
    } else if (score >= 5) {
      return {
        title: "ĐÃ HOÀN THÀNH",
        level: "Trung Bình",
        message: "Em đã đạt yêu cầu cơ bản nhưng kiến thức chưa thực sự chắc chắn.",
        advice: "Cần ôn tập kỹ lại lý thuyết trong SGK, đặc biệt là các phần CSS Selector và Box Model.",
        color: "text-indigo-600 dark:text-indigo-400",
        bg: "bg-indigo-50 dark:bg-indigo-900/20",
        border: "border-indigo-200 dark:border-indigo-900/50",
        icon: <ThumbsUp size={64} className="text-indigo-500 dark:text-indigo-400" strokeWidth={1.5} />
      };
    } else {
      return {
        title: "CẦN CỐ GẮNG NHIỀU",
        level: "Chưa đạt",
        message: "Kết quả bài thi chưa tốt. Có vẻ em chưa nắm vững kiến thức cơ bản.",
        advice: "Đừng nản lòng! Hãy đọc lại kỹ bài 13, 14, 15, 16, 17 và nhờ thầy cô hoặc bạn bè giảng lại những phần chưa hiểu.",
        color: "text-orange-600 dark:text-orange-400",
        bg: "bg-orange-50 dark:bg-orange-900/20",
        border: "border-orange-200 dark:border-orange-900/50",
        icon: <BookOpen size={64} className="text-orange-500 dark:text-orange-400" strokeWidth={1.5} />
      };
    }
  }, [result]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
       
       {/* Background Decoration */}
       <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-400/10 rounded-full blur-3xl"></div>
       </div>

       {/* Main Card */}
       <div className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden max-w-2xl w-full border border-slate-100 dark:border-slate-800 animate-pop-in z-10">
          
          {/* Header Banner */}
          <div className="bg-slate-900 text-white p-6 text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600 to-indigo-700 opacity-90"></div>
             <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 opacity-90">
                   <School size={18} />
                   <span className="uppercase tracking-widest text-xs font-bold">Trường THPT Nguyễn Trung Trực</span>
                </div>
                <h2 className="text-2xl font-bold">BÁO CÁO KẾT QUẢ</h2>
             </div>
          </div>

          <div className="p-8 md:p-10">
            {/* User Info */}
            <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
               <div>
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-wide mb-1">Học sinh</p>
                  <p className="text-xl font-bold text-slate-800 dark:text-slate-200">{userInfo.name}</p>
               </div>
               <div className="text-right">
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-wide mb-1">Lớp</p>
                  <p className="text-xl font-bold text-slate-800 dark:text-slate-200">{userInfo.className}</p>
               </div>
            </div>

            {/* Score & Icon Section */}
            <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
               <div className={`relative w-32 h-32 rounded-full ${feedback.bg} flex items-center justify-center border-4 ${feedback.border} shrink-0`}>
                  {feedback.icon}
                  {/* Score Badge */}
                  <div className="absolute -bottom-2 -right-2 bg-slate-900 text-white px-4 py-1 rounded-full font-black shadow-lg border-2 border-white dark:border-slate-800 text-lg">
                     {result.isDisqualified ? "0" : result.score}
                  </div>
               </div>
               
               <div className="text-center md:text-left flex-1">
                  <h3 className={`text-2xl font-black ${feedback.color} mb-2 uppercase`}>{feedback.title}</h3>
                  <p className="text-slate-600 dark:text-slate-300 font-medium mb-3">{feedback.message}</p>
                  
                  {/* Advice Box */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700 text-sm">
                     <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">💡 Lời khuyên:</span>
                     <span className="text-slate-600 dark:text-slate-400 italic">"{feedback.advice}"</span>
                  </div>
               </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
               <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-2xl border border-green-100 dark:border-green-900/30 text-center">
                  <CheckCircle2 size={20} className="text-green-500 mx-auto mb-2"/>
                  <div className="text-2xl font-bold text-green-700 dark:text-green-400">{result.correctCount}</div>
                  <div className="text-xs font-bold text-green-600/70 uppercase">Câu đúng</div>
               </div>
               <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30 text-center">
                  <XCircle size={20} className="text-red-500 mx-auto mb-2"/>
                  <div className="text-2xl font-bold text-red-700 dark:text-red-400">{result.incorrectCount}</div>
                  <div className="text-xs font-bold text-red-600/70 uppercase">Câu sai</div>
               </div>
               <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30 text-center">
                  <Clock size={20} className="text-blue-500 mx-auto mb-2"/>
                  <div className="text-lg font-bold text-blue-700 dark:text-blue-400 leading-8">{result.timeSpent}</div>
                  <div className="text-xs font-bold text-blue-600/70 uppercase">Thời gian</div>
               </div>
               <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-100 dark:border-purple-900/30 text-center">
                  <BarChart3 size={20} className="text-purple-500 mx-auto mb-2"/>
                  <div className="text-lg font-bold text-purple-700 dark:text-purple-400 leading-8">{Math.round((result.correctCount / result.totalQuestions) * 100)}%</div>
                  <div className="text-xs font-bold text-purple-600/70 uppercase">Tỷ lệ</div>
               </div>
            </div>

            {/* Actions */}
            <button 
               onClick={onRestart}
               className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-1 active:scale-[0.98]"
            >
               <RefreshCw size={20} /> Quay về màn hình chính
            </button>
            
            <p className="text-center text-xs text-slate-400 mt-4">
              Kết quả đã được lưu vào hệ thống của nhà trường.
            </p>
          </div>
       </div>
    </div>
  );
}