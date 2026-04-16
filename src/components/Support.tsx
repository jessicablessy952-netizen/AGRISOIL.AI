import React from 'react';
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
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageSquare, Phone, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';

interface SupportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Support({ open, onOpenChange }: SupportProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! Our team will get back to you soon.");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] border-olive-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-olive-900 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-olive-600" />
            Support & Contact
          </DialogTitle>
          <DialogDescription className="text-olive-600">
            Need help or have suggestions? We're here to assist you.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-bold text-olive-900 text-sm uppercase tracking-wider">Contact Info</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-olive-700">
                  <div className="p-2 bg-olive-50 rounded-lg">
                    <Mail className="w-4 h-4 text-olive-600" />
                  </div>
                  <span>support@agrisoil.ai</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-olive-700">
                  <div className="p-2 bg-olive-50 rounded-lg">
                    <Phone className="w-4 h-4 text-olive-600" />
                  </div>
                  <span>+91 1800-AGRICULTURE</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-olive-700">
                  <div className="p-2 bg-olive-50 rounded-lg">
                    <MessageSquare className="w-4 h-4 text-olive-600" />
                  </div>
                  <span>Live Chat (9 AM - 6 PM)</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-olive-50/50 rounded-2xl border border-olive-100">
              <h5 className="font-bold text-olive-800 text-xs mb-2">Tensor Titans Support</h5>
              <p className="text-[11px] text-olive-600 leading-relaxed">
                AgriSoil AI is part of the TENSOR '26 initiative. For technical issues related to the platform, please contact the Tensor Titans development team.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <h4 className="font-bold text-olive-900 text-sm uppercase tracking-wider">Send a Message</h4>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="email" className="text-xs text-olive-700">Email Address</Label>
                <Input id="email" type="email" placeholder="your@email.com" required className="border-olive-200" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="subject" className="text-xs text-olive-700">Subject</Label>
                <Input id="subject" placeholder="How can we help?" required className="border-olive-200" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="message" className="text-xs text-olive-700">Message</Label>
                <Textarea id="message" placeholder="Describe your issue..." required className="min-h-[100px] border-olive-200" />
              </div>
              <Button type="submit" className="w-full bg-olive-600 hover:bg-olive-700 text-white">
                Send Message
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
