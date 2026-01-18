import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sun, Camera, Hand, Heart, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

type Step = "prepare" | "camera" | "capture" | "complete";

const ScanModal = ({ isOpen, onClose, onComplete }: ScanModalProps) => {
  const [step, setStep] = useState<Step>("prepare");
  const [timer, setTimer] = useState(20);
  const [hasPermission, setHasPermission] = useState(false);

  const resetModal = useCallback(() => {
    setStep("prepare");
    setTimer(20);
    setHasPermission(false);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      resetModal();
    }
  }, [isOpen, resetModal]);

  useEffect(() => {
    if (step === "capture" && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (step === "capture" && timer === 0) {
      setStep("complete");
    }
  }, [step, timer]);

  const handlePermissionRequest = () => {
    // Simulate permission request
    setTimeout(() => {
      setHasPermission(true);
    }, 500);
  };

  const handleStartCapture = () => {
    setStep("capture");
  };

  const handleComplete = () => {
    onComplete();
    onClose();
  };

  const prepareItems = [
    { icon: Hand, text: "Sit still and relax" },
    { icon: Sun, text: "Ensure good lighting" },
    { icon: Camera, text: "Keep camera steady" },
    { icon: Heart, text: "Breathe normally" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-md bg-card rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
              aria-label="Close"
            >
              <X size={20} className="text-muted-foreground" />
            </button>

            {/* Step: Prepare */}
            {step === "prepare" && (
              <div className="p-8">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <Heart className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-secondary mb-2">Prepare for Scan</h2>
                  <p className="text-muted-foreground">Follow these steps for accurate results</p>
                </div>

                <div className="space-y-4 mb-8">
                  {prepareItems.map((item, index) => (
                    <motion.div
                      key={item.text}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-4 rounded-xl bg-muted"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-medium text-foreground">{item.text}</span>
                    </motion.div>
                  ))}
                </div>

                <Button
                  onClick={() => setStep("camera")}
                  className="w-full rounded-xl font-semibold py-6 text-lg"
                >
                  Continue
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </div>
            )}

            {/* Step: Camera Permission */}
            {step === "camera" && (
              <div className="p-8">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <Camera className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-secondary mb-2">Camera Setup</h2>
                  <p className="text-muted-foreground">We need camera access to analyze your health signals</p>
                </div>

                {/* Finger Illustration */}
                <div className="relative w-full aspect-square max-w-[200px] mx-auto mb-8">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full border-4 border-dashed border-primary/30 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                        <Hand className="w-10 h-10 text-primary" />
                      </div>
                    </div>
                  </div>
                  <p className="absolute bottom-0 left-0 right-0 text-center text-sm text-muted-foreground">
                    Place finger over camera lens
                  </p>
                </div>

                {!hasPermission ? (
                  <Button
                    onClick={handlePermissionRequest}
                    className="w-full rounded-xl font-semibold py-6 text-lg"
                  >
                    Allow Camera Access
                  </Button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-center gap-2 text-success mb-4">
                      <Check size={20} />
                      <span className="font-medium">Camera access granted</span>
                    </div>
                    <Button
                      onClick={handleStartCapture}
                      className="w-full rounded-xl font-semibold py-6 text-lg"
                    >
                      Start Scan
                      <ArrowRight className="ml-2" size={20} />
                    </Button>
                  </motion.div>
                )}
              </div>
            )}

            {/* Step: Capture */}
            {step === "capture" && (
              <div className="p-8">
                <div className="text-center mb-8">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/20 mb-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-destructive animate-pulse" />
                  </motion.div>
                  <h2 className="text-2xl font-display font-bold text-secondary mb-2">Capturing Signals</h2>
                  <p className="text-muted-foreground">Keep your finger steady on the camera</p>
                </div>

                {/* Timer */}
                <div className="text-center mb-8">
                  <div className="text-6xl font-display font-bold text-primary mb-2">
                    {timer}
                  </div>
                  <p className="text-muted-foreground">seconds remaining</p>
                </div>

                {/* Waveform Animation */}
                <div className="h-24 bg-muted rounded-xl overflow-hidden mb-6">
                  <svg viewBox="0 0 400 80" className="w-full h-full" preserveAspectRatio="none">
                    <motion.path
                      d="M0 40 Q25 20 50 40 Q75 60 100 40 Q125 20 150 40 Q175 60 200 40 Q225 20 250 40 Q275 60 300 40 Q325 20 350 40 Q375 60 400 40"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="3"
                      initial={{ pathOffset: 0 }}
                      animate={{ pathOffset: 1 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  </svg>
                </div>

                <div className="flex items-center justify-center gap-2 text-warning">
                  <Sun size={20} />
                  <span className="text-sm font-medium">Flashlight active</span>
                </div>
              </div>
            )}

            {/* Step: Complete */}
            {step === "complete" && (
              <div className="p-8">
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/20 mb-4"
                  >
                    <Check className="w-10 h-10 text-success" />
                  </motion.div>
                  <h2 className="text-2xl font-display font-bold text-secondary mb-2">Scan Complete!</h2>
                  <p className="text-muted-foreground">Your health signals have been analyzed</p>
                </div>

                <Button
                  onClick={handleComplete}
                  className="w-full rounded-xl font-semibold py-6 text-lg"
                >
                  View Your Digital Twin
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </div>
            )}

            {/* Progress Indicator */}
            <div className="flex justify-center gap-2 pb-6">
              {["prepare", "camera", "capture", "complete"].map((s, i) => (
                <div
                  key={s}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    ["prepare", "camera", "capture", "complete"].indexOf(step) >= i
                      ? "bg-primary"
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScanModal;
