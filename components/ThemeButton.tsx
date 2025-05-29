'use client';

import { useState, useEffect } from 'react';

const ThemeButton = ({ className = "" }) => {
  const [theme, setTheme] = useState('light'); // 'light', 'black', 'purple'

  useEffect(() => {
    // Vérifier le thème initial
    const checkTheme = () => {
      if (document.documentElement.classList.contains('black-theme')) setTheme('black');
      else if (document.documentElement.classList.contains('purple-theme')) setTheme('purple');
      else setTheme('light');
    };
    checkTheme();
    window.addEventListener('themeChange', checkTheme);
    return () => window.removeEventListener('themeChange', checkTheme);
  }, []);

  const cycleTheme = () => {
    // Retirer toutes les classes de thème
    document.documentElement.classList.remove('black-theme', 'purple-theme');
    let nextTheme;
    if (theme === 'light') {
      document.documentElement.classList.add('black-theme');
      nextTheme = 'black';
    } else if (theme === 'black') {
      document.documentElement.classList.add('purple-theme');
      nextTheme = 'purple';
    } else {
      nextTheme = 'light';
    }
    setTheme(nextTheme);
    window.dispatchEvent(new Event('themeChange'));
  };

  return (
    <button
      onClick={cycleTheme}
      className={`w-8 h-8 flex items-center justify-center rounded-full border transition-colors duration-300 focus:outline-none ${className}`}
      style={{ background: 'transparent' }}
    >
      <div
        className={`flex items-center justify-center w-8 h-8 rounded-full border transition-colors duration-300 ${theme === 'black' ? 'bg-black border-white' : theme === 'purple' ? 'bg-purple-600 border-purple-300' : 'bg-gray-200 border-gray-300'}`}
        style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }}
      >
        {theme === 'black' ? (
          // Moon Icon
          <span className="flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/><circle cx="17.5" cy="6.5" r="1.5" fill="white"/><circle cx="15.5" cy="10.5" r="1" fill="white"/></svg>
          </span>
        ) : theme === 'purple' ? (
          // Purple Icon
          <span className="flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="purple" stroke="#a259f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="7" fill="#a259f7"/><circle cx="12" cy="12" r="3" fill="#fff"/></svg>
          </span>
        ) : (
          // Sun Icon
          <span className="flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="orange" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><g><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></g></svg>
          </span>
        )}
      </div>
    </button>
  );
};

export default ThemeButton;