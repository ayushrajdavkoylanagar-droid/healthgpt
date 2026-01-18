import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Activity } from "lucide-react";

interface HeroProps {
  onScanClick: () => void;
}

const Hero = ({ onScanClick }: HeroProps) => {
  return (
    <section className="relative min-h-screen flex items-center gradient-mesh pt-20">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 rounded-full bg-primary/10 blur-3xl"
        />
        <motion.div
          animate={{ opacity: [0.2, 0.5, 0.2], scale: [1.1, 1, 1.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-48 h-48 md:w-72 md:h-72 rounded-full bg-secondary/10 blur-3xl"
        />
      </div>

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
              <Activity size={16} />
              AI-Powered Health Awareness
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6 text-balance">
              AI-Based Human Health Assessment Using{" "}
              <span className="text-primary">Smartphone Video</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              HealthGPT uses AI-powered video and photoplethysmography to create a digital twin of your health using just your phone camera.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                onClick={onScanClick}
                size="lg"
                className="rounded-lg font-semibold text-lg px-8 py-6 group"
              >
                Scan Yourself
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-lg font-semibold text-lg px-8 py-6 border-primary text-primary hover:bg-primary/5"
                asChild
              >
                <a href="#how-it-works">Learn How It Works</a>
              </Button>
            </div>
          </motion.div>

          {/* Digital Twin Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex items-center justify-center"
          >
            <div className="relative w-64 h-80 md:w-80 md:h-96">
              {/* Human Silhouette */}
              <svg viewBox="0 0 200 250" className="w-full h-full">
                {/* Body outline */}
                <ellipse cx="100" cy="40" rx="28" ry="32" fill="none" stroke="hsl(var(--secondary))" strokeWidth="2" className="breathe" />
                
                {/* Torso */}
                <path
                  d="M72 72 L60 160 L80 160 L80 240 L120 240 L120 160 L140 160 L128 72"
                  fill="none"
                  stroke="hsl(var(--secondary))"
                  strokeWidth="2"
                  className="breathe"
                />

                {/* Signal Points with Pulse Animation */}
                <motion.circle
                  cx="100"
                  cy="100"
                  r="8"
                  fill="hsl(var(--primary))"
                  animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.1, 0.9] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.circle
                  cx="100"
                  cy="100"
                  r="16"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="1"
                  animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Head signal */}
                <motion.circle
                  cx="100"
                  cy="40"
                  r="5"
                  fill="hsl(var(--primary))"
                  animate={{ opacity: [0.4, 0.9, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                />

                {/* Signal waves */}
                <motion.path
                  d="M130 100 Q145 80 160 100 Q175 120 190 100"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  strokeLinecap="round"
                  animate={{ pathLength: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </svg>

              {/* Floating Stats */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-4 top-1/4 bg-card shadow-lg rounded-lg p-3 border border-border"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  <span className="text-sm font-medium text-foreground">72 BPM</span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -left-4 bottom-1/3 bg-card shadow-lg rounded-lg p-3 border border-border"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  <span className="text-sm font-medium text-foreground">Low Stress</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
