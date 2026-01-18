import { motion } from "framer-motion";
import { Heart, Brain, Moon, Droplets, Activity } from "lucide-react";

interface HealthMetric {
  icon: typeof Heart;
  label: string;
  value: string;
  status: "normal" | "mild" | "high";
  description: string;
}

const metrics: HealthMetric[] = [
  {
    icon: Heart,
    label: "Heart Rate",
    value: "72 BPM",
    status: "normal",
    description: "Your heart rhythm is steady and healthy",
  },
  {
    icon: Brain,
    label: "Stress Score",
    value: "Low",
    status: "normal",
    description: "You appear calm and relaxed",
  },
  {
    icon: Activity,
    label: "Emotion Score",
    value: "Balanced",
    status: "normal",
    description: "Your emotional state is stable",
  },
  {
    icon: Moon,
    label: "Sleep Score",
    value: "Good",
    status: "mild",
    description: "Consider maintaining consistent sleep times",
  },
  {
    icon: Droplets,
    label: "Hydration",
    value: "Optimal",
    status: "normal",
    description: "Your hydration levels look good",
  },
];

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
                Your body appears to be functioning well overall. Your heart rhythm is steady, 
                and your stress levels are low. Consider maintaining consistent sleep patterns 
                to optimize your recovery. Small routine adjustments can enhance your wellbeing over time.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DigitalTwinDashboard;
