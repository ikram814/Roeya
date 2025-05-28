"use client";
import { useEffect, useState } from "react";

const ThemeVideoCircle = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsDarkTheme(document.documentElement.classList.contains("black-theme"));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    window.addEventListener("themeChange", checkTheme);
    return () => {
      observer.disconnect();
      window.removeEventListener("themeChange", checkTheme);
    };
  }, []);

  const videoSrc = isDarkTheme
    ? "/assets/videos/darkvideo (1).mp4"
    : "/assets/videos/lightvideo (1).mp4";

  return (
    <div className="w-full h-full flex items-center justify-center">
      <video
        key={isDarkTheme ? "dark" : "light"}
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
        style={{ borderRadius: "50%" }}
      />
    </div>
  );
};

export default ThemeVideoCircle; 