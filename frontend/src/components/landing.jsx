import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FSBM from "../images/fsbm.png";
import DEPT from "../images/dept.jpeg";
import FILIERE from "../images/filiere.png";

/* ── Google Font injection ── */
if (!document.getElementById("hemoscan-font")) {
  const link = document.createElement("link");
  link.id = "hemoscan-font";
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap";
  document.head.appendChild(link);
}

/* ── CSS Keyframes injection ── */
if (!document.getElementById("hemoscan-keyframes")) {
  const style = document.createElement("style");
  style.id = "hemoscan-keyframes";
  style.textContent = `
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

    @keyframes floatOrbit0 {
      0%   { transform: translate(0px,   0px)   scale(1)    rotate(0deg); }
      25%  { transform: translate(60px, -40px)  scale(1.08) rotate(8deg); }
      50%  { transform: translate(110px, 20px)  scale(0.95) rotate(-4deg); }
      75%  { transform: translate(50px,  70px)  scale(1.05) rotate(12deg); }
      100% { transform: translate(0px,   0px)   scale(1)    rotate(0deg); }
    }
    @keyframes floatOrbit1 {
      0%   { transform: translate(120px, 10px)  scale(0.9)  rotate(0deg); }
      25%  { transform: translate(40px,  80px)  scale(1.1)  rotate(-10deg); }
      50%  { transform: translate(-20px, 30px)  scale(1)    rotate(6deg); }
      75%  { transform: translate(80px, -30px)  scale(1.06) rotate(-6deg); }
      100% { transform: translate(120px, 10px)  scale(0.9)  rotate(0deg); }
    }
    @keyframes floatOrbit2 {
      0%   { transform: translate(60px,  80px)  scale(1.05) rotate(0deg); }
      25%  { transform: translate(-10px, 20px)  scale(0.92) rotate(15deg); }
      50%  { transform: translate(90px, -20px)  scale(1.08) rotate(-8deg); }
      75%  { transform: translate(130px, 60px)  scale(0.97) rotate(5deg); }
      100% { transform: translate(60px,  80px)  scale(1.05) rotate(0deg); }
    }
    @keyframes floatOrbit3 {
      0%   { transform: translate(100px, 60px)  scale(1)    rotate(0deg); }
      25%  { transform: translate(20px, -10px)  scale(1.09) rotate(-12deg); }
      50%  { transform: translate(-10px, 70px)  scale(0.93) rotate(7deg); }
      75%  { transform: translate(70px,  100px) scale(1.04) rotate(-3deg); }
      100% { transform: translate(100px, 60px)  scale(1)    rotate(0deg); }
    }

    @keyframes glow0 {
      0%,100% { box-shadow: 0 8px 40px rgba(249,115,22,0.35), 0 2px 12px rgba(249,115,22,0.2); }
      50%      { box-shadow: 0 16px 60px rgba(249,115,22,0.55), 0 4px 20px rgba(249,115,22,0.3); }
    }
    @keyframes glow1 {
      0%,100% { box-shadow: 0 8px 40px rgba(22,163,74,0.35), 0 2px 12px rgba(22,163,74,0.2); }
      50%      { box-shadow: 0 16px 60px rgba(22,163,74,0.55), 0 4px 20px rgba(22,163,74,0.3); }
    }
    @keyframes glow2 {
      0%,100% { box-shadow: 0 8px 40px rgba(37,99,235,0.35), 0 2px 12px rgba(37,99,235,0.2); }
      50%      { box-shadow: 0 16px 60px rgba(37,99,235,0.55), 0 4px 20px rgba(37,99,235,0.3); }
    }
    @keyframes glow3 {
      0%,100% { box-shadow: 0 8px 40px rgba(220,38,38,0.35), 0 2px 12px rgba(220,38,38,0.2); }
      50%      { box-shadow: 0 16px 60px rgba(220,38,38,0.55), 0 4px 20px rgba(220,38,38,0.3); }
    }

    @keyframes spinSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes nucleusPulse {
      0%,100% { r: 13; opacity: 0.85; }
      50%      { r: 15; opacity: 0.95; }
    }
  `;
  document.head.appendChild(style);
}

/* ── Typewriter ── */
const LINES = [
  "Analysez vos globules blancs en quelques secondes.",
  "Une image microscopique suffit.",
  "VGG16identifie  Éosinophiles, Lymphocytes, Monocytes et Neutrophiles.",
  "Médecine augmentée. Diagnostic assisté par l'IA.",
];

function Typewriter() {
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [pausing, setPausing] = useState(false);

  useEffect(() => {
    if (pausing) {
      const t = setTimeout(() => {
        setDisplayed(""); setCharIdx(0);
        setLineIdx((i) => (i + 1) % LINES.length);
        setPausing(false);
      }, 2200);
      return () => clearTimeout(t);
    }
    const line = LINES[lineIdx];
    if (charIdx < line.length) {
      const t = setTimeout(() => {
        setDisplayed(line.slice(0, charIdx + 1));
        setCharIdx((c) => c + 1);
      }, 36);
      return () => clearTimeout(t);
    } else { setPausing(true); }
  }, [charIdx, lineIdx, pausing]);

  return (
    <p style={S.typewriter}>
      {displayed}<span style={S.cursor}>|</span>
    </p>
  );
}

