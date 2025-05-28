"use client";
import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

interface Option {
  label: string;
  route: string;
  icon: string;
}

interface Props {
  options: Option[];
  radius: number;
  buttonSize: number;
  optionRadius: number;
}

function shuffleArray<T>(array: T[]): T[] {
  // Durstenfeld shuffle
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const RotatingOptionsRandomized = ({ options, radius, buttonSize, optionRadius }: Props) => {
  // Répartition aléatoire à chaque rendu client
  const { rightOptions, leftOptions } = useMemo(() => {
    const shuffled = shuffleArray(options);
    return {
      rightOptions: shuffled.slice(0, 3),
      leftOptions: shuffled.slice(3),
    };
  }, [options]);

  const renderOptions = (opts: Option[], total: number, direction: "right" | "left") => {
    const angleStep = (2 * Math.PI) / options.length;
    return opts.map((link) => {
      const i = options.findIndex((o) => o.route === link.route);
      const angle = i * angleStep - Math.PI / 2;
      const x = Math.cos(angle) * optionRadius + radius;
      const y = Math.sin(angle) * optionRadius + radius;
      return (
        <div
          key={link.route}
          className="option-rotate absolute flex flex-col items-center"
          style={{
            left: x - buttonSize / 2,
            top: y - buttonSize / 2,
            width: buttonSize,
            height: buttonSize,
            transform: `rotate(${-((360 / options.length) * i)}deg)`
          }}
        >
          <Link
            href={link.route}
            className="flex flex-col items-center group pointer-events-auto"
            style={{ width: buttonSize, height: buttonSize }}
          >
            <div className="circle-3d" style={{ width: buttonSize, height: buttonSize }}>
              <Image src={link.icon} alt={link.label} width={56} height={56} />
            </div>
            <span className="feature-text group-hover:text-purple-500 transition-colors text-xs mt-1 w-24 text-center" style={{ fontSize: 13 }}>{link.label}</span>
          </Link>
        </div>
      );
    });
  };

  return (
    <>
      <div className="absolute top-0 left-0 w-full h-full rotating-options-right pointer-events-none" style={{ zIndex: 20 }}>
        {renderOptions(rightOptions, options.length, "right")}
      </div>
      <div className="absolute top-0 left-0 w-full h-full rotating-options-left pointer-events-none" style={{ zIndex: 20 }}>
        {renderOptions(leftOptions, options.length, "left")}
      </div>
    </>
  );
};

export default RotatingOptionsRandomized; 