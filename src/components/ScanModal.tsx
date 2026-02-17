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

type Step = "prepare" | "camera" | "capture" | "preparing" | "complete";

const ScanModalFixed = ({ isOpen, onClose, onComplete }: ScanModalProps) => {
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
            console.log('⏰ 20-second countdown completed - waiting for TensorFlow.js to complete');
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
    console.log('🎯 handleScanComplete CALLED with:', { faceWasDetected, scanResults });
    console.log('🔍 faceWasDetected value:', faceWasDetected);
    console.log('🔍 typeof faceWasDetected:', typeof faceWasDetected);
    
    if (faceWasDetected && scanResults) {
      // Store scan results in localStorage for later use
      localStorage.setItem('faceScanResults', JSON.stringify(scanResults));
      
      console.log('✅ SUCCESS - Face detected at least once during 20-second scan!');
      console.log('📊 Detection rate:', scanResults.faceDetectionRate);
      console.log('⏱️ Scan duration:', scanResults.scanDuration);
      console.log('🎯 Total face detections:', scanResults.faceDetectedCount);
      console.log('🔢 Total checks:', scanResults.totalChecks);
      
      // Show preparing step first
      console.log('🔄 Moving to preparing step...');
      setStep("preparing");
      
      // Then move to complete step after a delay
      setTimeout(() => {
        console.log('🔄 Moving to complete step...');
        setStep("complete");
      }, 3000); // 3 seconds delay for preparing display
    } else {
      console.log('❌ ABSOLUTE FAILURE - No face detected even once during entire 20-second scan');
      console.log('🔄 Showing retry modal - no health parameters, only scan again option');
      console.log('🔄 Showing retry modal...');
      setShowRetryModal(true);
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

  const handleComplete = async () => {
    // Send health scores with registration data
    try {
      const healthScores = {
        heartRate: '72 bpm',
        stressLevel: 'Low',
        sleepQuality: 'Good',
        emotionScore: 'Positive',
        hydrationLevel: 'Normal',
        energyLevel: 'High',
        activityLevel: 'Normal'
      };

      const registrationData = {
        name: 'HealthGPT User',
        email: 'user@healthgpt.com',
        phone: '+1234567890',
        healthScores: healthScores
      };

      console.log('🚀 Sending health scores with registration...');
      console.log('📊 Health scores:', healthScores);
      console.log('📤 Registration data:', registrationData);

      const response = await fetch('/api/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'HealthGPT-Scan/1.0'
        },
        body: JSON.stringify(registrationData)
      });

      const result = await response.json();
      console.log('✅ Health scores sent:', result);

    } catch (error) {
      console.error('❌ Error sending health scores:', error);
    }

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

            {step === "preparing" && (
              <div className="p-8">
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Activity className="w-10 h-10 text-green-600" />
                    </motion.div>
                  </motion.div>
                  <h2 className="text-2xl font-display font-bold text-secondary mb-2">Preparing Your Health Report</h2>
                  <p className="text-muted-foreground mb-6">Analyzing your scan data and generating personalized insights...</p>
                  
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-full max-w-sm">
                      <div className="flex justify-between text-sm text-muted-foreground mb-2">
                        <span>Processing health metrics</span>
                        <span>75%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className="bg-green-600 h-2 rounded-full"
                          initial={{ width: "0%" }}
                          animate={{ width: "75%" }}
                          transition={{ duration: 2.5, ease: "easeInOut" }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                      {["Heart Rate", "Stress Level", "Sleep Quality", "Emotion Score", "Hydration"].map((metric, index) => (
                        <motion.div
                          key={metric}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.3 }}
                          className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium"
                        >
                          {metric}
                        </motion.div>
                      ))}
                    </div>
                  </div>
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
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4"
                  >
                    <Check className="w-10 h-10 text-green-600" />
                  </motion.div>
                  <h2 className="text-2xl font-display font-bold text-secondary mb-2">Scan Complete!</h2>
                  <p className="text-muted-foreground">Your face scan results are ready</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  {[
                    { icon: Heart, label: "Heart Rate", value: "72 bpm" },
                    { icon: Brain, label: "Stress", value: "Low" },
                    { icon: Zap, label: "Energy", value: "High" },
                    { icon: Activity, label: "Activity", value: "Normal" },
                  ].map((metric, index) => (
                    <motion.div
                      key={metric.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-lg bg-muted/50 text-center"
                    >
                      <metric.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                      <div className="text-sm font-medium">{metric.label}</div>
                      <div className="text-lg font-bold text-primary">{metric.value}</div>
                    </motion.div>
                  ))}
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleComplete}
                    className="w-full"
                    size="lg"
                  >
                    View Digital Twin
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                    onClick={() => setStep("prepare")}
                    variant="outline"
                    className="w-full"
                  >
                    Scan Again
                  </Button>
                </div>
              </div>
            )}

            <div className="flex justify-center space-x-2 p-4 border-t">
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

export default ScanModalFixed;