/* ── HERO 3D Floating Cells (different designs, no labels) ── */
const HERO_CELLS_SVG = [
  /* Éosinophile – bilobed, glassy 3D sphere style */
  {
    animName: "floatOrbit0",
    glowAnim: "glow0",
    duration: "11s",
    size: 110,
    color: "#f97316",
    svg: (
      <svg viewBox="0 0 110 110" width="110" height="110">
        {/* outer membrane with radial gradient */}
        <defs>
          <radialGradient id="hg0" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#fff7ed"/>
            <stop offset="60%" stopColor="#fed7aa"/>
            <stop offset="100%" stopColor="#ea580c"/>
          </radialGradient>
          <radialGradient id="hn0" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#fb923c"/>
            <stop offset="100%" stopColor="#9a3412"/>
          </radialGradient>
        </defs>
        <circle cx="55" cy="55" r="50" fill="url(#hg0)" opacity="0.95"/>
        {/* highlight */}
        <ellipse cx="42" cy="38" rx="14" ry="9" fill="white" opacity="0.28" transform="rotate(-20,42,38)"/>
        {/* bilobed nucleus */}
        <ellipse cx="42" cy="55" rx="13" ry="17" fill="url(#hn0)" opacity="0.9"/>
        <ellipse cx="68" cy="55" rx="13" ry="17" fill="url(#hn0)" opacity="0.9"/>
        <rect x="51" y="48" width="8" height="4" rx="2" fill="#7c2d12" opacity="0.7"/>
        {/* granules */}
        {[[28,36],[46,30],[68,28],[85,40],[87,62],[74,78],[52,82],[30,74],[18,58],[20,44]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r="4" fill="#fb923c" opacity="0.7">
            <animate attributeName="r" values="4;5;4" dur={`${2+i*0.3}s`} repeatCount="indefinite"/>
          </circle>
        ))}
        {/* specular */}
        <circle cx="38" cy="33" r="5" fill="white" opacity="0.15"/>
      </svg>
    ),
  },
  /* Lymphocyte – large nucleus, 3D */
  {
    animName: "floatOrbit1",
    glowAnim: "glow1",
    duration: "14s",
    size: 95,
    color: "#16a34a",
    svg: (
      <svg viewBox="0 0 95 95" width="95" height="95">
        <defs>
          <radialGradient id="hg1" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#f0fdf4"/>
            <stop offset="55%" stopColor="#bbf7d0"/>
            <stop offset="100%" stopColor="#15803d"/>
          </radialGradient>
          <radialGradient id="hn1" cx="38%" cy="33%" r="60%">
            <stop offset="0%" stopColor="#4ade80"/>
            <stop offset="100%" stopColor="#14532d"/>
          </radialGradient>
        </defs>
        <circle cx="47" cy="47" r="44" fill="url(#hg1)" opacity="0.95"/>
        <ellipse cx="35" cy="33" rx="12" ry="8" fill="white" opacity="0.25" transform="rotate(-15,35,33)"/>
        <circle cx="47" cy="47" r="32" fill="url(#hn1)" opacity="0.9"/>
        <circle cx="43" cy="43" r="9" fill="#166534" opacity="0.65"/>
        {[[55,38],[59,50],[52,61],[40,62],[35,51]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r="2.5" fill="#14532d" opacity="0.45"/>
        ))}
        <circle cx="33" cy="30" r="4" fill="white" opacity="0.15"/>
      </svg>
    ),
  },
  /* Monocyte – kidney nucleus, 3D */
  {
    animName: "floatOrbit2",
    glowAnim: "glow2",
    duration: "12s",
    size: 120,
    color: "#2563eb",
    svg: (
      <svg viewBox="0 0 120 120" width="120" height="120">
        <defs>
          <radialGradient id="hg2" cx="33%" cy="28%" r="68%">
            <stop offset="0%" stopColor="#eff6ff"/>
            <stop offset="58%" stopColor="#bfdbfe"/>
            <stop offset="100%" stopColor="#1d4ed8"/>
          </radialGradient>
          <radialGradient id="hn2" cx="38%" cy="33%" r="62%">
            <stop offset="0%" stopColor="#60a5fa"/>
            <stop offset="100%" stopColor="#1e3a8a"/>
          </radialGradient>
        </defs>
        <ellipse cx="60" cy="62" rx="54" ry="50" fill="url(#hg2)" opacity="0.95"/>
        <ellipse cx="42" cy="36" rx="16" ry="10" fill="white" opacity="0.22" transform="rotate(-20,42,36)"/>
        <path d="M36 46 Q28 61 36 76 Q46 88 60 84 Q79 82 85 67 Q91 52 79 43 Q67 35 52 39 Q43 41 36 46Z"
              fill="url(#hn2)" opacity="0.88"/>
        <path d="M55 83 Q60 71 65 83" fill="#eff6ff" opacity="0.5"/>
        {[[30,55],[88,57],[44,88],[76,88]].map(([x,y],i)=>(
          <ellipse key={i} cx={x} cy={y} rx="5" ry="4" fill="none" stroke="#93c5fd" strokeWidth="1.5" opacity="0.55"/>
        ))}
        <circle cx="40" cy="32" r="5" fill="white" opacity="0.14"/>
      </svg>
    ),
  },
  /* Neutrophile – multilobed, 3D */
  {
    animName: "floatOrbit3",
    glowAnim: "glow3",
    duration: "15s",
    size: 105,
    color: "#dc2626",
    svg: (
      <svg viewBox="0 0 105 105" width="105" height="105">
        <defs>
          <radialGradient id="hg3" cx="33%" cy="28%" r="68%">
            <stop offset="0%" stopColor="#fff1f2"/>
            <stop offset="55%" stopColor="#fecdd3"/>
            <stop offset="100%" stopColor="#b91c1c"/>
          </radialGradient>
          <radialGradient id="hn3" cx="38%" cy="32%" r="62%">
            <stop offset="0%" stopColor="#f87171"/>
            <stop offset="100%" stopColor="#7f1d1d"/>
          </radialGradient>
        </defs>
        <circle cx="52" cy="52" r="49" fill="url(#hg3)" opacity="0.95"/>
        <ellipse cx="38" cy="31" rx="14" ry="9" fill="white" opacity="0.22" transform="rotate(-20,38,31)"/>
        {/* 4 lobes */}
        <circle cx="52" cy="34" r="13" fill="url(#hn3)" opacity="0.88"/>
        <circle cx="72" cy="50" r="13" fill="url(#hn3)" opacity="0.88"/>
        <circle cx="64" cy="72" r="13" fill="url(#hn3)" opacity="0.88"/>
        <circle cx="40" cy="70" r="13" fill="url(#hn3)" opacity="0.88"/>
        {/* connectors */}
        <line x1="52" y1="46" x2="64" y2="52" stroke="#991b1b" strokeWidth="5" strokeLinecap="round" opacity="0.7"/>
        <line x1="70" y1="62" x2="66" y2="69" stroke="#991b1b" strokeWidth="5" strokeLinecap="round" opacity="0.7"/>
        <line x1="54" y1="74" x2="45" y2="72" stroke="#991b1b" strokeWidth="5" strokeLinecap="round" opacity="0.7"/>
        {[[26,40],[22,60],[30,78],[84,66],[85,46],[47,24],[69,22]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r="3" fill="#ef4444" opacity="0.55"/>
        ))}
        <circle cx="35" cy="28" r="5" fill="white" opacity="0.14"/>
      </svg>
    ),
  },
];

