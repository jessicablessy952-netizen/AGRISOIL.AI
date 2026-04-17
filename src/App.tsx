import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { SoilForm } from '@/components/SoilForm';
import { AnalysisResultDisplay } from '@/components/AnalysisResult';
import { AboutICAR } from '@/components/AboutICAR';
import { Resources } from '@/components/Resources';
import { Support } from '@/components/Support';
import { ChatBot } from '@/components/ChatBot';
import { AgenticAutomation } from '@/components/AgenticAutomation';
import { FertilizerCalculator } from '@/components/FertilizerCalculator';
import { SoilData, AnalysisResult } from '@/types';
import { analyzeSoil } from '@/lib/gemini';
import { Toaster, toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { Sprout, Info, RefreshCw, Github } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import ChatPage from '@/pages/ChatPage';

function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [soilData, setSoilData] = useState<SoilData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [formUpdate, setFormUpdate] = useState<Partial<SoilData> | undefined>(undefined);

  const handleFormSubmit = async (data: SoilData) => {
    setIsLoading(true);
    setError(null);
    setSoilData(data);
    try {
      const analysis = await analyzeSoil(data);
      setResult(analysis);
      toast.success('Analysis completed successfully!');
    } catch (err) {
      console.error(err);
      setError('Failed to analyze soil data. Please try again.');
      toast.error('Analysis failed');
    } finally {
      setIsLoading(false);
    }
  };

  const resetAnalysis = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-center" />
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-olive-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link 
            to="/"
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => {
              resetAnalysis();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="bg-olive-500 p-2 rounded-xl shadow-inner group-hover:bg-olive-600 transition-colors">
              <Sprout className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-olive-900 tracking-tight">AgriSoil AI</h1>
              <p className="text-xs text-olive-500 font-medium uppercase tracking-widest">Soil Health Advisory System</p>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex gap-6 text-sm font-medium text-olive-600">
              <Link 
                to="/"
                onClick={() => {
                  resetAnalysis();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-olive-900 transition-colors cursor-pointer"
              >
                Home
              </Link>
              <button 
                onClick={() => setIsAboutOpen(true)}
                className="hover:text-olive-900 transition-colors cursor-pointer"
              >
                About ICAR
              </button>
              <button 
                onClick={() => setIsResourcesOpen(true)}
                className="hover:text-olive-900 transition-colors cursor-pointer"
              >
                Resources
              </button>
            </nav>
            <Button 
              variant="outline" 
              className="border-olive-200 text-olive-700 hover:bg-olive-50"
              onClick={() => setIsSupportOpen(true)}
            >
              Support
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Intro & Form */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-olive-900 leading-tight">
                Empowering Farmers with <span className="text-olive-500 italic">AI Intelligence</span>
              </h2>
              <p className="text-lg text-olive-700 leading-relaxed">
                Get instant, science-backed crop recommendations and soil health guidance tailored to your specific land and location.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {!result ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <SoilForm 
                    onSubmit={handleFormSubmit} 
                    isLoading={isLoading} 
                    externalData={formUpdate}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="summary-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-olive-500 text-white p-8 rounded-3xl shadow-xl space-y-6 relative overflow-hidden"
                >
                  <div className="absolute -bottom-10 -right-10 opacity-10">
                    <Sprout className="w-48 h-48" />
                  </div>
                  <h3 className="text-2xl font-bold font-serif">Analysis Complete</h3>
                  <p className="text-olive-50 leading-relaxed">
                    We've analyzed your soil data for <strong>{result.recommendations[0].name}</strong> and other suitable crops. 
                    Follow the recommended fertilizer schedule for optimal yield.
                  </p>
                  <Button 
                    onClick={resetAnalysis}
                    className="bg-white text-olive-600 hover:bg-olive-50 w-full rounded-xl py-6 font-bold flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-5 h-5" /> New Analysis
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
                <Info className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                >
                  {soilData && <AnalysisResultDisplay result={result} soilData={soilData} />}
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 p-12 border-2 border-dashed border-olive-200 rounded-3xl bg-olive-50/20">
                  <div className="bg-white p-6 rounded-full shadow-sm">
                    <Sprout className="w-16 h-16 text-olive-300" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-olive-800">Waiting for Data</h3>
                    <p className="text-olive-500 max-w-xs mx-auto">
                      Fill out the form on the left to generate your personalized agricultural advisory.
                    </p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Agentic AI Automation Section */}
        <section className="mt-20 border-t border-olive-100 pt-20">
          <AgenticAutomation onSyncToForm={(data) => setFormUpdate(data)} />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-olive-900 text-olive-200 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sprout className="w-6 h-6 text-olive-400" />
                <span className="text-xl font-bold text-white">AgriSoil AI</span>
              </div>
              <p className="text-sm text-olive-400 leading-relaxed">
                A TENSOR '26 Initiative. Built for smallholder farmers to bridge the gap between soil science and field practice.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-white font-bold">Quick Links</h4>
              <ul className="space-y-2 text-sm text-olive-400">
                <li><button onClick={() => setIsResourcesOpen(true)} className="hover:text-white transition-colors">Soil Testing Guide</button></li>
                <li><button onClick={() => setIsCalculatorOpen(true)} className="hover:text-white transition-colors">Fertilizer Calculator</button></li>
                <li><Link to="/chat" className="hover:text-white transition-colors">Full Chat Assistant</Link></li>
                <li><button onClick={() => setIsAboutOpen(true)} className="hover:text-white transition-colors">About ICAR Guidelines</button></li>
                <li><button onClick={() => setIsSupportOpen(true)} className="hover:text-white transition-colors">Technical Support</button></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-bold">Connect</h4>
              <div className="flex gap-4">
                <a href="#" className="p-2 bg-olive-800 rounded-lg hover:bg-olive-700 transition-colors">
                  <Github className="w-5 h-5" />
                </a>
              </div>
              <p className="text-xs text-olive-500">
                &copy; 2026 Tensor Titans. All rights reserved.
                <br />
                Generated on: 16/04/2026 | PS Identifier: PS45
              </p>
            </div>
          </div>
        </div>
      </footer>

      <AboutICAR open={isAboutOpen} onOpenChange={setIsAboutOpen} />
      <Resources open={isResourcesOpen} onOpenChange={setIsResourcesOpen} />
      <Support open={isSupportOpen} onOpenChange={setIsSupportOpen} />
      <FertilizerCalculator open={isCalculatorOpen} onOpenChange={setIsCalculatorOpen} />
      <ChatBot />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  );
}
