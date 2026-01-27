import { Heart, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted border-t border-border">
      <div className="container py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <a href="#" className="flex items-center gap-2 mb-4">
              <div className="relative w-8 h-8">
                <svg viewBox="0 0 40 40" className="w-full h-full">
                  <circle cx="20" cy="20" r="18" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />
                  <circle cx="20" cy="12" r="3" fill="hsl(var(--primary))" />
                  <path d="M20 16 L20 28 M14 20 L20 20 L26 20" stroke="hsl(var(--secondary))" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-xl font-display font-bold text-secondary">
                Health<span className="text-primary">GPT</span>
              </span>
            </a>
            <p className="text-muted-foreground text-sm">
              AI-powered health awareness using smartphone video analysis.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {["About", "How It Works", "Impact", "Privacy"].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase().replace(" ", "-")}`}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Important Notice</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              HealthGPT provides awareness insights only and does not replace professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider.
            </p>
          </div>
        </div>

        {/* Co-founders Section */}
        <div className="pt-8 border-t border-border">
          <div className="text-center mb-6">
            <h4 className="font-semibold text-foreground mb-2">Co-Founders</h4>
            <p className="text-muted-foreground text-sm">Meet the minds behind HealthGPT</p>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            {/* Ayush Raj */}
            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-3 group-hover:scale-105 transition-transform">
                AR
              </div>
              <h5 className="font-semibold text-foreground mb-1">Ayush Raj</h5>
              <p className="text-muted-foreground text-sm mb-2">Co-Founder & Developer</p>
              <a
                href="https://www.linkedin.com/in/ayush-raj-90aa00377?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors text-sm"
              >
                <Linkedin size={14} />
                LinkedIn
              </a>
            </div>

            {/* Sourav Kumar */}
            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-3 group-hover:scale-105 transition-transform">
                SK
              </div>
              <h5 className="font-semibold text-foreground mb-1">Sourav Kumar</h5>
              <p className="text-muted-foreground text-sm mb-2">Co-Founder & Developer</p>
              <a
                href="https://www.linkedin.com/in/sourav-kumar-93423838a/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors text-sm"
              >
                <Linkedin size={14} />
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
              Prototype
            </span>
            <span className="text-muted-foreground text-sm">
              Privacy-First • Anonymous Data Handling
            </span>
          </div>
          
          <p className="text-muted-foreground text-sm flex items-center gap-1">
            Made with <Heart size={14} className="text-primary" /> for global health
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
