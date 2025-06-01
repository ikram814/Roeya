"use client";
import React, { useEffect, useState } from "react";

export default function AddTransformationTypePageClient({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const checkTheme = () => {
      if (document.documentElement.classList.contains("black-theme")) setTheme("black");
      else if (document.documentElement.classList.contains("purple-theme")) setTheme("purple");
      else setTheme("light");
    };
    checkTheme();
    window.addEventListener("themeChange", checkTheme);
    return () => window.removeEventListener("themeChange", checkTheme);
  }, []);

  return (
    <div
      className="min-h-screen"
      style={
        theme === "light"
          ? { background: "radial-gradient(circle at 50% 0%, #e0f2ff 0%, #f5faff 60%, #fff 100%)" }
          : undefined
      }
    >
      {children}
    </div>
  );
} 