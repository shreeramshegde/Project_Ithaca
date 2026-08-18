import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitAnswer, submitPreRound, useHint } from '../api';
import { Lightbulb, Send, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function QuestionCard({ question, isPreRound, onAnswered, disabled, forceRetryOnWrong }) {
  const [answerStr, setAnswerStr] = useState('');
  const [localError, setLocalError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);
  const [hintText, setHintText] = useState('');

  const queryClient = useQueryClient();

  const mutationFn = isPreRound ? submitPreRound : submitAnswer;
  
  const submitMutation = useMutation({
    mutationFn,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['gameState'] });
      
      if (res.is_correct) {
        alert(res.message);
        onAnswered(true, question.id);
      } else {
        setLocalError(res.message);
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
        
        if (!forceRetryOnWrong) {
          // If we don't force retry, mark it as answered (wrongly)
          alert(res.message + "\nMoving to next question.");
          onAnswered(false, question.id);
        }
      }
    },
    onError: (err) => {
      setLocalError(err.response?.data?.message || 'Error submitting answer');
      if (err.response?.status === 400 && err.response?.data?.message.includes('already')) {
         onAnswered(true, question.id); // Fast forward if backend says already answered
      }
    }
  });

  const hintMutation = useMutation({
    mutationFn: useHint,
    onSuccess: (res) => {
      setHintText(res.hint);
      queryClient.invalidateQueries({ queryKey: ['gameState'] });
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to get hint');
      setShowHintModal(false);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!answerStr.trim()) return;
    submitMutation.mutate({ question_id: question.id, answer_string: answerStr, selected_option: answerStr });
  };

  const handleHintClick = () => {
    if (window.confirm("Use a standard hint for this question?")) {
      setShowHintModal(true);
      hintMutation.mutate(question.id);
    }
  };

  if (disabled) {
    return <div className="p-6 bg-slate-800 rounded-lg border border-slate-700 opacity-50">Question Completed</div>;
  }

  return (
    <motion.div 
      className={`p-6 bg-slate-800 rounded-lg border-2 shadow-2xl relative ${isPreRound ? 'border-odyssey-gold' : 'border-slate-600'} ${isShaking ? 'shake border-red-500' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white">
          {isPreRound ? '🔥 Pre-Round Guardian' : `Question Level ${question.difficulty_level}`}
        </h3>
        <button 
          onClick={handleHintClick}
          className="text-yellow-400 hover:text-yellow-300 transition"
          title="Use Hint"
        >
          <Lightbulb size={24} />
        </button>
      </div>

      <p className="text-lg mb-6 text-slate-200">{question.question_text}</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {question.format === 'MCQ' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {question.options?.map(opt => (
              <button
                type="button"
                key={opt}
                onClick={() => setAnswerStr(opt)}
                className={`p-3 rounded-md text-left transition-all ${answerStr === opt ? 'bg-odyssey-blue text-white ring-2 ring-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-200'}`}
              >
                {opt}
              </button>
            ))}
          </div>
        ) : (
          <input 
            type="text" 
            value={answerStr}
            onChange={e => setAnswerStr(e.target.value)}
            placeholder="Type your answer here..."
            className="p-3 rounded-md bg-slate-700 text-white border border-slate-600 focus:border-odyssey-blue focus:outline-none"
          />
        )}

        {localError && (
          <div className="flex items-center gap-2 text-red-400 bg-red-900/20 p-3 rounded">
            <AlertTriangle size={18} />
            <span>{localError}</span>
          </div>
        )}

        <button 
          type="submit" 
          disabled={submitMutation.isPending || !answerStr}
          className="mt-2 flex items-center justify-center gap-2 bg-odyssey-blue hover:bg-blue-600 disabled:opacity-50 text-white py-3 px-6 rounded-md font-bold transition-all"
        >
          {submitMutation.isPending ? 'Submitting...' : 'Submit Answer'}
          <Send size={18} />
        </button>
      </form>

      {/* Hint Modal Pop-up */}
      {showHintModal && hintText && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/80 rounded-lg p-6">
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-slate-800 border-2 border-yellow-500 p-6 rounded-xl text-center shadow-2xl max-w-sm">
            <Lightbulb size={48} className="text-yellow-400 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-yellow-400 mb-2">Divine Hint</h4>
            <p className="text-slate-200 text-lg mb-6">{hintText}</p>
            <button onClick={() => setShowHintModal(false)} className="bg-slate-700 hover:bg-slate-600 px-6 py-2 rounded text-white">Close</button>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
