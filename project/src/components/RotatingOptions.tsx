import React from 'react';
import { Settings, Image, Music, Film, Share2, Download, Heart, BookOpen } from 'lucide-react';
import { useTheme } from './ThemeProvider';

type Option = {
  id: number;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
};

export const RotatingOptions: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  
  const options: Option[] = [
    { 
      id: 1, 
      icon: <Settings size={20} />, 
      label: 'Settings',
      onClick: () => toggleTheme()
    },
    { 
      id: 2, 
      icon: <Image size={20} />, 
      label: 'Photos',
      onClick: () => console.log('Photos clicked')
    },
    { 
      id: 3, 
      icon: <Music size={20} />, 
      label: 'Music',
      onClick: () => console.log('Music clicked')
    },
    { 
      id: 4, 
      icon: <Film size={20} />, 
      label: 'Videos',
      onClick: () => console.log('Videos clicked')
    },
    { 
      id: 5, 
      icon: <Share2 size={20} />, 
      label: 'Share',
      onClick: () => console.log('Share clicked')
    },
    { 
      id: 6, 
      icon: <Download size={20} />, 
      label: 'Download',
      onClick: () => console.log('Download clicked')
    },
    { 
      id: 7, 
      icon: <Heart size={20} />, 
      label: 'Favorites',
      onClick: () => console.log('Favorites clicked')
    },
    { 
      id: 8, 
      icon: <BookOpen size={20} />, 
      label: 'Library',
      onClick: () => console.log('Library clicked')
    }
  ];

  return (
    <div className="absolute inset-0 pointer-events-none">
      {options.map((option, index) => {
        // Calculate position based on angle
        const angle = (index / options.length) * 2 * Math.PI;
        const radius = 200; // Distance from center
        const delay = index * 0.1; // Stagger the animation

        return (
          <OptionButton
            key={option.id}
            option={option}
            angle={angle}
            radius={radius}
            delay={delay}
          />
        );
      })}
    </div>
  );
};

type OptionButtonProps = {
  option: Option;
  angle: number;
  radius: number;
  delay: number;
};

const OptionButton: React.FC<OptionButtonProps> = ({ option, angle, radius, delay }) => {
  // Calculate position
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  return (
    <div
      className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
      style={{
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
        animation: `rotateAroundCenter 20s linear infinite, fadeIn 0.5s ease-out forwards`,
        animationDelay: `0s, ${delay}s`,
        opacity: 0,
      }}
    >
      <button
        onClick={option.onClick}
        className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-md hover:bg-white/20 
                   text-white p-3 rounded-full shadow-lg transition-all duration-300 
                   hover:scale-110 hover:shadow-blue-500/20 group"
        aria-label={option.label}
      >
        {option.icon}
        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                        absolute top-full mt-2 text-xs whitespace-nowrap">
          {option.label}
        </span>
      </button>
    </div>
  );
};