import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';

interface LogPanelProps {
  logs: LogEntry[];
}

const LogPanel: React.FC<LogPanelProps> = ({ logs }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="h-full flex flex-col bg-white/90 backdrop-blur-sm border border-gray-100/50 rounded-xl shadow-sm relative overflow-hidden">
        <div className="bg-derby-green text-white p-3 font-black text-lg shadow-sm shrink-0">
          行动记录
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {logs.length === 0 && (
            <div className="text-center text-gray-400 mt-10 text-base">新的生活开始了...</div>
            )}
            {logs.map((log) => (
            <div key={log.id} className="flex gap-4 text-base animate-fade-in group border-b border-gray-50 pb-2 last:border-0">
                <span className="text-gray-500 group-hover:text-gray-600 font-mono text-sm pt-1 min-w-[3.5rem] transition-colors select-none">{log.timestamp}</span>
                <div className={`flex-1 leading-relaxed ${
                log.type === 'event' ? 'text-purple-700 font-medium bg-purple-50 p-2 rounded-lg' :
                log.type === 'warning' ? 'text-orange-600' :
                log.type === 'error' ? 'text-red-600 font-bold' :
                log.type === 'success' ? 'text-derby-dark' :
                'text-gray-800'
                }`}>
                {log.type === 'event' && '✨ '}
                {log.text}
                </div>
            </div>
            ))}
            <div ref={bottomRef} className="h-4" />
        </div>
    </div>
  );
};

export default LogPanel;