/* ── 3D floating hero display ── */
function HeroFloatingCells() {
  return (
    <div style={S.heroFloatContainer}>
      {HERO_CELLS_SVG.map((cell, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            borderRadius: "50%",
            animation: `${cell.animName} ${cell.duration} ease-in-out infinite, ${cell.glowAnim} ${parseFloat(cell.duration)*0.7}s ease-in-out infinite`,
            animationDelay: `${i * -3.5}s, ${i * -2}s`,
            transition: "transform 0.3s",
          }}
        >
          {cell.svg}
        </div>
      ))}
    </div>
  );
}

/* ── Section Cells (centered row, with info) — different SVG designs ── */
const SECTION_CELLS = [
  {
    name: "Éosinophile",
    color: "#f97316",
    bg: "linear-gradient(135deg,#fff7ed 60%,#fde8d0)",
    border: "#fed7aa",
    desc: "Leucocyte bilobé aux granules orangés caractéristiques. Impliqué dans la réponse allergique et la défense contre les parasites. Représente 1–4 % des leucocytes sanguins.",
    svg: (
      <svg viewBox="0 0 140 140" width="140" height="140">
        <defs>
          <radialGradient id="sg0" cx="35%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#ffedd5"/>
            <stop offset="60%" stopColor="#fdba74"/>
            <stop offset="100%" stopColor="#c2410c"/>
          </radialGradient>
        </defs>
        <ellipse cx="70" cy="70" rx="62" ry="58" fill="url(#sg0)" opacity="0.95" stroke="#f97316" strokeWidth="1.5"/>
        <ellipse cx="47" cy="67" rx="16" ry="21" fill="#ea580c" opacity="0.88"/>
        <ellipse cx="82" cy="67" rx="16" ry="21" fill="#ea580c" opacity="0.88"/>
        <rect x="59" y="61" width="10" height="4.5" rx="2.2" fill="#7c2d12" opacity="0.65"/>
        {[[34,46],[56,40],[78,38],[98,50],[102,72],[88,90],[62,96],[36,88],[20,68],[24,52]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r="5" fill="#fb923c" opacity="0.72"/>
        ))}
        <ellipse cx="50" cy="44" rx="14" ry="8" fill="white" opacity="0.2" transform="rotate(-20,50,44)"/>
      </svg>
    ),
  },
  {
    name: "Lymphocyte",
    color: "#16a34a",
    bg: "linear-gradient(135deg,#f0fdf4 60%,#d1fae5)",
    border: "#bbf7d0",
    desc: "Cellule immunitaire à grand noyau et peu de cytoplasme. Pilier de l'immunité adaptative (lymphocytes B et T). Représente 20–40 % des leucocytes sanguins.",
    svg: (
      <svg viewBox="0 0 140 140" width="140" height="140">
        <defs>
          <radialGradient id="sg1" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#f0fdf4"/>
            <stop offset="55%" stopColor="#86efac"/>
            <stop offset="100%" stopColor="#15803d"/>
          </radialGradient>
          <radialGradient id="sn1" cx="38%" cy="34%" r="60%">
            <stop offset="0%" stopColor="#4ade80"/>
            <stop offset="100%" stopColor="#14532d"/>
          </radialGradient>
        </defs>
        <circle cx="70" cy="70" r="62" fill="url(#sg1)" opacity="0.95" stroke="#16a34a" strokeWidth="1.5"/>
        <circle cx="70" cy="70" r="46" fill="url(#sn1)" opacity="0.9"/>
        <circle cx="62" cy="64" r="11" fill="#166534" opacity="0.62"/>
        {[[80,52],[86,68],[76,82],[60,84],[52,70]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r="3.5" fill="#14532d" opacity="0.44"/>
        ))}
        <ellipse cx="52" cy="44" rx="14" ry="9" fill="white" opacity="0.2" transform="rotate(-18,52,44)"/>
      </svg>
    ),
  },
  {
    name: "Monocyte",
    color: "#2563eb",
    bg: "linear-gradient(135deg,#eff6ff 60%,#dbeafe)",
    border: "#bfdbfe",
    desc: "Le plus grand leucocyte, à noyau en fer à cheval. Se différencie en macrophage dans les tissus. Représente 2–8 % des leucocytes sanguins.",
    svg: (
      <svg viewBox="0 0 140 140" width="140" height="140">
        <defs>
          <radialGradient id="sg2" cx="33%" cy="28%" r="68%">
            <stop offset="0%" stopColor="#eff6ff"/>
            <stop offset="58%" stopColor="#93c5fd"/>
            <stop offset="100%" stopColor="#1d4ed8"/>
          </radialGradient>
          <radialGradient id="sn2" cx="38%" cy="33%" r="62%">
            <stop offset="0%" stopColor="#60a5fa"/>
            <stop offset="100%" stopColor="#1e3a8a"/>
          </radialGradient>
        </defs>
        <ellipse cx="70" cy="74" rx="64" ry="60" fill="url(#sg2)" opacity="0.95" stroke="#2563eb" strokeWidth="1.5"/>
        <path d="M44 54 Q34 72 44 90 Q56 103 70 99 Q92 97 100 80 Q108 62 94 52 Q80 42 62 47 Q52 50 44 54Z"
              fill="url(#sn2)" opacity="0.88"/>
        <path d="M65 99 Q70 84 75 99" fill="#eff6ff" opacity="0.55"/>
        {[[36,66],[104,68],[52,104],[88,104]].map(([x,y],i)=>(
          <ellipse key={i} cx={x} cy={y} rx="6" ry="5" fill="none" stroke="#93c5fd" strokeWidth="1.5" opacity="0.55"/>
        ))}
        <ellipse cx="48" cy="38" rx="16" ry="9" fill="white" opacity="0.18" transform="rotate(-20,48,38)"/>
      </svg>
    ),
  },
  {
    name: "Neutrophile",
    color: "#dc2626",
    bg: "linear-gradient(135deg,#fff1f2 60%,#ffe4e6)",
    border: "#fecdd3",
    desc: "Première ligne de défense contre les infections bactériennes. Noyau polylobé (3–5 lobes) très caractéristique. Représente 50–70 % des leucocytes sanguins.",
    svg: (
      <svg viewBox="0 0 140 140" width="140" height="140">
        <defs>
          <radialGradient id="sg3" cx="33%" cy="28%" r="68%">
            <stop offset="0%" stopColor="#fff1f2"/>
            <stop offset="55%" stopColor="#fca5a5"/>
            <stop offset="100%" stopColor="#b91c1c"/>
          </radialGradient>
          <radialGradient id="sn3" cx="38%" cy="32%" r="62%">
            <stop offset="0%" stopColor="#f87171"/>
            <stop offset="100%" stopColor="#7f1d1d"/>
          </radialGradient>
        </defs>
        <circle cx="70" cy="70" r="62" fill="url(#sg3)" opacity="0.95" stroke="#dc2626" strokeWidth="1.5"/>
        <circle cx="70" cy="44" r="16" fill="url(#sn3)" opacity="0.88"/>
        <circle cx="96" cy="64" r="16" fill="url(#sn3)" opacity="0.88"/>
        <circle cx="86" cy="96" r="16" fill="url(#sn3)" opacity="0.88"/>
        <circle cx="54" cy="96" r="16" fill="url(#sn3)" opacity="0.88"/>
        <line x1="70" y1="58" x2="84" y2="64" stroke="#991b1b" strokeWidth="6" strokeLinecap="round" opacity="0.7"/>
        <line x1="94" y1="78" x2="88" y2="88" stroke="#991b1b" strokeWidth="6" strokeLinecap="round" opacity="0.7"/>
        <line x1="74" y1="98" x2="62" y2="96" stroke="#991b1b" strokeWidth="6" strokeLinecap="round" opacity="0.7"/>
        {[[32,52],[26,72],[36,96],[108,84],[110,60],[60,26],[84,24]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r="4" fill="#ef4444" opacity="0.55"/>
        ))}
        <ellipse cx="46" cy="35" rx="16" ry="9" fill="white" opacity="0.18" transform="rotate(-20,46,35)"/>
      </svg>
    ),
  },
];

