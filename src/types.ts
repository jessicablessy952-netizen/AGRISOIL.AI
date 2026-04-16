export interface SoilData {
  ph: number;
  n: number;
  p: number;
  k: number;
  moisture: number;
  location: string;
  season: string;
  waterAvailability: string;
  preferredCrop?: string;
  language: string;
}

export interface CropRecommendation {
  name: string;
  suitabilityScore: number;
  reason: string;
}

export interface FertilizerSchedule {
  type: string;
  dosage: string;
  timing: string;
}

export interface SoilCorrection {
  action: string;
  details: string;
}

export interface AnalysisResult {
  recommendations: CropRecommendation[];
  fertilizerSchedule: FertilizerSchedule[];
  soilCorrections: SoilCorrection[];
  advisory: string;
}
