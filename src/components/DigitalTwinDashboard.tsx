import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Heart, Brain, Moon, Droplets, Activity } from "lucide-react";

interface HealthMetric {
  icon: typeof Heart;
  label: string;
  value: string;
  status: "normal" | "mild" | "high";
  description: string;
}

const generateRandomMetrics = (): HealthMetric[] => {
  // Heart Rate: 60-100 bpm (normal resting range)
  const heartRate = Math.floor(60 + Math.random() * 40);
  let heartStatus: "normal" | "mild" | "high" = "normal";
  let heartDescription = "";
  
  if (heartRate < 70) {
    heartStatus = "normal";
    heartDescription = `Your heart rate of ${heartRate} BPM indicates excellent cardiovascular fitness and relaxation.`;
  } else if (heartRate < 85) {
    heartStatus = "normal";
    heartDescription = `Your heart rate of ${heartRate} BPM is within the healthy resting range.`;
  } else {
    heartStatus = "mild";
    heartDescription = `Your heart rate of ${heartRate} BPM is slightly elevated. Consider deep breathing exercises.`;
  }

  // Stress Score: Low, Moderate, High
  const stressLevels = ["Low", "Moderate", "High"];
  const stressLevel = stressLevels[Math.floor(Math.random() * stressLevels.length)];
  let stressStatus: "normal" | "mild" | "high" = stressLevel === "Low" ? "normal" : stressLevel === "Moderate" ? "mild" : "high";
  let stressDescription = "";
  
  if (stressLevel === "Low") {
    stressDescription = "Your stress levels are well-managed. Keep up your current relaxation practices.";
  } else if (stressLevel === "Moderate") {
    stressDescription = "You're experiencing moderate stress. Try 5-minute meditation breaks throughout your day.";
  } else {
    stressDescription = "Your stress levels are elevated. Consider prioritizing self-care and speaking with a wellness professional.";
  }

  // Emotion Score: Various emotional states
  const emotions = ["Happy", "Calm", "Focused", "Energetic", "Balanced", "Content"];
  const emotion = emotions[Math.floor(Math.random() * emotions.length)];
  let emotionDescription = "";
  
  const emotionAdvice: Record<string, string> = {
    "Happy": "Your positive emotional state is excellent for overall health. Share your joy with others!",
    "Calm": "Your calm demeanor supports better decision-making and physical health.",
    "Focused": "Your focused mindset is perfect for productivity. Remember to take regular breaks.",
    "Energetic": "Your high energy levels are great! Channel this into physical activity or creative projects.",
    "Balanced": "Your emotional balance indicates strong mental health. Maintain your current routine.",
    "Content": "Your contentment reflects inner peace. This state supports optimal physical functioning."
  };
  emotionDescription = emotionAdvice[emotion];

  // Sleep Score: Poor, Fair, Good, Excellent
  const sleepScores = ["Poor", "Fair", "Good", "Excellent"];
  const sleepScore = sleepScores[Math.floor(Math.random() * sleepScores.length)];
  let sleepStatus: "normal" | "mild" | "high" = sleepScore === "Excellent" || sleepScore === "Good" ? "normal" : sleepScore === "Fair" ? "mild" : "high";
  let sleepDescription = "";
  
  if (sleepScore === "Excellent") {
    sleepDescription = "Your sleep quality is outstanding! This supports optimal cognitive function and physical recovery.";
  } else if (sleepScore === "Good") {
    sleepDescription = "Your sleep quality is good. Consider maintaining consistent sleep and wake times.";
  } else if (sleepScore === "Fair") {
    sleepDescription = "Your sleep could be improved. Try reducing screen time before bed and creating a relaxing bedtime routine.";
  } else {
    sleepDescription = "Your sleep quality needs attention. Consider speaking with a healthcare provider about sleep optimization strategies.";
  }

  // Hydration: 40-100% (normal range)
  const hydration = Math.floor(40 + Math.random() * 60);
  let hydrationStatus: "normal" | "mild" | "high" = hydration >= 70 ? "normal" : hydration >= 50 ? "mild" : "high";
  let hydrationDescription = "";
  
  if (hydration >= 80) {
    hydrationDescription = `Your hydration level at ${hydration}% is excellent! Your body is well-hydrated for optimal function.`;
  } else if (hydration >= 60) {
    hydrationDescription = `Your hydration at ${hydration}% is good. Aim to drink water consistently throughout the day.`;
  } else if (hydration >= 40) {
    hydrationDescription = `Your hydration at ${hydration}% needs attention. Increase your water intake and avoid excessive caffeine.`;
  } else {
    hydrationDescription = `Your hydration at ${hydration}% is low. Please drink water immediately and monitor your intake.`;
  }

  return [
    {
      icon: Heart,
      label: "Heart Rate",
      value: `${heartRate} BPM`,
      status: heartStatus,
      description: heartDescription,
    },
    {
      icon: Brain,
      label: "Stress Score",
      value: stressLevel,
      status: stressStatus,
      description: stressDescription,
    },
    {
      icon: Activity,
      label: "Emotion Score",
      value: emotion,
      status: "normal",
      description: emotionDescription,
    },
    {
      icon: Moon,
      label: "Sleep Score",
      value: sleepScore,
      status: sleepStatus,
      description: sleepDescription,
    },
    {
      icon: Droplets,
      label: "Hydration",
      value: `${hydration}%`,
      status: hydrationStatus,
      description: hydrationDescription,
    },
  ];
};

