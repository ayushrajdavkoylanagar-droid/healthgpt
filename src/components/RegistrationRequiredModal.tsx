import React from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X, UserPlus, AlertCircle } from "lucide-react";

interface RegistrationRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: () => void;
}

const RegistrationRequiredModal: React.FC<RegistrationRequiredModalProps> = ({ 
  isOpen, 
  onClose, 
  onRegister 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-semibold">Registration Required</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <Alert className="mb-6 border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-sm">
            Please register yourself first before starting the health scan. 
            Registration helps us provide personalized health recommendations and track your progress over time.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <Button
            onClick={onRegister}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Register Now
          </Button>
          
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full"
          >
            Maybe Later
          </Button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          Registration is free and takes less than a minute
        </p>
      </div>
    </div>
  );
};

export default RegistrationRequiredModal;
