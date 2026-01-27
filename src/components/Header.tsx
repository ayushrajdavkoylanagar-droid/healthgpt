import { useState } from "react";
import { Menu, X, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  onScanClick: () => void;
}

const Header = ({ onScanClick }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const navItems = [
    { label: "About", href: "#about" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Impact", href: "#impact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <div className="relative w-8 h-8 md:w-10 md:h-10">
            <svg viewBox="0 0 40 40" className="w-full h-full">
              <circle cx="20" cy="20" r="18" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" className="pulse-ring" />
              <circle cx="20" cy="12" r="3" fill="hsl(var(--primary))" />
              <path d="M20 16 L20 28 M14 20 L20 20 L26 20" stroke="hsl(var(--secondary))" strokeWidth="2" strokeLinecap="round" />
              <circle cx="14" cy="26" r="2" fill="hsl(var(--primary))" opacity="0.6" />
              <circle cx="26" cy="26" r="2" fill="hsl(var(--primary))" opacity="0.6" />
            </svg>
          </div>
          <span className="text-xl md:text-2xl font-display font-bold text-secondary">
            Health<span className="text-primary">GPT</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-muted-foreground hover:text-secondary transition-colors font-medium"
            >
              {item.label}
            </a>
          ))}
          
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  {user?.name}
                </span>
              </div>
              <Button onClick={onScanClick} size="lg" className="rounded-lg font-semibold">
                Scan Yourself
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout}
                className="rounded-lg"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => window.dispatchEvent(new CustomEvent('openRegistration'))}
                className="rounded-lg font-semibold"
              >
                <User className="w-4 h-4 mr-2" />
                Register
              </Button>
              <Button onClick={onScanClick} size="lg" className="rounded-lg font-semibold">
                Scan Yourself
              </Button>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-secondary"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border"
          >
            <nav className="container py-4 flex flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-muted-foreground hover:text-secondary transition-colors font-medium py-2"
                >
                  {item.label}
                </a>
              ))}
              
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">
                      {user?.name}
                    </span>
                  </div>
                  <Button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onScanClick();
                    }}
                    className="w-full rounded-lg font-semibold"
                  >
                    Scan Yourself
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full rounded-lg"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      window.dispatchEvent(new CustomEvent('openRegistration'));
                    }}
                    className="w-full rounded-lg font-semibold"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Register
                  </Button>
                  <Button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onScanClick();
                    }}
                    className="w-full rounded-lg font-semibold"
                  >
                    Scan Yourself
                  </Button>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
