"use client";
import { useEffect, useState } from "react";

const BackgroundVideo = () => {
  const [theme, setTheme] = useState<'light'|'black'|'purple'>('light');
  useEffect(() => {
    const checkTheme = () => {
      if (document.documentElement.classList.contains("purple-theme")) setTheme('purple');
      else if (document.documentElement.classList.contains("black-theme")) setTheme('black');
      else setTheme('light');
    };
    checkTheme();
    window.addEventListener("themeChange", checkTheme);
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => {
      window.removeEventListener("themeChange", checkTheme);
      observer.disconnect();
    };
  }, []);
  let videoSrc = "/assets/videos/bleu.mp4";
  if (theme === 'purple') videoSrc = "/assets/videos/violet.mp4";
  else if (theme === 'black') videoSrc = "/assets/videos/noir.mp4";
  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none select-none"
      style={{ minHeight: "100vh", minWidth: "100vw" }}
      src={videoSrc}
    />
  );
};

export default BackgroundVideo; 