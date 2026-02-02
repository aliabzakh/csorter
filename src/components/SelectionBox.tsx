'use client';

import { useState } from 'react';

interface Choice {
  id: string;
  text: string;
}

interface SelectionBoxProps {
  choice1: Choice;
  choice2: Choice;
  onSelect: (selectedId: string) => void;
  isLoading?: boolean;
}

export default function SelectionBox({
  choice1,
  choice2,
  onSelect,
  isLoading = false,
}: SelectionBoxProps) {
  const [rejectedId, setRejectedId] = useState<string | null>(null);
  const [animating, setAnimating] = useState(false);

  const handleSelect = (selectedId: string, rejectedId: string) => {
    setRejectedId(rejectedId);
    setAnimating(true);
    
    // Wait for animation to complete
    setTimeout(() => {
      onSelect(selectedId);
      setRejectedId(null);
      setAnimating(false);
    }, 600);
  };

  return (
    <div className="flex gap-6 w-full max-w-2xl perspective">
      {/* Choice 1 */}
      <div
        className={`flex-1 transition-all duration-500 ${
          rejectedId === choice1.id ? 'opacity-0 translate-x-[-100%]' : 'opacity-100 translate-x-0'
        }`}
      >
        <button
          onClick={() => handleSelect(choice1.id, choice2.id)}
          disabled={isLoading || animating}
          className={`w-full p-6 bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-slate-600 rounded-2xl text-white font-semibold text-lg transition-all duration-300 cursor-pointer group relative overflow-hidden
            ${
              rejectedId === choice1.id
                ? 'ring-4 ring-red-500/80 bg-red-950/40 shadow-lg shadow-red-500/50'
                : 'hover:border-green-500 hover:bg-gradient-to-br hover:from-green-700/30 hover:to-green-800/30 hover:shadow-lg hover:shadow-green-500/30'
            }
            ${isLoading || animating ? 'cursor-not-allowed opacity-75' : ''}
            disabled:cursor-not-allowed
          `}
        >
          {/* Glow effect on reject */}
          {rejectedId === choice1.id && (
            <div className="absolute inset-0 animate-pulse bg-red-500/20 rounded-2xl"></div>
          )}
          
          {/* Hover glow effect */}
          {rejectedId !== choice1.id && !animating && (
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-green-500/10 rounded-2xl transition-opacity duration-300"></div>
          )}
          
          <span className="relative z-10 block">{choice1.text}</span>
        </button>
      </div>

      {/* Choice 2 */}
      <div
        className={`flex-1 transition-all duration-500 ${
          rejectedId === choice2.id ? 'opacity-0 translate-x-[100%]' : 'opacity-100 translate-x-0'
        }`}
      >
        <button
          onClick={() => handleSelect(choice2.id, choice1.id)}
          disabled={isLoading || animating}
          className={`w-full p-6 bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-slate-600 rounded-2xl text-white font-semibold text-lg transition-all duration-300 cursor-pointer group relative overflow-hidden
            ${
              rejectedId === choice2.id
                ? 'ring-4 ring-red-500/80 bg-red-950/40 shadow-lg shadow-red-500/50'
                : 'hover:border-green-500 hover:bg-gradient-to-br hover:from-green-700/30 hover:to-green-800/30 hover:shadow-lg hover:shadow-green-500/30'
            }
            ${isLoading || animating ? 'cursor-not-allowed opacity-75' : ''}
            disabled:cursor-not-allowed
          `}
        >
          {/* Glow effect on reject */}
          {rejectedId === choice2.id && (
            <div className="absolute inset-0 animate-pulse bg-red-500/20 rounded-2xl"></div>
          )}
          
          {/* Hover glow effect */}
          {rejectedId !== choice2.id && !animating && (
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-green-500/10 rounded-2xl transition-opacity duration-300"></div>
          )}
          
          <span className="relative z-10 block">{choice2.text}</span>
        </button>
      </div>
    </div>
  );
}
