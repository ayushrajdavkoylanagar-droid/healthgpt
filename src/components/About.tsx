import { motion } from "framer-motion";
import { Shield, Zap, Globe, Award } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Privacy First",
    description: "All processing happens on-device. Your health data stays with you.",
  },
  {
    icon: Zap,
    title: "AI-Enhanced",
    description: "Deep learning algorithms extract insights from subtle visual signals.",
  },
  {
    icon: Globe,
    title: "Accessible",
    description: "Works on any smartphone — no special hardware required.",
  },
  {
    icon: Award,
    title: "Research-Backed",
    description: "Based on established photoplethysmography science used in medical devices.",
  },
];

const About = () => {
  return (
    <section id="about" className="py-16 md:py-24 gradient-mesh">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              The Science Behind HealthGPT
            </h2>
            
            <div className="space-y-4 text-muted-foreground">
              <p>
                <strong className="text-foreground">Photoplethysmography (PPG)</strong> uses light to detect blood flow changes by observing tiny color variations in the skin that are invisible to the naked eye.
              </p>
              
              <p>
                HealthGPT enhances traditional PPG using <strong className="text-foreground">AI and Machine Learning</strong>:
              </p>
              
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Convolutional Neural Networks (CNNs) clean noisy video signals</li>
                <li>Long Short-Term Memory networks (LSTMs) analyze time-based patterns</li>
                <li>AI removes motion artifacts for accurate readings</li>
                <li>Deep learning extracts deeper insights like stress patterns and recovery trends</li>
              </ul>
              
              <p>
                This enables <strong className="text-foreground">continuous, non-invasive health awareness</strong> using just your smartphone camera — no wearables or special equipment needed.
              </p>
            </div>

            {/* Credibility badges */}
            <div className="mt-8 flex flex-wrap gap-4">
              {["PPG Technology", "AI-Enhanced", "Research-Grade", "Global Standard"].map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium"
                >
                  {badge}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid sm:grid-cols-2 gap-4"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="bg-card rounded-xl p-6 border border-border card-hover"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
