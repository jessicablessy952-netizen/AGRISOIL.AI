import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Send, User, Bot, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { chatWithAI } from '@/lib/gemini';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'model';
  parts: string;
}

export default function ChatPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', parts: "Namaste! I am AgriBot. I'm dedicated to helping you with your farming needs in this full-screen view. How can I assist you today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      });
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', parts: userMessage }]);
    setIsLoading(true);

    try {
      const history = messages.slice(1);
      const response = await chatWithAI(userMessage, history);
      setMessages(prev => [...prev, { role: 'model', parts: response }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-olive-50 flex flex-col">
      {/* Header */}
      <header className="bg-olive-600 text-white p-4 shadow-md shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-bold text-lg">AgriBot Full Assistant</h1>
                <p className="text-xs text-olive-100 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Always here to help you grow
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-grow max-w-4xl w-full mx-auto flex flex-col p-4 sm:p-6 overflow-hidden">
        <div className="bg-white rounded-3xl shadow-xl border border-olive-100 flex flex-col flex-grow overflow-hidden">
          <ScrollArea className="flex-grow p-6" viewportRef={scrollRef}>
            <div className="space-y-6">
              {messages.map((msg, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={idx} 
                  className={cn(
                    "flex gap-4 max-w-[80%]",
                    msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                  )}
                >
                  <div className={cn(
                    "shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm",
                    msg.role === 'user' ? "bg-olive-100 text-olive-600" : "bg-olive-600 text-white"
                  )}>
                    {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                  </div>
                  <div className={cn(
                    "p-4 rounded-2xl text-base leading-relaxed shadow-sm",
                    msg.role === 'user' 
                      ? "bg-olive-50 border border-olive-100 text-olive-900 rounded-tr-none" 
                      : "bg-olive-600 text-white rounded-tl-none"
                  )}>
                    <div className="markdown-body">
                      <ReactMarkdown>{msg.parts}</ReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex gap-4 mr-auto max-w-[80%]">
                  <div className="shrink-0 w-10 h-10 rounded-2xl bg-olive-600 text-white flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="bg-olive-100 p-4 rounded-2xl rounded-tl-none flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin text-olive-600" />
                    <span className="text-sm text-olive-600 font-medium">AgriBot is thinking...</span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-6 bg-olive-50/50 border-t border-olive-100">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex gap-3 max-w-3xl mx-auto"
            >
              <Input 
                placeholder="Type your agricultural question here..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="h-14 px-6 rounded-2xl border-olive-200 focus:ring-olive-500 text-lg bg-white shadow-inner"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                size="icon" 
                className="h-14 w-14 rounded-2xl bg-olive-600 hover:bg-olive-700 shadow-lg shadow-olive-200 shrink-0"
                disabled={!input.trim() || isLoading}
              >
                <Send className="w-6 h-6" />
              </Button>
            </form>
            <div className="mt-4 flex justify-center gap-6 text-[10px] text-olive-400 font-medium uppercase tracking-wider">
              <span>Soil Health</span>
              <span>•</span>
              <span>Crop Protection</span>
              <span>•</span>
              <span>Fertilizer Optimization</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-olive-400 text-xs shrink-0">
        © 2024 AgriSoil AI • ICAR Guidelines Integrated
      </footer>
    </div>
  );
}
