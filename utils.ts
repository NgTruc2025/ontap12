
import { Question } from "./types";

/**
 * Fisher-Yates shuffle algorithm to randomize array order
 */
export function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function prepareQuizData(allQuestions: Question[]): Question[] {
  // Trộn tất cả câu hỏi trong kho
  const shuffledQuestions = shuffle([...allQuestions]);
  
  // Chỉ lấy 40 câu ngẫu nhiên cho bài thi 30 phút
  const selectedQuestions = shuffledQuestions.slice(0, 40);

  // Trộn thứ tự đáp án trong mỗi câu hỏi
  return selectedQuestions.map((q) => ({
    ...q,
    options: shuffle(q.options),
  }));
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export async function submitToGoogleSheet(url: string, data: any) {
  try {
    // We use no-cors mode because Google Apps Script Web App redirects 
    // often cause CORS errors in strict browsers. 
    // 'no-cors' allows the request to be sent (fire and forget).
    await fetch(url, {
      method: "POST",
      mode: "no-cors", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log("Data submitted to Google Sheet");
    return true;
  } catch (e) {
    console.error("Error submitting to Google Sheet:", e);
    return false;
  }
}