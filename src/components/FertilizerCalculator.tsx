import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Info, RefreshCw, Droplets, Leaf } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

interface FertilizerCalculatorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FertilizerCalculator({ open, onOpenChange }: FertilizerCalculatorProps) {
  const [area, setArea] = useState<string>('1');
  const [unit, setUnit] = useState<'acre' | 'hectare'>('acre');
  const [crop, setCrop] = useState<string>('rice');
  const [n, setN] = useState<string>('');
  const [p, setP] = useState<string>('');
  const [k, setK] = useState<string>('');
  const [result, setResult] = useState<{ urea: number; dap: number; mop: number } | null>(null);

  const calculateFertilizer = () => {
    // Simplified ICAR-based calculation for demonstration
    // Standard NPK requirements (kg/ha) for some common crops
    const requirements: Record<string, { n: number; p: number; k: number }> = {
      rice: { n: 120, p: 60, k: 40 },
      wheat: { n: 100, p: 50, k: 40 },
      maize: { n: 150, p: 75, k: 50 },
      cotton: { n: 100, p: 50, k: 50 },
      sugarcane: { n: 250, p: 100, k: 100 },
    };

    const req = requirements[crop] || requirements.rice;
    const areaVal = parseFloat(area) || 0;
    const multiplier = unit === 'acre' ? 0.4047 : 1; // Convert to hectare for base calculation
    
    // Total nutrients needed in kg
    const totalN = req.n * areaVal * multiplier;
    const totalP = req.p * areaVal * multiplier;
    const totalK = req.k * areaVal * multiplier;

    // Fertilizer nutrient content:
    // DAP: 18% N, 46% P2O5
    // Urea: 46% N
    // MOP: 60% K2O

    const dapNeeded = totalP / 0.46;
    const nFromDap = dapNeeded * 0.18;
    const remainingN = Math.max(0, totalN - nFromDap);
    const ureaNeeded = remainingN / 0.46;
    const mopNeeded = totalK / 0.60;

    setResult({
      urea: Math.round(ureaNeeded),
      dap: Math.round(dapNeeded),
      mop: Math.round(mopNeeded),
    });
  };

  const reset = () => {
    setArea('1');
    setN('');
    setP('');
    setK('');
    setResult(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-olive-100 p-2 rounded-lg">
              <Calculator className="w-5 h-5 text-olive-600" />
            </div>
            <DialogTitle className="text-2xl font-bold text-olive-900">Fertilizer Calculator</DialogTitle>
          </div>
          <DialogDescription className="text-olive-600">
            Calculate the exact amount of Urea, DAP, and MOP required for your land based on crop type and area.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="area">Land Area</Label>
              <div className="flex gap-2">
                <Input 
                  id="area" 
                  type="number" 
                  value={area} 
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="Enter area"
                  className="border-olive-200"
                />
                <Select value={unit} onValueChange={(v: any) => setUnit(v)}>
                  <SelectTrigger className="w-[120px] border-olive-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="acre">Acres</SelectItem>
                    <SelectItem value="hectare">Hectares</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="crop">Crop Type</Label>
              <Select value={crop} onValueChange={setCrop}>
                <SelectTrigger id="crop" className="border-olive-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rice">Rice (Paddy)</SelectItem>
                  <SelectItem value="wheat">Wheat</SelectItem>
                  <SelectItem value="maize">Maize</SelectItem>
                  <SelectItem value="cotton">Cotton</SelectItem>
                  <SelectItem value="sugarcane">Sugarcane</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-olive-50/50 p-4 rounded-xl border border-olive-100 space-y-4">
            <div className="flex items-center gap-2 text-olive-800 font-semibold text-sm">
              <Info className="w-4 h-4" />
              <span>Optional: Soil Test Values (mg/kg)</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-olive-600">Nitrogen (N)</Label>
                <Input value={n} onChange={(e) => setN(e.target.value)} placeholder="N" className="h-9 border-olive-200" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-olive-600">Phosphorus (P)</Label>
                <Input value={p} onChange={(e) => setP(e.target.value)} placeholder="P" className="h-9 border-olive-200" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-olive-600">Potassium (K)</Label>
                <Input value={k} onChange={(e) => setK(e.target.value)} placeholder="K" className="h-9 border-olive-200" />
              </div>
            </div>
          </div>

          <Button 
            onClick={calculateFertilizer}
            className="bg-olive-600 hover:bg-olive-700 text-white py-6 rounded-xl font-bold text-lg shadow-lg shadow-olive-200 transition-all"
          >
            Calculate Requirements
          </Button>

          {result && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h4 className="font-bold text-olive-900 flex items-center gap-2">
                <Leaf className="w-4 h-4 text-olive-500" />
                Recommended Fertilizer Dose
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <Card className="border-olive-200 bg-white shadow-sm">
                  <CardContent className="p-4 text-center space-y-1">
                    <p className="text-xs font-medium text-olive-500 uppercase">Urea</p>
                    <p className="text-2xl font-bold text-olive-700">{result.urea} <span className="text-xs font-normal">kg</span></p>
                  </CardContent>
                </Card>
                <Card className="border-olive-200 bg-white shadow-sm">
                  <CardContent className="p-4 text-center space-y-1">
                    <p className="text-xs font-medium text-olive-500 uppercase">DAP</p>
                    <p className="text-2xl font-bold text-olive-700">{result.dap} <span className="text-xs font-normal">kg</span></p>
                  </CardContent>
                </Card>
                <Card className="border-olive-200 bg-white shadow-sm">
                  <CardContent className="p-4 text-center space-y-1">
                    <p className="text-xs font-medium text-olive-500 uppercase">MOP</p>
                    <p className="text-2xl font-bold text-olive-700">{result.mop} <span className="text-xs font-normal">kg</span></p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3">
                <Droplets className="w-5 h-5 text-blue-500 shrink-0" />
                <div className="text-xs text-blue-800 space-y-1">
                  <p className="font-bold">Application Tip:</p>
                  <p>Apply DAP and MOP as basal dose (during sowing). Apply Urea in 2-3 split doses for better nutrient absorption.</p>
                </div>
              </div>

              <Button variant="ghost" onClick={reset} className="w-full text-olive-500 hover:text-olive-700 hover:bg-olive-50 flex items-center gap-2">
                <RefreshCw className="w-4 h-4" /> Reset Calculator
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
