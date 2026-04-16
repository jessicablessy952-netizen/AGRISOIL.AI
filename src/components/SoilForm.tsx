import React from 'react';
import { useForm } from 'react-hook-form';
import { SoilData } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sprout, MapPin, Droplets, ThermometerSun, Languages, Camera, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { extractSoilDataFromImage } from '@/lib/gemini';

interface SoilFormProps {
  onSubmit: (data: SoilData) => void;
  isLoading: boolean;
}

export function SoilForm({ onSubmit, isLoading }: SoilFormProps) {
  const { register, handleSubmit, setValue, watch } = useForm<SoilData>({
    defaultValues: {
      ph: 6.5,
      n: 50,
      p: 30,
      k: 40,
      moisture: 20,
      language: 'English',
      season: 'Summer',
      waterAvailability: 'Irrigated'
    }
  });

  const language = watch('language');
  const season = watch('season');
  const waterAvailability = watch('waterAvailability');
  const phValue = watch('ph');
  const nValue = watch('n');
  const pValue = watch('p');
  const kValue = watch('k');
  const moistureValue = watch('moisture');
  const [isSensing, setIsSensing] = React.useState(false);
  const [isScanning, setIsScanning] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    const toastId = toast.loading("Analyzing report image...");

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const extractedData = await extractSoilDataFromImage(base64);
        
        if (Object.keys(extractedData).length > 0) {
          if (extractedData.ph) setValue('ph', extractedData.ph);
          if (extractedData.n) setValue('n', extractedData.n);
          if (extractedData.p) setValue('p', extractedData.p);
          if (extractedData.k) setValue('k', extractedData.k);
          if (extractedData.moisture) setValue('moisture', extractedData.moisture);
          
          toast.success("Data extracted successfully!", { id: toastId });
        } else {
          toast.error("Could not find soil data in image. Please try a clearer photo.", { id: toastId });
        }
        setIsScanning(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
      toast.error("Failed to process image", { id: toastId });
      setIsScanning(false);
    }
  };

  const getValidationStyle = (value: number, min: number, max: number, idealMin: number, idealMax: number) => {
    if (value < min || value > max) return "border-red-500 focus:ring-red-500 bg-red-50/30";
    if (value < idealMin || value > idealMax) return "border-amber-400 focus:ring-amber-400 bg-amber-50/30";
    return "border-olive-200 focus:ring-olive-500 bg-white";
  };

  const getValidationMessage = (value: number, min: number, max: number, idealMin: number, idealMax: number, name: string) => {
    if (value < min || value > max) return `Critical: ${name} is heavily outside normal agricultural limits.`;
    if (value < idealMin) return `Low: ${name} is below ideal levels for most crops.`;
    if (value > idealMax) return `High: ${name} is above ideal levels for most crops.`;
    return null;
  };

  const autoSenseWeather = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsSensing(true);
    const toastId = toast.loading("Sensing weather and soil conditions...");

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      
      try {
        // Fetch weather data from Open-Meteo (Free, no API key required)
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation&timezone=auto`
        );
        const data = await response.json();
        
        if (data.current) {
          const temp = data.current.temperature_2m;
          const humidity = data.current.relative_humidity_2m;
          const rain = data.current.precipitation;

          // Estimate Moisture
          let estimatedMoisture = 20;
          if (rain > 0) estimatedMoisture = 45;
          else if (humidity > 70) estimatedMoisture = 35;
          else if (humidity < 40) estimatedMoisture = 12;
          else estimatedMoisture = 25;

          // Estimate Season
          const month = new Date().getMonth(); // 0-11
          let estimatedSeason = "Summer";
          if (temp < 18) estimatedSeason = "Winter";
          else if (month >= 5 && month <= 8) estimatedSeason = "Monsoon";
          else if (month >= 2 && month <= 4) estimatedSeason = "Spring";

          setValue('moisture', estimatedMoisture);
          setValue('season', estimatedSeason);
          setValue('location', `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          
          toast.success("Weather sensed! Moisture and Season updated.", { id: toastId });
        }
      } catch (error) {
        console.error("Weather sensing error:", error);
        toast.error("Failed to fetch weather data", { id: toastId });
      } finally {
        setIsSensing(false);
      }
    }, (err) => {
      console.error(err);
      toast.error("Location access denied", { id: toastId });
      setIsSensing(false);
    });
  };

  return (
    <Card className="border-olive-200 shadow-sm bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-olive-800 flex items-center gap-2">
          <Sprout className="w-6 h-6 text-olive-500" />
          Soil Test Input
        </CardTitle>
        <CardDescription className="text-olive-600">
          Enter your soil test readings and location details for analysis.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Button
            type="button"
            variant="outline"
            onClick={autoSenseWeather}
            disabled={isSensing}
            className="border-olive-500 text-olive-600 hover:bg-olive-50 py-6 rounded-xl flex items-center justify-center gap-3 group transition-all"
          >
            <ThermometerSun className={cn("w-5 h-5 text-olive-500", isSensing && "animate-pulse")} />
            <div className="text-left">
              <p className="font-bold text-sm">Auto-Sense Weather</p>
              <p className="text-[10px] text-olive-400">Updates Moisture & Season</p>
            </div>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isScanning}
            className="border-olive-500 text-olive-600 hover:bg-olive-50 py-6 rounded-xl flex items-center justify-center gap-3 group transition-all"
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
            {isScanning ? (
              <Loader2 className="w-5 h-5 text-olive-500 animate-spin" />
            ) : (
              <Camera className="w-5 h-5 text-olive-500" />
            )}
            <div className="text-left">
              <p className="font-bold text-sm">Smart Scan Report</p>
              <p className="text-[10px] text-olive-400">Extract NPK & pH from photo</p>
            </div>
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ph" className="text-olive-700">Soil pH (0-14)</Label>
                <Input
                  id="ph"
                  type="number"
                  step="0.1"
                  {...register('ph', { required: true, min: 0, max: 14 })}
                  className={cn("transition-colors", getValidationStyle(phValue, 0, 14, 6.0, 7.5))}
                />
                {getValidationMessage(phValue, 0, 14, 6.0, 7.5, "pH") && (
                  <p className="text-[10px] font-medium text-amber-600 animate-in fade-in slide-in-from-top-1">
                    {getValidationMessage(phValue, 0, 14, 6.0, 7.5, "pH")}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="n" className="text-olive-700 flex items-center justify-between">
                  Nitrogen (N) mg/kg
                  <span className="text-[10px] text-olive-400 uppercase font-bold tracking-tighter">Growth</span>
                </Label>
                <Input
                  id="n"
                  type="number"
                  {...register('n', { required: true })}
                  className={cn("transition-colors", getValidationStyle(nValue, 0, 1000, 280, 560))}
                />
                {getValidationMessage(nValue, 0, 1000, 280, 560, "Nitrogen") && (
                  <p className="text-[10px] font-medium text-amber-600 animate-in fade-in slide-in-from-top-1">
                    {getValidationMessage(nValue, 0, 1000, 280, 560, "Nitrogen")}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="p" className="text-olive-700 flex items-center justify-between">
                  Phosphorus (P) mg/kg
                  <span className="text-[10px] text-olive-400 uppercase font-bold tracking-tighter">Roots</span>
                </Label>
                <Input
                  id="p"
                  type="number"
                  {...register('p', { required: true })}
                  className={cn("transition-colors", getValidationStyle(pValue, 0, 500, 10, 25))}
                />
                {getValidationMessage(pValue, 0, 500, 10, 25, "Phosphorus") && (
                  <p className="text-[10px] font-medium text-amber-600 animate-in fade-in slide-in-from-top-1">
                    {getValidationMessage(pValue, 0, 500, 10, 25, "Phosphorus")}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="k" className="text-olive-700 flex items-center justify-between">
                  Potassium (K) mg/kg
                  <span className="text-[10px] text-olive-400 uppercase font-bold tracking-tighter">Health</span>
                </Label>
                <Input
                  id="k"
                  type="number"
                  {...register('k', { required: true })}
                  className={cn("transition-colors", getValidationStyle(kValue, 0, 1000, 108, 280))}
                />
                {getValidationMessage(kValue, 0, 1000, 108, 280, "Potassium") && (
                  <p className="text-[10px] font-medium text-amber-600 animate-in fade-in slide-in-from-top-1">
                    {getValidationMessage(kValue, 0, 1000, 108, 280, "Potassium")}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="moisture" className="text-olive-700">Moisture Content (%)</Label>
                <Input
                  id="moisture"
                  type="number"
                  {...register('moisture', { required: true, min: 0, max: 100 })}
                  className={cn("transition-colors", getValidationStyle(moistureValue, 0, 100, 15, 60))}
                />
                {getValidationMessage(moistureValue, 0, 100, 15, 60, "Moisture") && (
                  <p className="text-[10px] font-medium text-amber-600 animate-in fade-in slide-in-from-top-1">
                    {getValidationMessage(moistureValue, 0, 100, 15, 60, "Moisture")}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="text-olive-700 flex items-center justify-between">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Location / District</span>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 text-[10px] text-olive-500 hover:text-olive-700 px-2"
                    onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition((position) => {
                          setValue('location', `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
                          toast.success("Location updated");
                        }, (err) => {
                          console.error(err);
                          toast.error("Could not get location. Please enter manually.");
                        });
                      }
                    }}
                  >
                    Get Current
                  </Button>
                </Label>
                <Input
                  id="location"
                  placeholder="e.g. Nashik, Maharashtra"
                  {...register('location', { required: true })}
                  className="border-olive-200 focus:ring-olive-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-olive-700 flex items-center gap-1">
                  <ThermometerSun className="w-4 h-4" /> Current Season
                </Label>
                <Select value={season} onValueChange={(v) => setValue('season', v)}>
                  <SelectTrigger className="border-olive-200">
                    <SelectValue placeholder="Select season" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Summer">Summer (Kharif)</SelectItem>
                    <SelectItem value="Winter">Winter (Rabi)</SelectItem>
                    <SelectItem value="Monsoon">Monsoon</SelectItem>
                    <SelectItem value="Spring">Spring</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-olive-700 flex items-center gap-1">
                  <Droplets className="w-4 h-4" /> Water Availability
                </Label>
                <Select value={waterAvailability} onValueChange={(v) => setValue('waterAvailability', v)}>
                  <SelectTrigger className="border-olive-200">
                    <SelectValue placeholder="Select water status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Irrigated">Irrigated</SelectItem>
                    <SelectItem value="Rain-fed">Rain-fed</SelectItem>
                    <SelectItem value="Scarcity">Water Scarcity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="preferredCrop" className="text-olive-700">Preferred Crop (Optional)</Label>
              <Input
                id="preferredCrop"
                placeholder="e.g. Wheat, Cotton"
                {...register('preferredCrop')}
                className="border-olive-200 focus:ring-olive-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-olive-700 flex items-center gap-1">
                <Languages className="w-4 h-4" /> Output Language
              </Label>
              <Select value={language} onValueChange={(v) => setValue('language', v)}>
                <SelectTrigger className="border-olive-200">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Hindi">Hindi (हिन्दी)</SelectItem>
                  <SelectItem value="Marathi">Marathi (मराठी)</SelectItem>
                  <SelectItem value="Tamil">Tamil (தமிழ்)</SelectItem>
                  <SelectItem value="Telugu">Telugu (తెలుగు)</SelectItem>
                  <SelectItem value="Bengali">Bengali (বাংলা)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-grow bg-olive-500 hover:bg-olive-600 text-white font-medium py-6 rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              {isLoading ? 'Analyzing Soil Health...' : 'Generate Advisory'}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="border-olive-200 text-olive-600 hover:bg-olive-50 py-6 rounded-xl"
              onClick={() => {
                setValue('ph', 6.8);
                setValue('n', 120);
                setValue('p', 45);
                setValue('k', 180);
                setValue('moisture', 25);
                setValue('location', 'Nagpur, Maharashtra');
                setValue('season', 'Winter');
                setValue('waterAvailability', 'Irrigated');
                toast.info("Example data loaded");
              }}
            >
              Use Example Data
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
