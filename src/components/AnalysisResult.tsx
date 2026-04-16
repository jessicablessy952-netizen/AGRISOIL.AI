import React from 'react';
import { AnalysisResult, SoilData } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'motion/react';
import { CheckCircle2, AlertTriangle, Calendar, Beaker, Leaf } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

interface AnalysisResultDisplayProps {
  result: AnalysisResult;
  soilData: SoilData;
}

export function AnalysisResultDisplay({ result, soilData }: AnalysisResultDisplayProps) {
  const nutrientData = [
    { name: 'Nitrogen (N)', value: soilData.n, fill: '#22c55e' },
    { name: 'Phosphorus (P)', value: soilData.p, fill: '#3b82f6' },
    { name: 'Potassium (K)', value: soilData.k, fill: '#f59e0b' },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-olive-200 shadow-md bg-white/90">
          <CardHeader className="bg-olive-50/50 rounded-t-xl">
            <CardTitle className="text-2xl text-olive-800 flex items-center gap-2">
              <Beaker className="w-6 h-6 text-olive-500" />
              Soil Nutrient Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={nutrientData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} label={{ value: 'mg/kg', angle: -90, position: 'insideLeft' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      cursor={{ fill: '#f8fafc' }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={60} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col justify-center space-y-6">
                <div className="p-6 rounded-2xl bg-olive-50/50 border border-olive-100 text-center">
                  <p className="text-sm font-medium text-olive-600 uppercase tracking-wider mb-2">Soil pH Level</p>
                  <div className="text-5xl font-bold text-olive-900 mb-2">{soilData.ph}</div>
                  <Badge className={cn(
                    "px-4 py-1",
                    soilData.ph < 6 ? "bg-amber-500" : soilData.ph > 7.5 ? "bg-blue-500" : "bg-green-500"
                  )}>
                    {soilData.ph < 6 ? "Acidic" : soilData.ph > 7.5 ? "Alkaline" : "Neutral"}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-olive-100 bg-white">
                    <p className="text-xs text-olive-500 font-medium mb-1">Moisture</p>
                    <p className="text-xl font-bold text-olive-800">{soilData.moisture}%</p>
                  </div>
                  <div className="p-4 rounded-xl border border-olive-100 bg-white">
                    <p className="text-xs text-olive-500 font-medium mb-1">Location</p>
                    <p className="text-sm font-bold text-olive-800 truncate">{soilData.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-olive-200 shadow-md bg-white/90">
          <CardHeader className="bg-olive-50/50 rounded-t-xl">
            <CardTitle className="text-2xl text-olive-800 flex items-center gap-2">
              <Leaf className="w-6 h-6 text-olive-500" />
              Top Crop Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {result.recommendations.map((crop, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-olive-100 bg-olive-50/30 hover:bg-olive-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-serif text-xl font-bold text-olive-900">{crop.name}</h3>
                    <Badge variant="outline" className="bg-white text-olive-600 border-olive-200">
                      {crop.suitabilityScore}% Match
                    </Badge>
                  </div>
                  <p className="text-sm text-olive-700 leading-relaxed">{crop.reason}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-olive-200 shadow-md h-full">
            <CardHeader className="bg-olive-50/50 rounded-t-xl">
              <CardTitle className="text-xl text-olive-800 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-olive-500" />
                Fertilizer Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  {result.fertilizerSchedule.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className="mt-1">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <p className="font-bold text-olive-900">{item.type}</p>
                        <p className="text-sm text-olive-600">Dosage: {item.dosage}</p>
                        <p className="text-xs text-olive-500 italic">Timing: {item.timing}</p>
                        {idx < result.fertilizerSchedule.length - 1 && <Separator className="mt-4 bg-olive-100" />}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-olive-200 shadow-md h-full">
            <CardHeader className="bg-olive-50/50 rounded-t-xl">
              <CardTitle className="text-xl text-olive-800 flex items-center gap-2">
                <Beaker className="w-5 h-5 text-olive-500" />
                Soil Correction Steps
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  {result.soilCorrections.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className="mt-1">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                      </div>
                      <div>
                        <p className="font-bold text-olive-900">{item.action}</p>
                        <p className="text-sm text-olive-700">{item.details}</p>
                        {idx < result.soilCorrections.length - 1 && <Separator className="mt-4 bg-olive-100" />}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="border-olive-300 bg-olive-100/50 shadow-lg overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sprout className="w-24 h-24 text-olive-900" />
          </div>
          <CardHeader>
            <CardTitle className="text-olive-900 font-serif italic">Farmer's Advisory</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-olive-800 leading-relaxed font-medium">
              "{result.advisory}"
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function Sprout(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 20h10" />
      <path d="M10 20c5.5 0 5.5-10 10-10" />
      <path d="M10 20c0-5.5 10-5.5 10-10" />
      <path d="M12 20V4" />
      <path d="M12 4c-5.5 0-5.5 10-10 10" />
      <path d="M12 4c0 5.5-10 5.5-10 10" />
    </svg>
  );
}
