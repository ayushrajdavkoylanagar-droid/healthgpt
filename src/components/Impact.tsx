import { motion } from "framer-motion";
import { Users, Smartphone, Building2, Heart } from "lucide-react";

const impactPoints = [
  {
    icon: Users,
    title: "Rural & Underserved Communities",
    description: "Designed to reach populations with limited healthcare access",
  },
  {
    icon: Smartphone,
    title: "Phone-Only Solution",
    description: "No additional hardware or wearables required",
  },
  {
    icon: Building2,
    title: "Public Health Ready",
    description: "Scalable to integrate with public health systems",
  },
  {
    icon: Heart,
    title: "Community Health Workers",
    description: "ASHA worker assisted onboarding for rural deployment",
  },
];

const Impact = () => {
  return (
    <section id="impact" className="py-16 md:py-24 bg-secondary text-secondary-foreground">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-secondary-foreground">
            Designed for Impact
          </h2>
          <p className="text-secondary-foreground/80 text-lg max-w-2xl mx-auto">
            HealthGPT is built with accessibility and scalability at its core
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {impactPoints.map((point, index) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-secondary-foreground/10 backdrop-blur-sm rounded-xl p-6 border border-secondary-foreground/20"
            >
              <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center mb-4">
                <point.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-secondary-foreground mb-2">{point.title}</h3>
              <p className="text-sm text-secondary-foreground/70">{point.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-4 flex-wrap justify-center">
            <div className="px-6 py-3 bg-secondary-foreground/10 rounded-full">
              <span className="text-2xl font-bold text-primary">1B+</span>
              <span className="text-sm text-secondary-foreground/80 ml-2">Potential Users</span>
            </div>
            <div className="px-6 py-3 bg-secondary-foreground/10 rounded-full">
              <span className="text-2xl font-bold text-primary">0</span>
              <span className="text-sm text-secondary-foreground/80 ml-2">Hardware Required</span>
            </div>
            <div className="px-6 py-3 bg-secondary-foreground/10 rounded-full">
              <span className="text-2xl font-bold text-primary">∞</span>
              <span className="text-sm text-secondary-foreground/80 ml-2">Scalability</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Impact;
