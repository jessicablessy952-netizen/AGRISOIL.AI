import React from 'react';
import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export function ChatBot() {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/chat')}
        className={cn(
          "bg-olive-600 text-white p-4 rounded-full shadow-xl hover:bg-olive-700 transition-all flex items-center gap-2 group"
        )}
      >
        <MessageCircle className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-medium whitespace-nowrap">
          Ask AgriBot
        </span>
      </motion.button>
    </div>
  );
}
