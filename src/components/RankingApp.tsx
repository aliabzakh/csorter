'use client';

import { useState } from 'react';
import SelectionBox from './SelectionBox';

interface Item {
  id: string;
  name: string;
}

export default function RankingApp() {
  const [items, setItems] = useState<Item[]>([]);
  const [ranking, setRanking] = useState<Item[]>([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [currentComparison, setCurrentComparison] = useState<[Item, Item] | null>(null);
  const [step, setStep] = useState<'input' | 'ranking'>('input');
  const [inputValue, setInputValue] = useState('');
  const [binarySearchState, setBinarySearchState] = useState<{ left: number; right: number } | null>(null);
  const [itemBeingPlaced, setItemBeingPlaced] = useState<Item | null>(null);
  const [questionsAsked, setQuestionsAsked] = useState(0);

  // Set up first comparison when user starts ranking
  const handleStartRanking = () => {
    if (items.length >= 2) {
      const item1 = items[0];
      const item2 = items[1];
      setCurrentComparison([item1, item2]);
      setStep('ranking');
      setQuestionsAsked(0); // Reset question counter
    }
  };

  const handleAddItem = () => {
    if (inputValue.trim()) {
      setItems([
        ...items,
        {
          id: Date.now().toString(),
          name: inputValue.trim(),
        },
      ]);
      setInputValue('');
    }
  };

  const startBinarySearchForNextItem = (currentRanking: Item[], nextIndex: number) => {
    if (nextIndex < items.length) {
      const nextItem = items[nextIndex];
      setItemBeingPlaced(nextItem);
      setCurrentItemIndex(nextIndex);
      setBinarySearchState({ left: 0, right: currentRanking.length });
      
      // Calculate mid position for first comparison
      const mid = Math.floor(currentRanking.length / 2);
      if (mid < currentRanking.length) {
        setCurrentComparison([nextItem, currentRanking[mid]]);
      } else {
        // Edge case: insert at end
        const newRanking = [...currentRanking, nextItem];
        setRanking(newRanking);
        setItemBeingPlaced(null);
        setBinarySearchState(null);
        startBinarySearchForNextItem(newRanking, nextIndex + 1);
      }
    } else {
      // All items ranked
      setCurrentComparison(null);
      setItemBeingPlaced(null);
      setBinarySearchState(null);
    }
  };

  const handleSelect = (selectedId: string) => {
    if (!currentComparison) return;

    // Increment question counter for each comparison
    setQuestionsAsked(prev => prev + 1);

    const [item1, item2] = currentComparison;

    // INITIAL COMPARISON (first 2 items)
    if (ranking.length === 0) {
      const newRanking = selectedId === item1.id ? [item1, item2] : [item2, item1];
      setRanking(newRanking);
      
      // Start binary search for item 3 if it exists
      if (items.length > 2) {
        startBinarySearchForNextItem(newRanking, 2);
      } else {
        setCurrentComparison(null);
      }
      return;
    }

    // BINARY SEARCH INSERTION
    if (itemBeingPlaced && binarySearchState) {
      const mid = Math.floor((binarySearchState.left + binarySearchState.right) / 2);
      
      // User selected itemBeingPlaced = it's MORE important than ranking[mid]
      const isMoreImportant = selectedId === itemBeingPlaced.id;

      if (isMoreImportant) {
        // Search left half (more important = lower index)
        const newRight = mid;
        
        if (binarySearchState.left < newRight) {
          // Continue searching
          const newState = { left: binarySearchState.left, right: newRight };
          setBinarySearchState(newState);
          const newMid = Math.floor((newState.left + newState.right) / 2);
          setCurrentComparison([itemBeingPlaced, ranking[newMid]]);
        } else {
          // Found position! Insert at binarySearchState.left
          const newRanking = [...ranking];
          newRanking.splice(binarySearchState.left, 0, itemBeingPlaced);
          setRanking(newRanking);
          setItemBeingPlaced(null);
          setBinarySearchState(null);
          
          // Move to next item
          startBinarySearchForNextItem(newRanking, currentItemIndex + 1);
        }
      } else {
        // Search right half (less important = higher index)
        const newLeft = mid + 1;
        
        if (newLeft < binarySearchState.right) {
          // Continue searching
          const newState = { left: newLeft, right: binarySearchState.right };
          setBinarySearchState(newState);
          const newMid = Math.floor((newState.left + newState.right) / 2);
          setCurrentComparison([itemBeingPlaced, ranking[newMid]]);
        } else {
          // Found position! Insert at newLeft
          const newRanking = [...ranking];
          newRanking.splice(newLeft, 0, itemBeingPlaced);
          setRanking(newRanking);
          setItemBeingPlaced(null);
          setBinarySearchState(null);
          
          // Move to next item
          startBinarySearchForNextItem(newRanking, currentItemIndex + 1);
        }
      }
    }
  };

  const handleReset = () => {
    setItems([]);
    setRanking([]);
    setCurrentComparison(null);
    setCurrentItemIndex(0);
    setStep('input');
    setInputValue('');
    setBinarySearchState(null);
    setItemBeingPlaced(null);
    setQuestionsAsked(0);
  };

  return (
    <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        {step === 'input' && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-2">Rank Your Priorities</h1>
              <p className="text-slate-300">Add items you want to rank, then we'll compare them pairwise</p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
                  placeholder="Enter an item to rank..."
                  className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddItem}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Add
                </button>
              </div>

              {items.length > 0 && (
                <div className="space-y-2">
                  <p className="text-slate-300 text-sm">Items to rank ({items.length}):</p>
                  <div className="flex flex-wrap gap-2">
                    {items.map((item) => (
                      <span
                        key={item.id}
                        className="px-3 py-1 bg-slate-700 text-slate-200 rounded-full text-sm flex items-center gap-2"
                      >
                        {item.name}
                        <button
                          onClick={() => setItems(items.filter((i) => i.id !== item.id))}
                          className="text-slate-400 hover:text-red-400 ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {items.length >= 2 && (
                <button
                  onClick={handleStartRanking}
                  className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors mt-4"
                >
                  Start Ranking
                </button>
              )}
            </div>
          </div>
        )}

        {step === 'ranking' && currentComparison && currentComparison[0] && currentComparison[1] && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-2">Which is more important?</h2>
              <p className="text-slate-400">
                {itemBeingPlaced ? `Placing: ${itemBeingPlaced.name}` : 'Initial comparison'}
              </p>
              <p className="text-slate-300 text-sm mt-1">
                Progress: {ranking.length} / {items.length} ranked
              </p>
            </div>

            <SelectionBox
              choice1={{ id: currentComparison[0].id, text: currentComparison[0].name }}
              choice2={{ id: currentComparison[1].id, text: currentComparison[1].name }}
              onSelect={handleSelect}
            />

            {ranking.length > 0 && (
              <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700">
                <p className="text-slate-400 text-sm mb-2">Current ranking:</p>
                <ol className="space-y-1">
                  {ranking.map((item, index) => (
                    <li key={item.id} className="text-slate-300 text-sm">
                      <span className="text-green-400 font-semibold">{index + 1}.</span> {item.name}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <button
              onClick={handleReset}
              className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors"
            >
              Reset & Start Over
            </button>
          </div>
        )}

        {step === 'ranking' && !currentComparison && ranking.length > 0 && (() => {
          const n = items.length;
          const regularSortQuestions = (n * (n - 1)) / 2;
          const questionsSaved = regularSortQuestions - questionsAsked;
          const percentSaved = regularSortQuestions > 0 
            ? ((questionsSaved / regularSortQuestions) * 100).toFixed(1)
            : '0';

          return (
            <div className="space-y-6 text-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Final Ranking Complete!</h2>
                <p className="text-slate-300">Here's your priority ranking:</p>
              </div>

              <div className="p-6 bg-slate-800/50 rounded-lg border border-slate-700">
                <ol className="space-y-2 text-left">
                  {ranking.map((item, index) => (
                    <li key={item.id} className="text-lg text-white">
                      <span className="text-green-400 font-bold">{index + 1}.</span> {item.name}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="p-6 bg-slate-800/50 rounded-lg border border-slate-700 space-y-3">
                <h3 className="text-xl font-bold text-white mb-4">Algorithm Performance</h3>
                <div className="space-y-2 text-left">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Questions asked:</span>
                    <span className="text-white font-semibold">{questionsAsked}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Regular sorting algorithm:</span>
                    <span className="text-white font-semibold">{regularSortQuestions}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-700">
                    <span className="text-slate-300">Questions saved:</span>
                    <span className="text-green-400 font-bold">{percentSaved}%</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                Rank Something Else
              </button>
            </div>
          );
        })()}
      </div>
    </div>
  );
}