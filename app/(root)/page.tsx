import { Collection } from "@/components/shared/Collection";
import { navLinks } from "@/constants";
import { getAllImages } from "@/lib/actions/image.actions";
import Image from "next/image";
import Link from "next/link";
import ThemeVideoCircle from "@/components/ThemeVideoCircle";

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

const Home = async ({ searchParams }: SearchParamProps) => {
  const page = Number(searchParams?.page) || 1;
  const searchQuery = (searchParams?.query as string) || "";
  const images = await getAllImages({ page, searchQuery });

  return (
    <>
      <section
        className="w-full flex justify-center items-center py-2 bg-transparent mt-16 relative"
        style={{ minHeight: CIRCLE_SIZE + 120 }}
      >
        {/* Options à gauche dans les espaces vides */}
        {LEFT_OPTIONS.map((opt, idx) => (
          <Link
            key={opt.key}
            href={opt.route}
            className="option-glow flex flex-col items-center group pointer-events-auto"
            style={{
              position: 'absolute',
              left: `calc(50% + ${LEFT_OPTION_POSITIONS[idx].x}px)`,
              top: `calc(50% + ${LEFT_OPTION_POSITIONS[idx].y}px)`,
              width: BUTTON_SIZE,
              height: BUTTON_SIZE,
              zIndex: 20,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="circle-3d" style={{ width: BUTTON_SIZE, height: BUTTON_SIZE, position: 'relative', zIndex: 1 }}>
              <Image src={opt.icon} alt={opt.label} width={56} height={56} />
            </div>
            <span className="feature-text group-hover:text-purple-500 transition-colors text-xs mt-1 w-24 text-center" style={{ fontSize: 13 }}>{opt.label}</span>
          </Link>
        ))}
        {/* Cercle central avec vidéo */}
        <div
          className="rounded-full overflow-hidden shadow-2xl border-4 border-white/20 bg-white dark:bg-black flex items-center justify-center"
          style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE, zIndex: 10 }}
        >
          <ThemeVideoCircle />
        </div>
        {/* Options à droite dans les espaces vides */}
        {RIGHT_OPTIONS.map((opt, idx) => (
          <Link
            key={opt.key}
            href={opt.route}
            className="option-glow flex flex-col items-center group pointer-events-auto"
            style={{
              position: 'absolute',
              left: `calc(50% + ${RIGHT_OPTION_POSITIONS[idx].x}px)`,
              top: `calc(50% + ${RIGHT_OPTION_POSITIONS[idx].y}px)`,
              width: BUTTON_SIZE,
              height: BUTTON_SIZE,
              zIndex: 20,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="circle-3d" style={{ width: BUTTON_SIZE, height: BUTTON_SIZE, position: 'relative', zIndex: 1 }}>
              <Image src={opt.icon} alt={opt.label} width={56} height={56} />
            </div>
            <span className="feature-text group-hover:text-purple-500 transition-colors text-xs mt-1 w-24 text-center" style={{ fontSize: 13 }}>{opt.label}</span>
          </Link>
        ))}
      </section>

      <section className="sm:mt-12">
        <Collection
          images={images?.data}
          totalPages={images?.totalPage}
          page={page}
        />
      </section>
    </>
  );
};

export default Home;