import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";

const Header = () => {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header 
      className={`fixed w-full top-0 z-40 transition-all duration-300 ${
        scrolled 
          ? "bg-white/95 backdrop-blur-md shadow-md" 
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/">
            <Logo variant={scrolled ? "default" : "white"} linkWrapper={false} />
          </Link>

          {isMobile ? (
            <>
              <Button 
                variant={scrolled ? "outline" : "ghost"} 
                size="icon" 
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
                className={scrolled ? "border-forex-primary/20" : "text-white"}
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </Button>
              
              {mobileMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-forex-border/30 shadow-lg animate-fade-in z-50">
                  <nav className="flex flex-col py-2">
                    <button 
                      className="px-6 py-3 hover:bg-forex-light text-forex-dark font-medium text-left"
                      onClick={() => scrollToSection("how-it-works")}
                    >
                      How It Works
                    </button>
                    <button 
                      className="px-6 py-3 hover:bg-forex-light text-forex-dark font-medium text-left"
                      onClick={() => scrollToSection("pricing")}
                    >
                      Challenges
                    </button>
                    <button 
                      className="px-6 py-3 hover:bg-forex-light text-forex-dark font-medium text-left"
                      onClick={() => scrollToSection("rules")}
                    >
                      Rules
                    </button>
                    <button
                      className="px-6 py-3 hover:bg-forex-light text-forex-dark font-medium text-left"
                      onClick={() => scrollToSection("faq")}
                    >
                      FAQ
                    </button>
                    <Link to="/leaderboard" className="px-6 py-3 hover:bg-forex-light text-forex-dark font-medium text-left">
                      Leaderboard
                    </Link>
                    <div className="px-4 py-3">
                      <Link to="/login">
                        <Button className="w-full bg-gradient-to-r from-forex-primary to-forex-accent hover:opacity-90 text-white shadow-md">
                          Start Trading
                        </Button>
                      </Link>
                    </div>
                  </nav>
                </div>
              )}
            </>
          ) : (
            <nav className="flex items-center space-x-6">
              <button 
                onClick={() => scrollToSection("how-it-works")} 
                className={`font-medium transition-colors relative group ${scrolled ? 'text-forex-dark hover:text-forex-primary' : 'text-white hover:text-forex-light'}`}
              >
                How It Works
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-forex-primary group-hover:w-full transition-all duration-300"></span>
              </button>
              
              <button 
                onClick={() => scrollToSection("pricing")} 
                className={`font-medium transition-colors relative group ${scrolled ? 'text-forex-dark hover:text-forex-primary' : 'text-white hover:text-forex-light'}`}
              >
                Challenges
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-forex-primary group-hover:w-full transition-all duration-300"></span>
              </button>
              
              <button 
                onClick={() => scrollToSection("rules")} 
                className={`font-medium transition-colors relative group ${scrolled ? 'text-forex-dark hover:text-forex-primary' : 'text-white hover:text-forex-light'}`}
              >
                Rules
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-forex-primary group-hover:w-full transition-all duration-300"></span>
              </button>
              
              <button 
                onClick={() => scrollToSection("faq")} 
                className={`font-medium transition-colors relative group ${scrolled ? 'text-forex-dark hover:text-forex-primary' : 'text-white hover:text-forex-light'}`}
              >
                FAQ
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-forex-primary group-hover:w-full transition-all duration-300"></span>
              </button>
              
              <Link 
                to="/leaderboard"
                className={`font-medium transition-colors relative group ${scrolled ? 'text-forex-dark hover:text-forex-primary' : 'text-white hover:text-forex-light'}`}
              >
                Leaderboard
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-forex-primary group-hover:w-full transition-all duration-300"></span>
              </Link>
              
              <Link to="/login">
                <Button className="bg-gradient-to-r from-forex-primary to-forex-accent hover:opacity-90 text-white font-semibold shadow-md transform transition-all hover:-translate-y-1 hover:shadow-lg">
                  Start Trading
                </Button>
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
