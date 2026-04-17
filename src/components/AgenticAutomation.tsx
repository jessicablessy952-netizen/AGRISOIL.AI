import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Droplets, Zap, Activity, MessageSquare, Power, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AgentLog {
  id: string;
  agent: 'Sensor' | 'Motor';
  message: string;
  type: 'info' | 'action' | 'alert' | 'success';
  timestamp: string;
}

export function AgenticAutomation() {
  const [moisture, setMoisture] = useState(45);
  const [motorStatus, setMotorStatus] = useState<'OFF' | 'ON'>('OFF');
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const addLog = (agent: 'Sensor' | 'Motor', message: string, type: AgentLog['type']) => {
    const newLog: AgentLog = {
      id: Math.random().toString(36).substring(7),
      agent,
      message,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
    setLogs(prev => [newLog, ...prev].slice(0, 10));
  };

  // Agentic Loop
  useEffect(() => {
    if (!isAutoMode) return;

    const interval = setInterval(() => {
      // 1. Sensor Agent monitors moisture
      setMoisture(prev => {
        if (motorStatus === 'ON') {
          const next = Math.min(prev + 2, 85);
          return next;
        } else {
          const next = Math.max(prev - 0.5, 15);
          return next;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isAutoMode, motorStatus]);

  // Agent Intelligence Layer
  useEffect(() => {
    if (!isAutoMode) return;

    // Sensor Agent Reasoning
    if (moisture < 30 && motorStatus === 'OFF') {
      addLog('Sensor', `Critical moisture detected: ${moisture.toFixed(1)}%. Initiating request to Motor Agent.`, 'alert');
      
      // Artificial delay to simulate "passing information"
      setTimeout(() => {
        addLog('Motor', `Signal received from Sensor Agent. Analyzing soil requirements...`, 'info');
        setTimeout(() => {
          addLog('Motor', `Decision: Irrigation required. Activating Motor.`, 'action');
          setMotorStatus('ON');
        }, 1500);
      }, 1000);
    }

    if (moisture > 75 && motorStatus === 'ON') {
      addLog('Sensor', `Optimal moisture reached: ${moisture.toFixed(1)}%. Signaling Motor Agent to standby.`, 'success');
      
      setTimeout(() => {
        addLog('Motor', `Threshold met. Deactivating Motor to prevent over-irrigation.`, 'action');
        setMotorStatus('OFF');
      }, 1000);
    }
  }, [moisture, isAutoMode, motorStatus]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold font-sans tracking-tight text-olive-900 flex items-center gap-2">
            <Cpu className="w-6 h-6 text-olive-600" />
            Agentic AI Control System
          </h2>
          <p className="text-sm text-olive-600/80">Autonomous sensor-to-motor synchronization</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn("text-xs font-mono px-2 py-1 rounded-full border", 
            isAutoMode ? "bg-green-50 border-green-200 text-green-700" : "bg-gray-50 border-gray-200 text-gray-500")}>
            {isAutoMode ? "AUTONOMOUS MODE ACTIVE" : "MANUAL OVERRIDE"}
          </span>
          <button
            onClick={() => setIsAutoMode(!isAutoMode)}
            className={cn("px-4 py-2 rounded-lg font-medium transition-all shadow-sm",
              isAutoMode ? "bg-red-500 text-white hover:bg-red-600" : "bg-olive-600 text-white hover:bg-olive-700")}
          >
            {isAutoMode ? "Stop Agents" : "Initialize Agents"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sensor Agent Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border-2 border-olive-100 rounded-3xl p-6 shadow-sm hover:border-olive-200 transition-colors relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Activity className="w-24 h-24 text-olive-900" />
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 rounded-xl">
                <Droplets className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-bold text-olive-900">Virtual Sensor Agent</h3>
                <p className="text-[10px] uppercase tracking-wider text-olive-400 font-mono">Monitoring Real-time</p>
              </div>
            </div>

            <div className="flex items-end gap-2 mb-4">
              <span className="text-5xl font-mono font-medium text-olive-950 tracking-tighter">
                {moisture.toFixed(1)}
              </span>
              <span className="text-xl font-medium text-olive-400 pb-1">%</span>
            </div>

            <div className="w-full bg-olive-50 h-3 rounded-full overflow-hidden">
              <motion.div 
                className={cn("h-full transition-colors", 
                  moisture < 30 ? "bg-red-400" : moisture > 75 ? "bg-blue-400" : "bg-green-400"
                )}
                initial={{ width: 0 }}
                animate={{ width: `${moisture}%` }}
              />
            </div>
            
            <p className="mt-4 text-xs text-olive-500 leading-relaxed italic">
              "Observing soil water content. Ready to signal motor agent if thresholds break."
            </p>
          </div>

          {/* Communication Pipe */}
          <div className="flex flex-col items-center justify-center py-2 h-12">
            <AnimatePresence>
              {isAutoMode && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-px h-6 bg-dashed border-l-2 border-dashed border-olive-300" />
                  <Zap className={cn("w-4 h-4 my-1", motorStatus === 'ON' ? "text-amber-500" : "text-olive-300")} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Motor Agent Card */}
          <div className="bg-white border-2 border-olive-100 rounded-3xl p-6 shadow-sm hover:border-olive-200 transition-colors relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Power className="w-24 h-24 text-olive-900" />
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 rounded-xl">
                  <Zap className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-bold text-olive-900">Motor Control Agent</h3>
                  <p className="text-[10px] uppercase tracking-wider text-olive-400 font-mono">Actuator Interface</p>
                </div>
              </div>
              <div className={cn("p-2 rounded-full", motorStatus === 'ON' ? "bg-green-100 animate-pulse" : "bg-gray-100")}>
                <Power className={cn("w-4 h-4", motorStatus === 'ON' ? "text-green-600" : "text-gray-400")} />
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-semibold text-olive-400 uppercase tracking-widest">Pump Status</span>
              <span className={cn("text-2xl font-mono font-bold tracking-tight", 
                motorStatus === 'ON' ? "text-green-600" : "text-olive-900")}>
                {motorStatus}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setMotorStatus('ON')}
                disabled={isAutoMode}
                className={cn("py-2 px-3 rounded-xl border text-[10px] font-bold uppercase transition-all",
                  motorStatus === 'ON' ? "bg-green-500 border-green-600 text-white" : "border-olive-200 text-olive-400 hover:border-olive-400"
                )}
              >
                Manual ON
              </button>
              <button 
                onClick={() => setMotorStatus('OFF')}
                disabled={isAutoMode}
                className={cn("py-2 px-3 rounded-xl border text-[10px] font-bold uppercase transition-all",
                  motorStatus === 'OFF' ? "bg-gray-500 border-gray-600 text-white" : "border-olive-200 text-olive-400 hover:border-olive-400"
                )}
              >
                Manual OFF
              </button>
            </div>
          </div>
        </div>

        {/* Agentic Reasoning Logs */}
        <div className="lg:col-span-8 flex flex-col">
          <div className="bg-olive-950 rounded-3xl p-6 shadow-xl flex-1 flex flex-col font-mono relative overflow-hidden border border-olive-800/50">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-olive-400" />
                <span className="text-[10px] uppercase tracking-widest text-olive-400 font-bold">Agent Reasoning Console</span>
              </div>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-red-800/50" />
                <div className="w-2 h-2 rounded-full bg-amber-800/50" />
                <div className="w-2 h-2 rounded-full bg-green-800/50" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar relative z-10 min-h-[400px]" ref={scrollRef}>
              <AnimatePresence mode="popLayout">
                {logs.length === 0 && !isAutoMode && (
                  <div className="h-full flex flex-col items-center justify-center text-olive-700/50 space-y-4">
                    <Activity className="w-12 h-12" />
                    <p className="text-sm">Agents offline. Initialize system to begin monitoring.</p>
                  </div>
                )}
                {logs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex gap-3 text-xs border-l-2 border-olive-800 pl-3 py-1"
                  >
                    <span className="text-olive-600 min-w-[70px] flex-shrink-0">[{log.timestamp}]</span>
                    <span className={cn("font-bold min-w-[60px] flex-shrink-0", 
                      log.agent === 'Sensor' ? "text-blue-400" : "text-amber-400")}>
                      {log.agent}:
                    </span>
                    <span className={cn("flex-1", 
                       log.type === 'alert' ? "text-red-300" : 
                       log.type === 'action' ? "text-green-300 underline underline-offset-4" : 
                       log.type === 'success' ? "text-emerald-400 font-bold" : 
                       "text-olive-200"
                    )}>
                      {log.message}
                    </span>
                    {log.type === 'alert' && <AlertTriangle className="w-3 h-3 text-red-500 animate-pulse" />}
                    {log.type === 'success' && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2 text-[10px] text-olive-500">
                <Zap className="w-3 h-3" />
                <span>Inter-Agent Link: <span className="text-green-500">Secure</span></span>
              </div>
              <div className="animate-pulse flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-[10px] text-green-500 font-bold uppercase">Live</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
