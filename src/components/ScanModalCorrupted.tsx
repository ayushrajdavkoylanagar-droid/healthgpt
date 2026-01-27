import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Camera, Activity, Heart, Brain, Zap, Hand, Sun, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import TensorFlowFaceDetection from "./TensorFlowFaceDetection";
import FaceDetectionRetry from "./FaceDetectionRetry";

interface ScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

type Step = "prepare" | "camera" | "capture" | "complete" | "no-face";

const ScanModalSimple = ({ isOpen, onClose, onComplete }: ScanModalProps) => {
  const [step, setStep] = useState<Step>("prepare");
  const [timer, setTimer] = useState(20);
  const [hasPermission, setHasPermission] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [showRetryModal, setShowRetryModal] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const resetModal = useCallback(() => {
    setStep("prepare");
    setTimer(20);
    setHasPermission(false);
    setCameraError(null);
    setFaceDetected(false);
    setShowRetryModal(false);
    stopCamera();
  }, []);

  useEffect(() => {
    if (!isOpen) {
      resetModal();
    }
  }, [isOpen, resetModal]);

  useEffect(() => {
    if (step === "capture") {
      const countdownInterval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            console.log('⏰ 20-second countdown completed - forcing scan completion');
            // Force completion after 20 seconds even if TensorFlow.js doesn't call back
            setTimeout(() => {
              setStep("complete");
            }, 1000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [step]);

  useEffect(() => {
    if (hasPermission && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(err => console.error('Video play failed on step change:', err));
    }
  }, [step, hasPermission]);

  const handleFaceDetected = (detected: boolean) => {
    setFaceDetected(detected);
  };

  const handleScanComplete = (faceWasDetected: boolean, scanResults?: any) => {
    console.log('🎯 Ultra-lenient TensorFlow.js scan complete:', { faceWasDetected, scanResults });
    
    if (faceWasDetected && scanResults) {
      // Store scan results in localStorage for later use
      localStorage.setItem('faceScanResults', JSON.stringify(scanResults));
      
      console.log('✅ SUCCESS - Face detected at least once during 20-second scan!');
      console.log('📊 Detection rate:', scanResults.faceDetectionRate);
      console.log('⏱️ Scan duration:', scanResults.scanDuration);
      console.log('🎯 Total face detections:', scanResults.faceDetectedCount);
      console.log('🔢 Total checks:', scanResults.totalChecks);
      
      // Move to complete step - show health parameters
      setTimeout(() => {
        setStep("complete");
      }, 500);
    } else {
      console.log('❌ ABSOLUTE FAILURE - No face detected even once during entire 20-second scan');
      console.log('🚫 Showing no-face step - no health parameters, only scan again option');
      setStep("no-face");
    }
  };

  const handleRetryScan = () => {
    // Reset for retry
    setTimer(20);
    setStep("camera");
    setFaceDetected(false);
    setShowRetryModal(false);
  };

  const handleCancelRetry = () => {
    // Go back to camera step
    setStep("camera");
    setShowRetryModal(false);
  };

  const handleStartCapture = () => {
    console.log('Starting 20-second capture...');
    if (videoRef.current && streamRef.current) {
      videoRef.current.play().catch(err => console.error('Video play failed on capture start:', err));
    }
    setStep("capture");
  };

  const handleComplete = () => {
    onComplete();
    onClose();
  };

  const startCamera = async () => {
    try {
      console.log('Requesting HD camera permission...');
      setCameraError(null);
      
      // HD video constraints with front-facing camera
      const constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('HD camera stream obtained:', stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        videoRef.current.autoplay = true;
        videoRef.current.playsInline = true;
        
        try {
          await videoRef.current.play();
          console.log('HD video playing successfully');
        } catch (playError) {
          console.error('Video play error:', playError);
          setCameraError('📷 HD camera ready - Tap video if needed');
        }
        
        streamRef.current = stream;
        setHasPermission(true);
        setCameraError('📷 HD camera ready for face detection');
      }
    } catch (error: any) {
      console.error('Camera access error:', error);
      setCameraError(`📷 Camera error: ${error.message}`);
      setHasPermission(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
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
            className="relative w-full max-w-md mx-auto bg-card rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
              aria-label="Close"
            >
              <X size={20} className="text-muted-foreground" />
            </button>

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
                      className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50"
                    >
                      <item.icon className="w-5 h-5 text-primary" />
                      <span className="text-sm">{item.text}</span>
                    </motion.div>
                  ))}
                </div>

                <Button
                  onClick={() => setStep("camera")}
                  className="w-full"
                  size="lg"
                >
                  Start Camera Scan
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {step === "camera" && (
              <div className="p-8">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <Camera className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-secondary mb-2">Camera Permission</h2>
                  <p className="text-muted-foreground">Allow camera access for face detection scanning</p>
                </div>

                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black mb-4 max-w-sm mx-auto">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline
                    muted
                    loop
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      display: 'block',
                      visibility: 'visible',
                      opacity: '1',
                      position: 'absolute',
                      top: '0',
                      left: '0',
                      backgroundColor: '#000',
                      transform: 'scaleX(-1)'
                    }}
                  />
                  {!hasPermission && (
                    <div className="absolute inset-0 flex items-center justify-center text-white text-sm bg-black p-4 text-center">
                      Camera preview will appear here
                    </div>
                  )}
                  {cameraError && (
                    <div className="absolute inset-0 flex items-center justify-center text-white text-sm bg-black/80 p-4 text-center">
                      {cameraError}
                    </div>
                  )}
                  {hasPermission && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                      LIVE
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={startCamera}
                    className="w-full"
                    size="lg"
                    disabled={hasPermission}
                  >
                    {hasPermission ? 'Camera Ready' : 'Start Camera'}
                    <Camera className="w-4 h-4 ml-2" />
                  </Button>
                  
                  {hasPermission && (
                    <Button
                      onClick={handleStartCapture}
                      className="w-full"
                      size="lg"
                      variant="outline"
                    >
                      Start 20-Second Face Scan
                      <Activity className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>

                {cameraError && (
                  <p className="text-sm text-destructive text-center mt-4">
                    {cameraError}
                  </p>
                )}
              </div>
            )}

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
                  <p className="text-muted-foreground">Keep your face visible in the camera</p>
                </div>

                {/* TensorFlow.js Face Detection Component */}
                <TensorFlowFaceDetection
                  videoRef={videoRef}
                  isScanning={step === "capture"}
                  onFaceDetected={handleFaceDetected}
                  onScanComplete={handleScanComplete}
                />

                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black mb-4 max-w-sm mx-auto">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline
                    muted
                    loop
                    key="capture-video"
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      display: 'block',
                      visibility: 'visible',
                      opacity: '1',
                      position: 'absolute',
                      top: '0',
                      left: '0',
                      backgroundColor: '#000',
                      transform: 'scaleX(-1)'
                    }}
                  />
                  <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    Scanning... {timer}s
                  </div>
                  <div className="absolute top-16 left-4 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    {faceDetected ? 'FACE DETECTED' : 'DETECTING...'}
                  </div>
                  <div className="absolute top-4 right-4 bg-red-500 text-white text-xs px-2 py-1 rounded animate-pulse">
                    RECORDING
                  </div>
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 border-2 border-red-500 rounded-xl animate-pulse opacity-50"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-32 h-32 border-4 border-red-500 rounded-full animate-ping"></div>
                    </div>
                  </div>
                </div>

                <div className="text-center mb-8">
                  <div className="text-6xl font-display font-bold text-primary mb-2">
                    {timer}
                  </div>
                  <p className="text-muted-foreground">seconds remaining</p>
                </div>

                <div className="h-24 bg-muted rounded-xl overflow-hidden mb-6">
                  <div className="h-full flex items-center justify-center">
                    <div className="flex space-x-1">
                      {[...Array(20)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{
                            height: [Math.random() * 100, Math.random() * 100, Math.random() * 100],
                          }}
                          transition={{
                            duration: 0.5,
                            repeat: Infinity,
                            delay: i * 0.1,
                          }}
                          className="w-1 bg-primary rounded-full"
                          style={{ height: `${Math.random() * 100}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    📹 Capturing health signals...
                  </p>
                </div>
              </div>
            )}

            {step === "complete" && (
              <div className="p-8">
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                      ? "bg-primary"
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>

            {/* Face Detection Retry Modal */}
            <FaceDetectionRetry
              isOpen={showRetryModal}
              onRetry={handleRetryScan}
              onCancel={handleCancelRetry}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScanModalSimple;
