import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  variant?: 'default' | 'white';
  showText?: boolean;
  size?: 'small' | 'medium' | 'large';
  linkWrapper?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  variant = 'default', 
  showText = true,
  size = 'medium',
  linkWrapper = true
}) => {
  // Size classes
  const sizeClasses = {
    small: {
      logo: "h-8 w-8",
      text: "text-lg"
    },
    medium: {
      logo: "h-10 w-10",
      text: "text-xl"
    },
    large: {
      logo: "h-14 w-14",
      text: "text-2xl"
    }
  };

  // Text color based on variant
  const textColorClass = variant === 'white' 
    ? "text-white" 
    : "bg-gradient-to-r from-forex-dark to-forex-primary bg-clip-text text-transparent";

  const LogoContent = () => (
    <div className="flex items-center space-x-2">
      <div className={`${sizeClasses[size].logo} rounded-full bg-gradient-to-br from-forex-primary to-forex-secondary flex items-center justify-center text-white font-bold shadow-lg relative overflow-hidden group`}>
        {/* Background animation effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-forex-primary via-forex-secondary to-forex-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Animated trading chart line */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <svg width="80%" height="40%" viewBox="0 0 100 40" preserveAspectRatio="none">
            <path
              d="M0,20 L20,10 L40,25 L60,5 L80,15 L100,10"
              fill="none"
              stroke="rgba(255,255,255,0.8)"
              strokeWidth="2"
              className="animate-pulse-slow"
            />
          </svg>
        </div>
        
        {/* Logo text */}
        <span className="relative z-10">TX</span>
      </div>
      
      {showText && (
        <span className={`${sizeClasses[size].text} font-bold ${textColorClass} ml-1`}>
          TradeChampionX
        </span>
      )}
    </div>
  );

  return linkWrapper ? (
    <Link to="/">
      <LogoContent />
    </Link>
  ) : (
    <LogoContent />
  );
};

export default Logo;
