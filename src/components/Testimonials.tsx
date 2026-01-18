import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Healthcare Worker",
    content: "Simple, calming, and surprisingly insightful. I use it every morning to check in with myself before starting my shift.",
    avatar: "PS",
  },
  {
    name: "Rahul Verma",
    role: "Tech Professional",
    content: "Feels like future healthcare. The stress tracking has helped me understand my work patterns better.",
    avatar: "RV",
  },
  {
    name: "Meera Patel",
    role: "Rural Health Volunteer",
    content: "Very easy to use even on basic phones. This could really help communities with limited healthcare access.",
    avatar: "MP",
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            What People Are Saying
          </h2>
          <p className="text-muted-foreground text-lg">
            Early feedback from our pilot users
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card rounded-2xl p-6 border border-border card-hover"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-warning text-warning" />
                ))}
              </div>
              
              <p className="text-foreground mb-6 italic">"{testimonial.content}"</p>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-medium text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
