"use client";
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
  optionRadius: number; // ignoré, on utilise radius
}

const RotatingOptionsIndividual = ({ options, radius, buttonSize }: Props) => {
  const angleStep = (2 * Math.PI) / options.length;
  const duration = 18; // même vitesse pour toutes
  const animationName = "rotate-individual-right"; // même sens pour toutes
  // Le centre du cercle est à (radius + buttonSize/2, radius + buttonSize/2)
  // On veut que le centre du bouton soit sur la circonférence
  const transformOrigin = `${radius + buttonSize / 2}px ${radius + buttonSize / 2}px`;

  return (
    <>
      {options.map((link, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const x = Math.cos(angle) * radius + radius + buttonSize / 2;
        const y = Math.sin(angle) * radius + radius + buttonSize / 2;
        return (
          <div
            key={link.route}
            className="absolute flex flex-col items-center pointer-events-none"
            style={{
              left: x - buttonSize / 2,
              top: y - buttonSize / 2,
              width: buttonSize,
              height: buttonSize,
              zIndex: 30,
              transformOrigin,
              animation: `${animationName} ${duration}s linear infinite`,
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
      })}
    </>
  );
};

export default RotatingOptionsIndividual; 