import React, { useState, useEffect, useCallback } from 'react';
import { QuizState, Question, UserInfo, AnswerMap, QuizResult } from './types';
import { MASTER_QUESTIONS } from './data';
import { prepareQuizData, formatTime, submitToGoogleSheet } from './utils';
import { IntroScreen } from './components/IntroScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultScreen } from './components/ResultScreen';
import { Moon, Sun } from 'lucide-react';

const QUIZ_DURATION = 30 * 60; // 30 minutes in seconds

export default function App() {
  const [gameState, setGameState] = useState<QuizState>(QuizState.INTRO);
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: '', firstName: '', lastName: '', className: '' });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<AnswerMap>({});
  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const startGame = useCallback((info: UserInfo) => {
    setUserInfo(info);
    
    // Lấy 40 câu hỏi ngẫu nhiên từ kho dữ liệu khổng lồ
    const preparedQuestions = prepareQuizData(MASTER_QUESTIONS);
    
    setQuestions(preparedQuestions);
    setGameState(QuizState.PLAYING);
    setTimeLeft(QUIZ_DURATION);
    setUserAnswers({});
    
    // Request fullscreen for better immersion (and mild anti-cheat)
    const el = document.documentElement;
    if (el.requestFullscreen) {
      el.requestFullscreen().catch(() => {
        // Ignore failure, user might deny
      });
    }
  }, []);

  const handleTick = useCallback(() => {
    setTimeLeft((prev) => prev - 1);
  }, []);

  const handleSubmit = useCallback((answers: AnswerMap, isDisqualified: boolean = false) => {
    // Exit fullscreen
    if (document.exitFullscreen && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }

    // Calculate score
    let correctCount = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const incorrectCount = questions.length - correctCount;
    // Score out of 10, rounded to 1 decimal
    const score = Math.round((correctCount / questions.length) * 10 * 10) / 10;
    const timeSpentSeconds = QUIZ_DURATION - timeLeft;
    const formattedTime = formatTime(timeSpentSeconds);
    
    const resultData: QuizResult = {
      totalQuestions: questions.length,
      correctCount,
      incorrectCount,
      score: isDisqualified ? 0 : score, // Zero score if disqualified? Or keep score but mark valid? Let's just keep the score but flag it.
      timeSpent: formattedTime,
      date: new Date().toLocaleDateString('vi-VN'),
      isDisqualified
    };

    setResult(resultData);
    setUserAnswers(answers);
    setGameState(QuizState.RESULT);

    // Check for Google Sheet Configuration and Send Data
    const sheetUrl = localStorage.getItem('GOOGLE_SHEET_SCRIPT_URL');
    if (sheetUrl) {
      const payload = {
        name: userInfo.name + (isDisqualified ? " (GIAN LẬN)" : ""),
        firstName: userInfo.firstName + (isDisqualified ? " (GIAN LẬN)" : ""),
        lastName: userInfo.lastName,
        className: userInfo.className,
        score: resultData.score,
        correctCount: correctCount,
        totalQuestions: questions.length,
        timeSpent: formattedTime,
        date: new Date().toISOString()
      };
      submitToGoogleSheet(sheetUrl, payload);
    }

  }, [questions, timeLeft, userInfo]);

  const handleRestart = () => {
    setGameState(QuizState.INTRO);
    setResult(null);
    setUserInfo({ name: '', firstName: '', lastName: '', className: '' });
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-900 min-h-screen font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
        
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur shadow-lg text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all border border-indigo-100 dark:border-slate-700"
          title={isDarkMode ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {gameState === QuizState.INTRO && (
          <IntroScreen onStart={startGame} />
        )}

        {gameState === QuizState.PLAYING && (
          <QuizScreen
            questions={questions}
            timeLeft={timeLeft}
            onTick={handleTick}
            onSubmit={handleSubmit}
            userName={userInfo.name}
          />
        )}

        {gameState === QuizState.RESULT && result && (
          <ResultScreen
            result={result}
            questions={questions}
            userAnswers={userAnswers}
            userInfo={userInfo}
            onRestart={handleRestart}
          />
        )}
      </div>
    </div>
  );
}