import { Collection } from "@/components/shared/Collection";
import { navLinks } from "@/constants";
import { getAllImages } from "@/lib/actions/image.actions";
import Image from "next/image";
import Link from "next/link";
import ThemeVideoCircle from "@/components/ThemeVideoCircle";
import { useEffect, useState } from "react";
import BackgroundVideo from "../../components/BackgroundVideo";

const CIRCLE_SIZE = 500; // taille du cercle central (px)
const BUTTON_SIZE = 90; // taille des boutons (px)
const RADIUS = CIRCLE_SIZE / 2; // rayon du cercle
const CENTER_X = 0.5; // pour centrer par rapport à la largeur du parent
const CENTER_Y = 0.5; // pour centrer par rapport à la hauteur du parent

// Placement manuel pour chaque option (x, y) en px relatif au centre du cercle
// (x < 0 = gauche du cercle, x > 0 = droite du cercle, y < 0 = haut, y > 0 = bas)
const LEFT_OPTION_POSITIONS = [
  { x: -RADIUS - 100, y: -RADIUS / 2 }, // Object Remove (haut gauche)
  { x: -RADIUS - 250, y: 0 },           // Object Recolor (milieu gauche)
  { x: -RADIUS - 100, y: RADIUS / 2 },  // Generative Fill (bas gauche)
];
const RIGHT_OPTION_POSITIONS = [
  { x: RADIUS + 100, y: -RADIUS / 2 },  // Image Generator (haut droite)
  { x: RADIUS + 250, y: 0 },            // Background Remove (milieu droite)
  { x: RADIUS + 100, y: RADIUS / 2 },   // Image Restore (bas droite)
];

const LEFT_OPTIONS = [
  {
    key: "remove",
    label: "Object Remove",
    route: "/transformations/add/remove",
    icon: "/assets/icons/remove-3d.png",
  },
  {
    key: "recolor",
    label: "Object Recolor",
    route: "/transformations/add/recolor",
    icon: "/assets/icons/recolor-3d.png",
  },
  {
    key: "fill",
    label: "Generative Fill",
    route: "/transformations/add/fill",
    icon: "/assets/icons/Fill-3d.png",
  },
];
const RIGHT_OPTIONS = [
  {
    key: "generator",
    label: "Image Generator",
    route: "/image-generator",
    icon: "/assets/icons/generator-3d.png",
  },
  {
    key: "background",
    label: "Background Remove",
    route: "/transformations/add/removeBackground",
    icon: "/assets/icons/back-3d.png",
  },
  {
    key: "restore",
    label: "Image Restore",
    route: "/transformations/add/restore",
    icon: "/assets/icons/restore-3d.png",
  },
];

const ART_BUBBLES_LEFT = [
  { src: "/assets/images/a1.png", style: { top: "10%", left: "-15%", width: 170, height: 170 } },
  { src: "/assets/images/a9.png", style: { top: "50%", left: "-18%" } },
  { src: "/assets/images/a2.png", style: { top: "45%", left: "-1%" , width: 200, height: 200 }  },
  { src: "/assets/images/a5.png", style: { top: "85%", left: "-14%" ,width: 150, height: 150 } },
];
const ART_BUBBLES_RIGHT = [
  { src: "/assets/images/a4.png", style: { top: "10%", right: "-15%", width: 160, height: 160 } },
  { src: "/assets/images/a3.png", style: { top: "50%", right: "-18%" } },
  { src: "/assets/images/a6.png", style: { top: "45%", right: "-1%", width: 200, height: 200 } },
  { src: "/assets/images/a8.png", style: { top: "85%", right: "-14%", width: 150, height: 150 } },
];


const Home = async ({ searchParams }: SearchParamProps) => {
  const page = Number(searchParams?.page) || 1;
  const searchQuery = (searchParams?.query as string) || "";
  const images = await getAllImages({ page, searchQuery });

  return (
    <>
      <BackgroundVideo />
      {/* Section centrale avec cercles et titre */}
      <div className="w-full flex flex-col items-center justify-center relative" style={{ minHeight: '70vh' }}>
        {/* Cercles décoratifs à gauche */}
        {ART_BUBBLES_LEFT.map((bubble, i) => (
          <div
            key={"left-"+i}
            className="ai-bubble"
            style={{ position: "absolute", width: 120, height: 120, borderRadius: "50%", overflow: "hidden", boxShadow: "0 4px 24px #0002", ...bubble.style, zIndex: 2 }}
          >
            <Image src={bubble.src} alt="art" fill style={{ objectFit: "cover" }} />
          </div>
        ))}
        {/* Cercles décoratifs à droite */}
        {ART_BUBBLES_RIGHT.map((bubble, i) => (
          <div
            key={"right-"+i}
            className="ai-bubble"
            style={{ position: "absolute", width: 120, height: 120, borderRadius: "50%", overflow: "hidden", boxShadow: "0 4px 24px #0002", ...bubble.style, zIndex: 2 }}
          >
            <Image src={bubble.src} alt="art" fill style={{ objectFit: "cover" }} />
          </div>
        ))}
        {/* Titre et barre centrale */}
        <div className="flex flex-col items-center justify-center z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-center mb-4 ai-gradient-text">
            Create beautiful art with <br /> Artificial Intelligence
          </h1>
          <p className="text-2xl md:text-3xl text-center mb-6 text-gray-700/80">Welcome to ROEYA</p>
          <div className="ai-generator-bar flex justify-center items-center bg-white/90 rounded-full shadow-lg px-4 py-2 gap-2">
            <Link href="/image-generator" className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-full font-semibold transition text-center">Image Generator</Link>
            <Link href="/dashboard/create-new" className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-full font-semibold transition text-center">Video Generator</Link>
          </div>
          <div className="flex gap-2 mt-4 flex-wrap justify-center">
            {["Creative", "Futuristic", "Steampunk", "Gothic", "Space"].map(tag => (
              <span key={tag} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-purple-200 transition">{tag}</span>
            ))}
          </div>
        </div>
      </div>
      {/* Galerie en bas */}
      <div className="gallery-full-width">
        <Collection
          images={images?.data}
          totalPages={images?.totalPage}
          page={page}
        />
      </div>
    </>
  );
};

export default Home;