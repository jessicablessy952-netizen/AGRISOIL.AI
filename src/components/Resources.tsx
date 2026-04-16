import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExternalLink, FileText, Video, Newspaper } from 'lucide-react';

interface ResourcesProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Resources({ open, onOpenChange }: ResourcesProps) {
  const resourceLinks = [
    {
      title: "ICAR Soil Health Portal",
      description: "Official portal for soil health cards and national soil data.",
      icon: <FileText className="w-5 h-5 text-blue-500" />,
      url: "https://soilhealth.dac.gov.in/"
    },
    {
      title: "Kisan Suvidha",
      description: "One-stop portal for farmers to get info on weather, market prices, and agro-advisories.",
      icon: <Newspaper className="w-5 h-5 text-green-500" />,
      url: "https://kisansuvidha.gov.in/"
    },
    {
      title: "Agri-Expert Videos",
      description: "Educational videos on modern farming techniques and organic practices.",
      icon: <Video className="w-5 h-5 text-red-500" />,
      url: "https://www.youtube.com/user/icarindia"
    },
    {
      title: "Fertilizer Calculator",
      description: "Detailed guide on calculating nutrient requirements for various crops.",
      icon: <ExternalLink className="w-5 h-5 text-purple-500" />,
      url: "https://www.icar.org.in/"
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] border-olive-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-olive-900">Farmer Resources</DialogTitle>
          <DialogDescription className="text-olive-600">
            Helpful links and documents to improve your farm's productivity.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {resourceLinks.map((link, index) => (
            <a 
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 p-4 rounded-2xl border border-olive-100 hover:bg-olive-50 hover:border-olive-200 transition-all group"
            >
              <div className="p-2 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                {link.icon}
              </div>
              <div className="flex-grow">
                <h4 className="font-bold text-olive-900 flex items-center gap-2">
                  {link.title}
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h4>
                <p className="text-xs text-olive-600 leading-relaxed">
                  {link.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
