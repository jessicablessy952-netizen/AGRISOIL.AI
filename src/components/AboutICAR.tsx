import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Landmark, Award, BookOpen, Users } from 'lucide-react';

interface AboutICARProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AboutICAR({ open, onOpenChange }: AboutICARProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto border-olive-200">
        <DialogHeader>
          <DialogTitle className="text-3xl font-serif text-olive-900 flex items-center gap-2">
            <Landmark className="w-8 h-8 text-olive-600" />
            About ICAR
          </DialogTitle>
          <DialogDescription className="text-olive-600 text-lg">
            Indian Council of Agricultural Research
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="prose prose-olive max-w-none">
            <p className="text-olive-800 leading-relaxed">
              The Indian Council of Agricultural Research (ICAR) is an autonomous organisation under the Department of Agricultural Research and Education (DARE), Ministry of Agriculture and Farmers Welfare, Government of India.
            </p>
            <p className="text-olive-800 leading-relaxed">
              Formerly known as the Imperial Council of Agricultural Research, it was established on 16 July 1929 as a registered society under the Societies Registration Act, 1860 in pursuance of the report of the Royal Commission on Agriculture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-olive-50 rounded-2xl border border-olive-100 space-y-2">
              <div className="flex items-center gap-2 text-olive-700 font-bold">
                <Award className="w-5 h-5" />
                <span>Global Leader</span>
              </div>
              <p className="text-sm text-olive-600">
                The ICAR is the largest network of agricultural research and education institutes in the world.
              </p>
            </div>
            
            <div className="p-4 bg-olive-50 rounded-2xl border border-olive-100 space-y-2">
              <div className="flex items-center gap-2 text-olive-700 font-bold">
                <BookOpen className="w-5 h-5" />
                <span>Research Focus</span>
              </div>
              <p className="text-sm text-olive-600">
                Coordinates, guides and manages research and education in agriculture including horticulture, fisheries and animal sciences.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-olive-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-olive-600" />
              Key Achievements
            </h4>
            <ul className="list-disc list-inside text-sm text-olive-700 space-y-1 ml-2">
              <li>Spearheaded the Green Revolution in India</li>
              <li>Developed thousands of high-yielding crop varieties</li>
              <li>Advanced dryland agriculture techniques</li>
              <li>Pioneered integrated pest management systems</li>
              <li>Established a vast network of Krishi Vigyan Kendras (KVKs)</li>
            </ul>
          </div>

          <div className="pt-4 border-t border-olive-100">
            <p className="text-xs text-olive-500 italic">
              AgriSoil AI utilizes soil health parameters and nutrient management guidelines aligned with ICAR research to provide accurate advisory to farmers.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