function SectionCellCards() {
  const [active, setActive] = useState(null);
  return (
    <div style={S.sectionCellsRow}>
      {SECTION_CELLS.map((cell) => (
        <div
          key={cell.name}
          style={{
            ...S.sectionCellCard,
            background: cell.bg,
            borderColor: active === cell.name ? cell.color : cell.border,
            boxShadow: active === cell.name
              ? `0 12px 40px ${cell.color}28, 0 0 0 2px ${cell.color}44`
              : "0 4px 18px rgba(0,0,0,0.06)",
            transform: active === cell.name ? "translateY(-6px)" : "none",
          }}
          onMouseEnter={() => setActive(cell.name)}
          onMouseLeave={() => setActive(null)}
        >
          <div style={S.sectionCellSvgWrap}>{cell.svg}</div>
          <p style={{ ...S.sectionCellName, color: cell.color }}>{cell.name}</p>
          <p style={S.sectionCellDesc}>{cell.desc}</p>
        </div>
      ))}
    </div>
  );
}

/* ── Person Card ── */
function PersonCard({ name, role, desc, imgSrc, badge }) {
  return (
    <div style={S.personCard}>
      <div style={S.personImgWrap}>
        {imgSrc
          ? <img src={imgSrc} alt={name} style={S.personImg} />
          : <div style={S.personImgPlaceholder}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="1.5">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
            </div>
        }
        {badge && <span style={S.personBadge}>{badge}</span>}
      </div>
      <h3 style={S.personName}>{name}</h3>
      <p style={S.personRole}>{role}</p>
      {desc && <p style={S.personDesc}>{desc}</p>}
    </div>
  );
}

