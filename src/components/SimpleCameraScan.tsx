import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SimpleCameraScan = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(10);
  const [metrics, setMetrics] = useState<{
    heartRate: number;
    hydration: number;
    emotion: string;
    sleep: { hours: number; quality: string };
  } | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  const metricsIntervalRef = useRef<number | null>(null);

  // Normal human ranges
  const emotions = ['Happy', 'Calm', 'Neutral', 'Focused', 'Relaxed'];
  const sleepQualities = ['Excellent', 'Good', 'Fair', 'Needs Improvement'];
  const sleepHours = [7, 7.5, 8, 8.5, 9];

  const generateRandomMetrics = () => {
    // Heart rate: 60-100 bpm (normal resting range)
    const heartRate = Math.floor(60 + Math.random() * 40);
    
    // Hydration: 50-100% (normal range)
    const hydration = Math.floor(50 + Math.random() * 50);
    
    // Emotion: random from list
    const emotion = emotions[Math.floor(Math.random() * emotions.length)];
    
    // Sleep: random quality and hours
    const quality = sleepQualities[Math.floor(Math.random() * sleepQualities.length)];
    const hours = sleepHours[Math.floor(Math.random() * sleepHours.length)];
    
    return {
      heartRate,
      hydration,
      emotion,
      sleep: { hours, quality }
    };
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (metricsIntervalRef.current) {
      clearInterval(metricsIntervalRef.current);
      metricsIntervalRef.current = null;
    }
    
    setHasPermission(false);
    setIsScanning(false);
    setTimeRemaining(10);
  };

  const startScan = async () => {
    try {
      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false
      });

      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        
        // Ensure video plays properly
        try {
          await videoRef.current.play();
          
          // Verify video is actually playing
          if (videoRef.current.paused || videoRef.current.ended) {
            throw new Error('Video failed to play properly');
          }
        } catch (playError) {
          console.error('Video play error:', playError);
          throw new Error('Failed to start camera preview');
        }
      }
      
      setHasPermission(true);
      setIsScanning(true);
      setTimeRemaining(10);
      
      // Show metrics immediately
      setMetrics(generateRandomMetrics());
      
      // Update metrics every second
      metricsIntervalRef.current = window.setInterval(() => {
        setMetrics(generateRandomMetrics());
      }, 1000);
      
      // Countdown timer
      timerRef.current = window.setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            if (metricsIntervalRef.current) clearInterval(metricsIntervalRef.current);
            stopCamera();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (error: any) {
      console.error('Error accessing camera:', error);
      alert('Failed to access camera. Please allow camera permissions and try again.');
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-6">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
            <CardTitle className="text-2xl md:text-3xl text-center">
              📷 Health Scan - Camera Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Video Container */}
              <div className="relative w-full max-w-2xl mx-auto bg-black rounded-lg overflow-hidden aspect-video">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {!hasPermission && (
                  <div className="absolute inset-0 flex items-center justify-center text-white text-lg bg-black">
                    Camera feed will appear here
                  </div>
                )}
                {isScanning && (
                  <div className="absolute top-4 right-4 bg-black/70 text-white px-4 py-2 rounded-full text-xl font-bold">
                    {timeRemaining}s
                  </div>
                )}
              </div>

              {/* Start Button */}
              <div className="text-center">
                <Button
                  onClick={startScan}
                  disabled={isScanning}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-6 text-lg"
                >
                  {isScanning ? 'Scanning...' : 'Start Camera Scan'}
                </Button>
              </div>

              {/* Metrics Display */}
              {metrics && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                  {/* Heart Rate */}
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                        Heart Rate
                      </div>
                      <div className="text-3xl font-bold text-gray-800">
                        {metrics.heartRate} <span className="text-lg text-gray-500">bpm</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Hydration */}
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                        Hydration
                      </div>
                      <div className="text-3xl font-bold text-gray-800">
                        {metrics.hydration} <span className="text-lg text-gray-500">%</span>
                      </div>
                      <div className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        metrics.hydration >= 70 
                          ? 'bg-green-100 text-green-800' 
                          : metrics.hydration >= 50 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {metrics.hydration >= 70 ? 'Optimal' : metrics.hydration >= 50 ? 'Good' : 'Low'}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Emotion */}
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                        Emotion
                      </div>
                      <div className="text-2xl font-bold text-gray-800 mb-2">
                        {metrics.emotion}
                      </div>
                      <div className="mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                        Balanced
                      </div>
                    </CardContent>
                  </Card>

                  {/* Sleep */}
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                        Sleep Quality
                      </div>
                      <div className="text-3xl font-bold text-gray-800">
                        {metrics.sleep.hours}h
                      </div>
                      <div className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        metrics.sleep.quality === 'Excellent' 
                          ? 'bg-green-100 text-green-800'
                          : metrics.sleep.quality === 'Good'
                          ? 'bg-blue-100 text-blue-800'
                          : metrics.sleep.quality === 'Fair'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {metrics.sleep.quality}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SimpleCameraScan;