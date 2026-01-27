import { useState, useEffect, useRef, useCallback } from 'react';
import * as faceDetection from '@tensorflow-models/face-detection';
import '@tensorflow/tfjs-backend-webgl';

interface TensorFlowFaceDetectionProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isScanning: boolean;
  onFaceDetected: (detected: boolean) => void;
  onScanComplete: (faceWasDetected: boolean, scanResults?: any) => void;
}

interface DetectionData {
  timestamp: number;
  faceDetected: boolean;
  confidence: number;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface ScanResults {
  faceDetectedCount: number;
  totalChecks: number;
  faceDetectionRate: string;
  averageConfidence: string;
  scanDuration: string;
  allDetections: DetectionData[];
  scanSuccessful: boolean;
}

const TensorFlowFaceDetection: React.FC<TensorFlowFaceDetectionProps> = ({
  videoRef,
  isScanning,
  onFaceDetected,
  onScanComplete
}) => {
  const [detector, setDetector] = useState<faceDetection.FaceDetector | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [detectionData, setDetectionData] = useState<DetectionData[]>([]);
  const [faceDetectedDuringScan, setFaceDetectedDuringScan] = useState(false);
  
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const scanStartTimeRef = useRef<number | null>(null);
  const consecutiveMissesRef = useRef(0);
  const lastDetectionRef = useRef<boolean>(false);

  // Initialize TensorFlow.js Face Detection
  useEffect(() => {
    const initializeDetector = async () => {
      try {
        setIsModelLoading(true);
        console.log('🤖 Initializing TensorFlow.js Face Detection...');
        
        // Configure MediaPipeFaceDetector with ultra-lenient settings
        const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
        const detectorConfig: faceDetection.MediaPipeFaceDetectorTfjsModelConfig = {
          runtime: 'tfjs',
          maxFaces: 1
        };

        const faceDetector = await faceDetection.createDetector(model, detectorConfig);
        console.log('✅ TensorFlow.js Face Detection initialized successfully');
        
        setDetector(faceDetector);
        setIsModelLoading(false);
      } catch (error) {
        console.error('❌ Failed to initialize TensorFlow.js Face Detection:', error);
        setIsModelLoading(false);
      }
    };

    initializeDetector();

    return () => {
      if (detector) {
        detector.dispose();
      }
    };
  }, []);

  // Ultra-lenient face detection logic
  const detectFace = useCallback(async (): Promise<boolean> => {
    if (!detector || !videoRef.current || videoRef.current.readyState !== 4) {
      console.log('🔍 Detector or video not ready, skipping detection');
      return false;
    }

    try {
      console.log('🎯 Running face detection...');
      
      // Run face detection
      const faces = await detector.estimateFaces(videoRef.current, {
        flipHorizontal: false
      });

      console.log('📸 TensorFlow.js detected faces:', faces.length);

      // ULTRA-LENIENT: Accept ANY detection, even if it's just partial
      const faceDetected = faces.length > 0;
      
      if (faceDetected) {
        console.log('👤 FACE DETECTED! Count:', faces.length);
        console.log('📊 Face details:', faces[0]);
        
        consecutiveMissesRef.current = 0;
        lastDetectionRef.current = true;
        
        // Store detection data
        const detection: DetectionData = {
          timestamp: Date.now(),
          faceDetected: true,
          confidence: 1.0, // Default confidence since MediaPipe doesn't provide it
          boundingBox: faces[0].box ? {
            x: faces[0].box.xMin,
            y: faces[0].box.yMin,
            width: faces[0].box.width,
            height: faces[0].box.height
          } : undefined
        };
        
        setDetectionData(prev => [...prev, detection]);
        setFaceDetectedDuringScan(true);
        onFaceDetected(true);
        
        console.log('✅ Face detection SUCCESS - faceDetectedDuringScan set to TRUE');
        console.log('🔍 Current faceDetectedDuringScan state:', true);
        return true;
      } else {
        consecutiveMissesRef.current++;
        console.log('🔍 No face detected, consecutive misses:', consecutiveMissesRef.current);
        
        // Store miss data
        const detection: DetectionData = {
          timestamp: Date.now(),
          faceDetected: false,
          confidence: 0
        };
        
        setDetectionData(prev => [...prev, detection]);
        onFaceDetected(false);
        
        // Only fail after 30 consecutive misses (more lenient)
        if (consecutiveMissesRef.current >= 30) {
          console.log('❌ Face detection failed after 30 consecutive misses');
          return false;
        }
        
        return false;
      }
    } catch (error) {
      console.error('❌ Face detection error:', error);
      // Don't fail the entire scan on detection errors
      return false;
    }
  }, [detector, videoRef, onFaceDetected]);

  // Start scanning with continuous detection
  useEffect(() => {
    if (isScanning && detector && !isModelLoading) {
      console.log('🎯 Starting 20-second face detection scan...');
      
      scanStartTimeRef.current = Date.now();
      setDetectionData([]);
      setFaceDetectedDuringScan(false);
      consecutiveMissesRef.current = 0;
      lastDetectionRef.current = false;

      // Define completeScan function
      const completeScan = () => {
        console.log('🏁 completeScan() called - processing results...');
        console.log('🔍 faceDetectedDuringScan at start:', faceDetectedDuringScan);
        console.log('🔍 detectionData length:', detectionData.length);
        console.log('🔍 face detections in data:', detectionData.filter(d => d.faceDetected).length);
        
        // Double-check if any face was detected in the data
        const hasAnyFaceDetection = detectionData.some(d => d.faceDetected);
        console.log('🔍 hasAnyFaceDetection from data:', hasAnyFaceDetection);
        
        // Use the more reliable check
        const finalFaceDetected = faceDetectedDuringScan || hasAnyFaceDetection;
        console.log('🔍 finalFaceDetected:', finalFaceDetected);
        
        if (detectionIntervalRef.current) {
          clearInterval(detectionIntervalRef.current);
        }
        if (manualCheckInterval) {
          clearInterval(manualCheckInterval);
        }
        if (scanTimeout) {
          clearTimeout(scanTimeout);
        }
        if (safetyTimeout) {
          clearTimeout(safetyTimeout);
        }

        const scanEndTime = Date.now();
        const scanDuration = scanStartTimeRef.current 
          ? ((scanEndTime - scanStartTimeRef.current) / 1000).toFixed(1)
          : '0.0';

        // Calculate scan results
        const totalChecks = detectionData.length;
        const faceDetectedCount = detectionData.filter(d => d.faceDetected).length;
        const faceDetectionRate = totalChecks > 0 
          ? ((faceDetectedCount / totalChecks) * 100).toFixed(1)
          : '0.0';
        
        const averageConfidence = faceDetectedCount > 0
          ? (detectionData
              .filter(d => d.faceDetected)
              .reduce((sum, d) => sum + d.confidence, 0) / faceDetectedCount
            ).toFixed(3)
          : '0.000';

        const scanResults: ScanResults = {
          faceDetectedCount,
          totalChecks,
          faceDetectionRate: `${faceDetectionRate}%`,
          averageConfidence,
          scanDuration: `${scanDuration}s`,
          allDetections: detectionData,
          scanSuccessful: finalFaceDetected // Use the actual face detection result
        };

        console.log('📊 Scan Results:', scanResults);
        console.log('🎯 Face detected during scan:', finalFaceDetected ? 'YES' : 'NO');

        // Show health results if face detected even once (1% rule)
        // Show "Try Again" only if absolutely no face detected during entire scan
        console.log('🎯 FINAL CHECK - Face detected even once during scan:', finalFaceDetected ? 'YES ✅' : 'NO ❌');
        
        if (finalFaceDetected) {
          console.log('🎉 SUCCESS - Face detected at least once, showing health parameters');
        } else {
          console.log('⚠️ FAILURE - Absolutely no face detected during entire 20-second scan');
        }
        
        console.log('📞 CALLING onScanComplete with:', finalFaceDetected, scanResults);
        onScanComplete(finalFaceDetected, scanResults);
      };

      // Continuous detection every 200ms
      detectionIntervalRef.current = setInterval(async () => {
        await detectFace();
      }, 200);

      // Manual checks every 2 seconds
      const manualCheckInterval = setInterval(async () => {
        console.log('🔎 Manual check - Face detected during scan:', faceDetectedDuringScan);
      }, 2000);

      // 20-second scan completion
      const scanTimeout = setTimeout(async () => {
        console.log('⏱️ 20-second scan completed - doing final face check...');
        
        // Do one final face detection check
        try {
          const finalFaces = await detector.estimateFaces(videoRef.current, {
            flipHorizontal: false
          });
          
          console.log('🔍 FINAL CHECK - TensorFlow.js detected faces:', finalFaces.length);
          
          if (finalFaces.length > 0) {
            console.log('🎉 FINAL CHECK SUCCESS - Face detected at the end!');
            setFaceDetectedDuringScan(true);
            onFaceDetected(true);
          }
        } catch (error) {
          console.error('❌ Final face check error:', error);
        }
        
        console.log('🏁 Calling completeScan...');
        completeScan();
      }, 20000);

      // Safety timeout - ensure scan completes almost immediately after 20 seconds
      const safetyTimeout = setTimeout(() => {
        console.log('🚨 SAFETY TIMEOUT - Forcing scan completion after 20.1 seconds');
        completeScan();
      }, 20100); // 20.1 seconds for minimal delay

      return () => {
        if (detectionIntervalRef.current) {
          clearInterval(detectionIntervalRef.current);
        }
        if (manualCheckInterval) {
          clearInterval(manualCheckInterval);
        }
        if (scanTimeout) {
          clearTimeout(scanTimeout);
        }
        if (safetyTimeout) {
          clearTimeout(safetyTimeout);
        }
      };
    }
  }, [isScanning, detector, isModelLoading, detectFace, onScanComplete, onFaceDetected]);

  // Final check when scanning stops
  useEffect(() => {
    if (!isScanning && scanStartTimeRef.current) {
      const finalCheck = async () => {
        console.log('🔍 Final face check...');
        const finalDetection = await detectFace();
        console.log('🎯 Final detection result:', finalDetection);
      };
      
      finalCheck();
    }
  }, [isScanning, detectFace]);

  return null; // This component runs in the background
};

export default TensorFlowFaceDetection;