/* ── Logo Box using imported images ── */
const LOGO_DATA = [
  { src: FSBM,    label: "Faculté des Sciences Ben M'Sik", sub: "FSBM" },
  { src: DEPT,    label: "Département Informatique",        sub: "DT· FSBM" },
  { src: FILIERE, label: "Licence Excellence IA",           sub: "L3 · Intelligence Artificielle" },
];

function LogoBox({ src, label, sub }) {
  return (
    <div style={S.logoBox}>
      <img src={src} alt={label} style={S.logoBoxImg} />
      <p style={S.logoBoxLabel}>{label}</p>
      {sub && <p style={S.logoBoxSub}>{sub}</p>}
    </div>
  );
}

/* ── Main ── */
export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={S.page}>

      {/* ── Header ── */}
      <header style={S.header}>
        <div style={S.logo}>MedCell <span style={S.red}>AI</span></div>
        <nav style={S.nav}>
          <a style={S.navLink} href="#about">À propos</a>
          <a style={S.navLink} href="#how">Pipeline</a>
          <a style={S.navLink} href="#cells">Cellules</a>
          <a style={S.navLink} href="#team">Étudiants</a>
          <a style={S.navLink} href="#supervision">Encadrement</a>
          <button style={S.navBtn} onClick={() => navigate("/predict")}>
            Lancer l'analyse →
          </button>
        </nav>
      </header>

      {/* ── Hero ── */}
      <main style={S.hero}>
        <div style={S.heroLeft}>
          <span style={S.eyebrow}>Deep Learning · Hématologie · IA</span>
          <h1 style={S.headline}>
            Identification automatique des<br />
            <span style={S.red}>globules blancs</span>
          </h1>
          <Typewriter />
          <div style={S.heroBadges}>
            <span style={S.heroBadge}>VGG16</span>
            <span style={S.heroBadge}>4 classes</span>
            <span style={S.heroBadge}>Licence Excellence IA</span>
          </div>
          <button style={S.cta} onClick={() => navigate("/predict")}>
            Analyser une image →
          </button>
        </div>
        <div style={S.heroRight}>
          <HeroFloatingCells />
        </div>
      </main>

      {/* ── About ── */}
      <section id="about" style={S.aboutSection}>
        <div style={S.logosRow}>
          {LOGO_DATA.map((logo, i) => (
            <>
              <LogoBox key={logo.label} src={logo.src} label={logo.label} sub={logo.sub} />
              {i < LOGO_DATA.length - 1 && <div key={`div-${i}`} style={S.logosDivider} />}
            </>
          ))}
        </div>
        <div style={S.aboutInner}>
          <div style={S.aboutText}>
            <p style={S.sectionEyebrow}>Contexte académique</p>
            <h2 style={S.sectionTitle}>Projet de fin de module</h2>
            <p style={S.aboutDesc}>
              Ce projet a été réalisé dans le cadre du module <strong>Deep Learning</strong> de la
              <strong> Licence d'Excellence en Intelligence Artificielle</strong> à la
              <strong> Faculté des Sciences Ben M'Sik</strong>, Université Hassan II de Casablanca.
            </p>
            <p style={S.aboutDesc}>
              L'objectif est de développer un système de classification automatique des leucocytes
              (globules blancs) à partir d'images microscopiques, en s'appuyant sur le réseau de
              neurones convolutif ResNet-50 pré-entraîné et fine-tuné sur un jeu de données hématologique.
            </p>
          </div>
        </div>
      </section>

      {/* ── Pipeline ── */}
      <section id="how" style={S.section}>
        <p style={S.sectionEyebrow}>Pipeline</p>
        <h2 style={S.sectionTitle}>Comment ça marche</h2>
        <div style={S.steps}>
          {[
            { n:"01", title:"Upload",        desc:"Importez une image microscopique JPEG ou PNG." },
            { n:"02", title:"Prétraitement", desc:"Redimensionnement automatique à 224×224 px." },
            { n:"03", title:"VGG16",     desc:"Le réseau analyse les caractéristiques visuelles cellulaires." },
            { n:"04", title:"Résultat",      desc:"Type de cellule et probabilités affichés instantanément." },
          ].map((s) => (
            <div key={s.n} style={S.stepCard}>
              <span style={S.stepN}>{s.n}</span>
              <h3 style={S.stepTitle}>{s.title}</h3>
              <p style={S.stepDesc}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Cell illustrations ── */}
      <section id="cells" style={S.cellsSection}>
        <p style={S.sectionEyebrow}>Classifications</p>
        <h2 style={S.sectionTitle}>Les 4 types de leucocytes détectés</h2>
        <p style={S.cellsSub}>
          Chaque illustration représente la morphologie caractéristique du type cellulaire
          telle qu'observée sur frottis sanguin coloré.
        </p>
        <SectionCellCards />
      </section>

      {/* ── Students ── */}
      <section id="team" style={S.teamSection}>
        <p style={S.sectionEyebrow}>Réalisé par</p>
        <h2 style={S.sectionTitle}>Les étudiants</h2>
        <div style={S.teamGrid}>
          <PersonCard
            name="SIF Souhail"
            role="Licence Excellence IA — FSBM"
            desc="Bac+2 en développement des systèmes d'information · BTS Casablanca"
            imgSrc={null}
            badge="21 ans"
          />
          <PersonCard
            name="CHAKOUR Mohammed"
            role="Licence Excellence IA — FSBM"
            desc="Bac+2 en génie informatique spécialité génie logiciel · EST Meknès"
            imgSrc={null}
            badge="21 ans"
          />
        </div>
      </section>

      {/* ── Supervision ── */}
      <section id="supervision" style={{ ...S.teamSection, background: "#fff" }}>
        <p style={S.sectionEyebrow}>Encadrement</p>
        <h2 style={S.sectionTitle}>Encadrant & Co-encadrant</h2>
        <div style={S.teamGrid}>
          <PersonCard
            name="Pr. BEN LAHMAR El Habib"
            role="Encadrant principal"
            desc="Professeur à la Faculté des Sciences Ben M'Sik — Université Hassan II de Casablanca."
            imgSrc={null}
            badge="Encadrant"
          />
          <PersonCard
            name="Pr. KAICH Oussama"
            role="Co-encadrant"
            desc="Professeur à la Faculté des Sciences Ben M'Sik — Université Hassan II de Casablanca."
            imgSrc={null}
            badge="Co-encadrant"
          />
        </div>
      </section>

      {/* ── CTA band ── */}
      <section style={S.band}>
        <h2 style={S.bandTitle}>Prêt à analyser vos cellules ?</h2>
        <button style={S.bandBtn} onClick={() => navigate("/predict")}>
          Démarrer maintenant →
        </button>
      </section>

      {/* ── Footer ── */}
      <footer style={S.footer}>
        <div style={S.footerTop}>
          <span style={S.footerLogo}>MedCell<span style={S.red}>AI</span></span>
          <p style={S.footerSub}>
            Faculté des Sciences Ben M'Sik · Université Hassan II · Casablanca
          </p>
        </div>
        <p style={S.footerText}>
          Projet de fin de module Deep Learning · Licence d'Excellence en Intelligence Artificielle
        </p>
        <p style={S.footerCopy}>© {new Date().getFullYear()} MedCell AI. Tous droits réservés.</p>
      </footer>
    </div>
  );
}