const generatePersonalizedInsight = (metrics: HealthMetric[]): string => {
  const highStress = metrics.find(m => m.label === "Stress Score" && m.status === "high");
  const poorSleep = metrics.find(m => m.label === "Sleep Score" && m.status === "high");
  const lowHydration = metrics.find(m => m.label === "Hydration" && m.status === "high");
  const highHeartRate = metrics.find(m => m.label === "Heart Rate" && m.status === "mild");

  if (highStress && poorSleep) {
    return "Your stress levels and sleep quality are interconnected. Consider establishing a relaxing bedtime routine to improve both areas. Deep breathing exercises before sleep can significantly reduce cortisol levels and improve sleep quality.";
  } else if (lowHydration && highHeartRate) {
    return "Your hydration level may be affecting your heart rate. Proper hydration helps maintain optimal blood volume and heart function. Aim to drink at least 8 glasses of water throughout the day, especially if you're physically active.";
  } else if (highStress) {
    return "Your stress levels are elevated and impacting your overall wellbeing. Regular physical activity, mindfulness practices, and adequate sleep can help manage stress more effectively. Consider scheduling short breaks throughout your day for relaxation.";
  } else if (poorSleep) {
    return "Sleep quality is crucial for your overall health. Poor sleep can affect stress levels, heart rate, and emotional state. Create a consistent sleep schedule, avoid screens before bedtime, and ensure your sleeping environment is cool and dark.";
  } else {
    return "Your overall health indicators are positive! Your body is showing good balance across multiple metrics. Continue maintaining your current healthy habits, and consider setting small wellness goals to further optimize your physical and mental wellbeing.";
  }
};

const statusColors = {
  normal: "bg-success text-success-foreground",
  mild: "bg-warning text-warning-foreground",
  high: "bg-destructive text-destructive-foreground",
};

const statusBorders = {
  normal: "border-success/30",
  mild: "border-warning/30",
  high: "border-destructive/30",
};

interface DigitalTwinDashboardProps {
  isVisible: boolean;
}

const DigitalTwinDashboard = ({ isVisible }: DigitalTwinDashboardProps) => {
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [personalizedInsight, setPersonalizedInsight] = useState<string>("");

  useEffect(() => {
    if (isVisible) {
      // Generate new random metrics each time the dashboard becomes visible
      const newMetrics = generateRandomMetrics();
      setMetrics(newMetrics);
      setPersonalizedInsight(generatePersonalizedInsight(newMetrics));
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <section id="dashboard" className="py-16 md:py-24 bg-muted">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Your Digital Twin
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Based on your scan, here's a snapshot of your health awareness metrics
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Avatar Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1 flex justify-center"
          >
            <div className="relative w-48 h-64 md:w-56 md:h-72">
              <svg viewBox="0 0 200 280" className="w-full h-full">
                {/* Body outline with gradient */}
                <defs>
                  <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--secondary))" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
                  </linearGradient>
                </defs>

                {/* Head */}
                <ellipse
                  cx="100"
                  cy="45"
                  rx="32"
                  ry="38"
                  fill="none"
                  stroke="url(#bodyGradient)"
                  strokeWidth="2.5"
                />

                {/* Torso & Limbs */}
                <path
                  d="M68 83 L50 170 L75 170 L75 265 L125 265 L125 170 L150 170 L132 83"
                  fill="none"
                  stroke="url(#bodyGradient)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Heart pulse point */}
                <motion.circle
                  cx="100"
                  cy="120"
                  r="10"
                  fill="hsl(var(--success))"
                  animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.1, 0.9] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.circle
                  cx="100"
                  cy="120"
                  r="18"
                  fill="none"
                  stroke="hsl(var(--success))"
                  strokeWidth="1.5"
                  animate={{ opacity: [0.2, 0.6, 0.2], scale: [1, 1.4, 1] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Head point */}
                <motion.circle
                  cx="100"
                  cy="45"
                  r="6"
                  fill="hsl(var(--success))"
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                />
              </svg>

              <div className="absolute bottom-0 left-0 right-0 text-center">
                <span className="text-sm font-medium text-muted-foreground">Overall Status</span>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
                  <span className="font-semibold text-success">Healthy</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Metrics Grid */}
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className={`bg-card rounded-xl p-5 border ${statusBorders[metric.status]} card-hover`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${statusColors[metric.status]} flex items-center justify-center`}>
                      <metric.icon size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{metric.label}</p>
                      <p className="text-lg font-semibold text-foreground">{metric.value}</p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{metric.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI Insight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 bg-card rounded-2xl p-6 md:p-8 border border-primary/20"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">AI Health Insight</h3>
              <p className="text-muted-foreground leading-relaxed">
                {personalizedInsight}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DigitalTwinDashboard;
