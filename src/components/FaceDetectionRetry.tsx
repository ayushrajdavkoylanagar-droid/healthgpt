import { motion } from 'framer-motion';
import { X, Camera, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FaceDetectionRetryProps {
  isOpen: boolean;
  onRetry: () => void;
  onCancel: () => void;
}

const FaceDetectionRetry: React.FC<FaceDetectionRetryProps> = ({
  isOpen,
  onRetry,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-md mx-auto bg-card rounded-2xl shadow-2xl overflow-hidden p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
          aria-label="Close"
        >
          <X size={20} className="text-muted-foreground" />
        </button>

        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 mb-4"
          >
            <AlertCircle className="w-8 h-8 text-yellow-600" />
          </motion.div>
          
          <h2 className="text-2xl font-display font-bold text-secondary mb-2">Try Again</h2>
          <p className="text-muted-foreground mb-6">
            Absolutely no face was detected during the entire 20-second scan. Please ensure your face is clearly visible and try again.
          </p>

          <div className="space-y-3">
            <Button
              onClick={onRetry}
              className="w-full"
              size="lg"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            
            <Button
              onClick={onCancel}
              variant="outline"
              className="w-full"
            >
              Cancel
            </Button>
          </div>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-start space-x-3">
              <Camera className="w-5 h-5 text-primary mt-0.5" />
              <div className="text-left text-sm text-muted-foreground">
                <p className="font-medium mb-1">Tips for better detection:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Ensure good lighting on your face</li>
                  <li>• Keep your face centered in the camera</li>
                  <li>• Remove glasses or accessories if possible</li>
                  <li>• Stay still during the 20-second scan</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FaceDetectionRetry;
