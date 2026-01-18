import { motion } from "framer-motion";
import { Smartphone, Waves, Cpu, LineChart } from "lucide-react";

const steps = [
  {
    icon: Smartphone,
    title: "Position Your Phone",
    description: "Place your finger gently over the camera lens with the flashlight on",
  },
  {
    icon: Waves,
    title: "Capture Light Signals",
    description: "The camera detects subtle color changes in your skin from blood flow",
  },
  {
    icon: Cpu,
    title: "AI Processing",
    description: "Advanced deep learning analyzes patterns to extract health signals",
  },
  {
    icon: LineChart,
    title: "Get Insights",
    description: "Receive personalized health awareness metrics in seconds",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Using photoplethysmography (PPG) enhanced by AI, HealthGPT turns your smartphone into a health awareness tool
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative text-center"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary/50 to-primary/20" />
              )}
              
              <div className="relative z-10 inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-muted mb-6">
                <step.icon className="w-10 h-10 text-primary" />
              </div>
              
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold mb-4">
                {index + 1}
              </div>
              
              <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
