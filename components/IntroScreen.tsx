import React, { useState, useEffect } from 'react';
import { UserInfo } from '../types';
import { BookOpen, User, Users, Settings, X, Save, HelpCircle, AlertCircle, Copy, Check, Sparkles, School, GraduationCap } from 'lucide-react';

interface IntroScreenProps {
  onStart: (info: UserInfo) => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onStart }) => {
  const [hoDem, setHoDem] = useState('');
  const [ten, setTen] = useState('');
  const [className, setClassName] = useState('');
  const [error, setError] = useState('');
  
  // Settings State
  const [showSettings, setShowSettings] = useState(false);
  const [sheetUrl, setSheetUrl] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedDefault, setCopiedDefault] = useState(false);

  // Default URL requested to be auto-saved
  const defaultScriptUrl = "https://script.google.com/macros/s/AKfycbwBseiDXLni6hMJwOClePwZZaHYZWFvPbiGyuOXEE1NLGIpBgpvjcbvTyYihOWybCkk/exec";

  useEffect(() => {
    const savedUrl = localStorage.getItem('GOOGLE_SHEET_SCRIPT_URL');
    if (savedUrl) {
      setSheetUrl(savedUrl);
    } else {
      localStorage.setItem('GOOGLE_SHEET_SCRIPT_URL', defaultScriptUrl);
      setSheetUrl(defaultScriptUrl);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hoDem.trim() || !ten.trim() || !className.trim()) {
      setError('Vui lòng nhập đầy đủ Họ đệm, Tên và Lớp.');
      return;
    }
    const firstName = ten.trim();
    const lastName = hoDem.trim();
    const fullName = `${lastName} ${firstName}`;
    
    onStart({ 
      name: fullName, 
      firstName: firstName,
      lastName: lastName,
      className: className.trim() 
    });
  };

  const handleSaveSettings = () => {
    localStorage.setItem('GOOGLE_SHEET_SCRIPT_URL', sheetUrl.trim());
    setShowSettings(false);
  };

  const copyDefaultUrl = () => {
    navigator.clipboard.writeText(defaultScriptUrl);
    setCopiedDefault(true);
    setTimeout(() => setCopiedDefault(false), 2000);
  };

  const scriptCode = `function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  
  sheet.appendRow([
    new Date(), 
    data.firstName, 
    data.lastName,
    data.className,
    data.score, 
    data.correctCount,
    data.totalQuestions,
    data.timeSpent
  ]);
  
  return ContentService.createTextOutput("Success")
    .setMimeType(ContentService.MimeType.TEXT);
}`;

  const copyCode = () => {
    navigator.clipboard.writeText(scriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-50 dark:bg-slate-950">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Settings Button */}
      <button 
        onClick={() => setShowSettings(true)}
        className="absolute top-4 right-4 md:top-6 md:right-6 p-3 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur shadow-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-all z-10"
        title="Cấu hình hệ thống"
      >
        <Settings size={20} />
      </button>

      {/* Main Card */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 dark:border-slate-800 p-8 md:p-12 max-w-lg w-full relative z-20 animate-pop-in">
        
        {/* Branding Header */}
        <div className="text-center mb-10 space-y-3">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg shadow-blue-600/30 text-white">
              <School size={40} />
            </div>
          </div>
          
          <div>
            <h2 className="text-sm md:text-base font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1">
              Hệ thống ôn tập trực tuyến
            </h2>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white leading-tight">
              Trường THPT <br/> Nguyễn Trung Trực
            </h1>
          </div>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700">
            <BookOpen size={14} />
            <span>Môn Tin học 12 - HTML & CSS</span>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1">Họ đệm</label>
                  <input
                    type="text"
                    value={hoDem}
                    onChange={(e) => setHoDem(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-semibold text-slate-800 dark:text-slate-100"
                    placeholder="Nguyễn Văn"
                  />
               </div>
               <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1">Tên</label>
                  <input
                    type="text"
                    value={ten}
                    onChange={(e) => setTen(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-semibold text-slate-800 dark:text-slate-100"
                    placeholder="An"
                  />
               </div>
            </div>

            <div className="space-y-1.5">
               <label className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1">Lớp</label>
               <div className="relative">
                 <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 <input
                   type="text"
                   value={className}
                   onChange={(e) => setClassName(e.target.value)}
                   className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-semibold text-slate-800 dark:text-slate-100"
                   placeholder="Nhập lớp (Ví dụ: 12A1)"
                 />
               </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900/30 animate-fade-in">
              <AlertCircle size={16} className="shrink-0"/>
              {error}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>Vào thi ngay</span>
              <GraduationCap size={20} />
            </button>
          </div>

          <div className="text-center">
             <p className="text-xs text-slate-400 dark:text-slate-500">
               Thời gian làm bài: <span className="font-bold text-slate-600 dark:text-slate-300">30 phút</span> • Số câu hỏi: <span className="font-bold text-slate-600 dark:text-slate-300">40 câu</span>
             </p>
          </div>
        </form>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 dark:border-slate-700 max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                <Settings size={20} className="text-indigo-600"/> Cấu hình kết nối
              </h3>
              <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
                <X size={20} className="text-slate-500"/>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Google Apps Script URL</label>
                <input
                  type="text"
                  value={sheetUrl}
                  onChange={(e) => setSheetUrl(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono focus:border-indigo-500 outline-none"
                />
              </div>
              
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800 flex flex-col gap-3">
                 <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-indigo-800 dark:text-indigo-300 uppercase">Server Mặc định</span>
                    <button onClick={copyDefaultUrl} className="text-xs bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-indigo-200 dark:border-slate-600 font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 transition-colors flex items-center gap-1">
                       {copiedDefault ? <Check size={12}/> : <Copy size={12}/>} {copiedDefault ? 'Đã chép' : 'Sao chép'}
                    </button>
                 </div>
                 <code className="text-[10px] break-all text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-700">
                    {defaultScriptUrl}
                 </code>
              </div>

              <div>
                <button 
                  type="button" 
                  onClick={() => setShowHelp(!showHelp)}
                  className="text-sm font-bold text-indigo-600 flex items-center gap-1 hover:underline"
                >
                  <HelpCircle size={16} /> {showHelp ? 'Ẩn hướng dẫn' : 'Hướng dẫn tạo Google Sheet'}
                </button>

                {showHelp && (
                  <div className="mt-4 space-y-3 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300">
                     <ol className="list-decimal pl-4 space-y-1">
                       <li>Tạo Google Sheet, mở <strong>Extensions {'>'} Apps Script</strong>.</li>
                       <li>Dán code bên dưới và lưu lại.</li>
                       <li>Chọn <strong>Deploy {'>'} New deployment</strong>.</li>
                       <li>Select type: <strong>Web app</strong>. Execute as: <strong>Me</strong>. Who has access: <strong>Anyone</strong>.</li>
                       <li>Copy URL và dán vào ô trên.</li>
                     </ol>
                     <div className="relative group mt-2">
                        <pre className="bg-slate-900 text-slate-300 p-3 rounded-lg text-xs font-mono overflow-x-auto">{scriptCode}</pre>
                        <button onClick={copyCode} className="absolute top-2 right-2 p-1.5 bg-white/10 hover:bg-white/20 rounded text-white transition-colors" title="Copy code">
                           {copied ? <Check size={14}/> : <Copy size={14}/>}
                        </button>
                     </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 bg-slate-50/50 dark:bg-slate-900">
              <button onClick={() => setShowSettings(false)} className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors">Đóng</button>
              <button onClick={handleSaveSettings} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 flex items-center gap-2">
                 <Save size={18}/> Lưu cấu hình
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};