/* ── Styles Optimisés & Responsive ── */
const S = {
  page: {
    minHeight: "100vh",
    width: "100%",
    background: "#ffffff",
    fontFamily: "'Inter', system-ui, sans-serif",
    color: "#0f172a",
    overflowX: "hidden", // Empêche tout défilement horizontal indésirable
  },
  red: { color: "#dc2626" },

  header: {
    display: "flex", 
    alignItems: "center", 
    justify: "space-between",
    padding: "0 clamp(16px, 4vw, 48px)", 
    minHeight: 68,
    borderBottom: "1px solid rgba(220,38,38,0.1)",
    position: "sticky", 
    top: 0,
    background: "rgba(255,255,255,0.94)",
    backdropFilter: "blur(12px)", 
    zIndex: 100,
    boxSizing: "border-box",
  },
  logo: { fontSize: "clamp(18px, 4vw, 22px)", fontWeight: 800, letterSpacing: "-0.5px", color: "#0f172a" },
  nav: { display: "flex", alignItems: "center", gap: "clamp(10px, 2vw, 22px)" },
  navLink: { fontSize: 13, color: "#475569", textDecoration: "none", fontWeight: 500 },
  navBtn: {
    fontSize: 13, fontWeight: 600, color: "#fff", background: "#dc2626",
    border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer",
  },

  hero: {
    display: "flex", 
    alignItems: "center", 
    justifyContent: "space-between",
    maxWidth: 1200, 
    margin: "0 auto", 
    padding: "clamp(32px, 6vw, 70px) clamp(16px, 4vw, 40px)", 
    gap: 40,
    flexWrap: "wrap", // S'empile automatiquement sur mobile
  },
  heroLeft: { flex: "1 1 300px", maxWidth: 520 },
  heroRight: {
    flex: "1 1 300px", 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center",
    width: "100%",
  },

  /* Container 3D adaptatif */
  heroFloatContainer: {
    position: "relative",
    width: "100%",
    maxWidth: 420,
    height: "auto",
    minHeight: 280,
    padding: "clamp(20px, 5vw, 50px)",
    background: "transparent",
    borderRadius: 24,
    overflow: "hidden",
    boxSizing: "border-box",
  },

  eyebrow: {
    display: "inline-block", fontSize: 11, fontWeight: 600,
    letterSpacing: 1.6, textTransform: "uppercase", color: "#dc2626", marginBottom: 14,
  },
  headline: {
    fontSize: "clamp(28px, 6vw, 42px)", // S'adapte à la taille de l'écran
    fontWeight: 800, 
    lineHeight: 1.18,
    letterSpacing: "-1.5px", 
    margin: "0 0 22px", 
    color: "#0f172a",
  },
  typewriter: {
    fontSize: 15, lineHeight: 1.7, color: "#475569",
    minHeight: 72, margin: "0 0 20px", fontWeight: 400,
  },
  cursor: {
    display: "inline-block", color: "#dc2626", fontWeight: 300,
    animation: "blink 1s step-end infinite",
  },
  heroBadges: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 },
  heroBadge: {
    fontSize: 11, fontWeight: 600, color: "#dc2626",
    background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.18)",
    borderRadius: 99, padding: "4px 12px",
  },
  cta: {
    fontSize: 15, fontWeight: 700, color: "#fff", background: "#dc2626",
    border: "none", borderRadius: 10, padding: "13px 30px",
    cursor: "pointer", letterSpacing: "0.2px",
  },
  cellLabel: { fontSize: 11, color: "#94a3b8", marginTop: 12, letterSpacing: 0.5, textAlign: "center" },

  /* ── Section Cells ── */
  cellsSection: {
    padding: "clamp(40px, 8vw, 80px) clamp(16px, 4vw, 40px)", 
    textAlign: "center",
    background: "#fafafa",
    borderTop: "1px solid rgba(220,38,38,0.07)",
  },
  cellsSub: {
    fontSize: 14, color: "#64748b", maxWidth: 560,
    margin: "-20px auto 44px", lineHeight: 1.7,
  },
  sectionCellsRow: {
    display: "flex",
    gap: 22,
    justify: "center",
    alignItems: "stretch",
    flexWrap: "wrap",
    maxWidth: 1100,
    margin: "0 auto",
  },
  sectionCellCard: {
    borderRadius: 18,
    border: "1.5px solid",
    padding: "24px 20px 28px",
    textAlign: "center",
    cursor: "default",
    transition: "transform 0.22s, box-shadow 0.22s, border-color 0.22s",
    width: "100%",
    maxWidth: 240, // Évite qu'elle soit trop large mais s'adapte aux conteneurs réduits
    boxSizing: "border-box",
  },
  sectionCellSvgWrap: {
    display: "flex", justifyContent: "center",
    marginBottom: 14,
  },
  sectionCellName: {
    fontSize: 15, fontWeight: 800,
    margin: "0 0 10px",
    letterSpacing: "-0.3px",
  },
  sectionCellDesc: {
    fontSize: 12, color: "#64748b",
    margin: 0, lineHeight: 1.65,
    textAlign: "left",
  },

  /* About */
  aboutSection: {
    background: "#fff",
    borderTop: "1px solid rgba(220,38,38,0.07)",
    borderBottom: "1px solid rgba(220,38,38,0.07)",
    padding: "clamp(40px, 6vw, 60px) clamp(16px, 4vw, 40px)",
  },
  logosRow: {
    display: "flex", alignItems: "center", justifyContent: "center",
    gap: 20, maxWidth: 900, margin: "0 auto 40px", flexWrap: "wrap",
  },
  logoBox: { textAlign: "center", minWidth: 140 },
  logoBoxImg: { width: 72, height: 72, objectFit: "contain", marginBottom: 8 },
  logoBoxLabel: { fontSize: 12, fontWeight: 600, color: "#0f172a", margin: "0 0 2px", lineHeight: 1.4 },
  logoBoxSub: { fontSize: 11, color: "#dc2626", fontWeight: 500, margin: 0 },
  aboutInner: { maxWidth: 780, margin: "0 auto" },
  aboutText: { flex: 1 },
  aboutDesc: { fontSize: 15, color: "#475569", lineHeight: 1.75, margin: "0 0 14px" },

  section: { 
    padding: "clamp(40px, 8vw, 80px) clamp(16px, 4vw, 40px)", 
    textAlign: "center", 
    background: "#fff" 
  },
  sectionEyebrow: {
    fontSize: 11, fontWeight: 700, letterSpacing: 1.8,
    textTransform: "uppercase", color: "#dc2626", margin: "0 0 10px",
  },
  sectionTitle: {
    fontSize: "clamp(24px, 5vw, 32px)", 
    fontWeight: 800, letterSpacing: "-1px",
    color: "#0f172a", margin: "0 0 40px",
  },
  steps: {
    display: "flex", gap: 20, justifyContent: "center",
    flexWrap: "wrap", maxWidth: 1000, margin: "0 auto",
  },
  stepCard: {
    background: "#fafafa", border: "1px solid rgba(220,38,38,0.1)",
    borderRadius: 14, padding: "28px 24px", 
    width: "100%", maxWidth: 220, 
    textAlign: "left", boxSizing: "border-box",
  },
  stepN: { display: "block", fontSize: 11, fontWeight: 800, letterSpacing: 1.5, color: "#dc2626", marginBottom: 12 },
  stepTitle: { fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 8px" },
  stepDesc: { fontSize: 13, color: "#64748b", lineHeight: 1.6, margin: 0 },

  teamSection: {
    background: "#fafafa",
    borderTop: "1px solid rgba(220,38,38,0.07)",
    padding: "clamp(40px, 8vw, 80px) clamp(16px, 4vw, 40px)", 
    textAlign: "center",
  },
  teamGrid: {
    display: "flex", gap: 24, justifyContent: "center",
    flexWrap: "wrap", maxWidth: 800, margin: "0 auto",
  },

  personCard: {
    background: "#fff", border: "1px solid rgba(220,38,38,0.1)",
    borderRadius: 16, padding: "28px 24px", 
    width: "100%", maxWidth: 240, 
    textAlign: "center", boxSizing: "border-box",
  },
  personImgWrap: { position: "relative", display: "inline-block", marginBottom: 16 },
  personImg: { width: 90, height: 90, borderRadius: "50%", objectFit: "cover", display: "block" },
  personImgPlaceholder: {
    width: 90, height: 90, borderRadius: "50%",
    background: "rgba(220,38,38,0.06)", border: "2px solid rgba(220,38,38,0.15)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  personBadge: {
    position: "absolute", bottom: 0, right: -8,
    fontSize: 10, fontWeight: 700, color: "#fff",
    background: "#dc2626", borderRadius: 99, padding: "2px 8px",
  },
  personName: { fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 4px" },
  personRole: { fontSize: 12, color: "#dc2626", fontWeight: 500, margin: "0 0 10px" },
  personDesc: { fontSize: 13, color: "#64748b", lineHeight: 1.6, margin: 0 },

  band: { 
    background: "#dc2626", 
    padding: "clamp(40px, 6vw, 70px) clamp(16px, 4vw, 40px)", 
    textAlign: "center" 
  },
  bandTitle: { fontSize: "clamp(22px, 5vw, 30px)", fontWeight: 800, color: "#fff", margin: "0 0 28px", letterSpacing: "-0.5px" },
  bandBtn: {
    fontSize: 15, fontWeight: 700, color: "#dc2626", background: "#fff",
    border: "none", borderRadius: 10, padding: "14px 36px", cursor: "pointer",
  },

  footer: {
    padding: "40px clamp(16px, 4vw, 60px)", 
    borderTop: "1px solid rgba(220,38,38,0.08)", 
    textAlign: "center",
  },
  footerTop: { marginBottom: 12 },
  footerLogo: { fontSize: 20, fontWeight: 800, color: "#0f172a" },
  footerSub: { fontSize: 13, color: "#64748b", margin: "6px 0 0" },
  footerText: { fontSize: 13, color: "#94a3b8", margin: "8px 0 4px" },
  footerCopy: { fontSize: 12, color: "#cbd5e1", margin: 0 },
};