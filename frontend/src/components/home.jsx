import { useState, useRef, useCallback } from "react";
import { validateImage, predictImage } from "../services/home";

/* ── Google Font ── */
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap";
document.head.appendChild(fontLink);

const CLASS_META = {
  "Éosinophile": { color: "#DC2626", bg: "rgba(220,38,38,0.1)",   border: "rgba(220,38,38,0.3)"  },
  "Lymphocyte":  { color: "#B91C1C", bg: "rgba(185,28,28,0.1)",   border: "rgba(185,28,28,0.3)"  },
  "Monocyte":    { color: "#EF4444", bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.3)"  },
  "Neutrophile": { color: "#F87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.3)" },
};
const getMeta = (cls) =>
  CLASS_META[cls] || { color: "#EF4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.3)" };

function UploadIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/>
      <line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );
}

function Top3Row({ item, rank }) {
  const meta = getMeta(item.class);
  return (
    <div style={S.top3Row}>
      <span style={{ ...S.top3Rank, color: rank === 1 ? meta.color : "#334155" }}>
        {rank}
      </span>
      <span style={S.top3Name}>{item.class}</span>
      <div style={S.top3Track}>
        <div style={{
          ...S.top3Fill,
          width: `${item.confidence}%`,
          background: meta.color,
          opacity: rank === 1 ? 1 : 0.35,
        }}/>
      </div>
      <span style={{ ...S.top3Pct, color: rank === 1 ? meta.color : "#475569" }}>
        {item.confidence}%
      </span>
    </div>
  );
}

export default function Home() {
  const [file,    setFile]    = useState(null);
  const [preview, setPreview] = useState(null);
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [dragging,setDragging]= useState(false);
  const inputRef = useRef();

  const handleFile = (f) => {
    const err = validateImage(f);
    if (err) { setError(err); return; }
    setError(""); setResult(null); setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(f);
  };

  const onDrop = useCallback((e) => {
    e.preventDefault(); setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  const analyse = async () => {
    if (!file) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const data = await predictImage(file);
      setResult(data);
    } catch (e) {
      setError(e.message || "Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null); setPreview(null);
    setResult(null); setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const meta = result ? getMeta(result.predicted_class) : null;

  return (
    
    <div style={S.page}>

      {/* ── Header ── */}
      <header style={S.header}>
        <span style={S.pill}>Réseau de neurones · VGG16</span>
        <h1 style={S.title}>
        MedCell<span style={S.titleAccent}>AI</span>
        </h1>
        <p style={S.subtitle}>
          Identifiez le type de globule blanc à partir d'une image microscopique
        </p>
      </header>

      <main style={S.main}>
        <div style={S.card}>

          {/* ── Zone upload ── */}
          {!preview ? (
            <div
              style={{ ...S.dropzone, ...(dragging ? S.dropzoneHover : {}) }}
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
            >
              <div style={{ ...S.dropIconWrap, ...(dragging ? S.dropIconWrapHover : {}) }}>
                <UploadIcon />
              </div>
              <p style={S.dropTitle}>Glissez une image ici</p>
              <p style={S.dropSub}>
                ou{" "}
                <span style={S.dropCta}>parcourir</span>
              </p>
              <p style={S.dropHint}>JPEG · PNG · max 10 Mo</p>
              <input
                ref={inputRef} type="file"
                accept="image/jpeg,image/png"
                style={{ display: "none" }}
                onChange={(e) => handleFile(e.target.files[0])}
              />
            </div>
          ) : (
            <div style={S.previewBox}>
              <img src={preview} alt="Aperçu" style={S.previewImg} />
              <div style={S.previewFooter}>
                <span style={S.previewName}>{file?.name}</span>
                <button style={S.deleteBtn} onClick={reset}>✕</button>
              </div>
            </div>
          )}

          {/* ── Erreur ── */}
          {error && (
            <div style={S.errorBox}>
              <span>⚠</span> {error}
            </div>
          )}

          {/* ── Bouton analyser ── */}
          {preview && !result && (
            <button
              style={{ ...S.btn, ...(loading ? S.btnBusy : {}) }}
              onClick={analyse}
              disabled={loading}
            >
              {loading
                ? <><span style={S.spin}/> Analyse en cours…</>
                : <><SearchIcon /> Analyser</>}
            </button>
          )}

          {/* ── Résultat ── */}
          {result && meta && (
            <div style={S.result}>
              <div style={{ ...S.resultCard, background: meta.bg, borderColor: meta.border }}>
                <div style={{ ...S.resultGlow, background: meta.color }} />
                <div>
                  <p style={S.resultSup}>Type identifié</p>
                  <p style={{ ...S.resultName, color: meta.color }}>
                    {result.predicted_class}
                  </p>
                </div>
                <div style={S.resultRight}>
                  <p style={{ ...S.resultPct, color: meta.color }}>{result.confidence}%</p>
                  <p style={S.resultPctSup}>confiance</p>
                </div>
              </div>

              <div style={S.bar}>
                <div style={{
                  ...S.barFill,
                  width: `${result.confidence}%`,
                  background: meta.color,
                }}/>
              </div>

              <p style={S.sectionLabel}>Probabilités</p>
              {result.top3.map((item, i) => (
                <Top3Row key={i} item={item} rank={i + 1} />
              ))}

              <button style={S.resetBtn} onClick={reset}>
                ↩ Nouvelle analyse
              </button>
            </div>
          )}
        </div>

        {/* ── Étapes pipeline ── */}
        <div style={S.steps}>
          {[
            { n: "01", label: "Upload" },
            { n: "02", label: "Resize 224px" },
            { n: "03", label: "VGG16" },
            { n: "04", label: "Prédiction" },
          ].map((s, i) => (
            <div key={i} style={S.stepItem}>
              <span style={S.stepN}>{s.n}</span>
              <span style={S.stepLabel}>{s.label}</span>
              {i < 3 && <span style={S.stepSep}>·</span>}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}


 const S = {
  page: {
    minHeight: "100vh",
    width: "100%",
    background: "#FFFFFF",
    fontFamily: "'Inter', system-ui, sans-serif",
    color: "#1E293B",
    overflowX: "hidden", // Empêche le défilement horizontal
  },
  header: {
    textAlign: "center",
    padding: "36px 16px 28px", // Padding réduit pour mobile
    borderBottom: "1px solid rgba(239,68,68,0.12)",
  },
  pill: {
    display: "inline-block",
    fontSize: 10, fontWeight: 500, letterSpacing: 1.2,
    textTransform: "uppercase", color: "#EF4444",
    border: "1px solid rgba(239,68,68,0.25)",
    borderRadius: 99, padding: "4px 12px", marginBottom: 14,
  },
  title: {
    margin: "0 0 10px", 
    fontSize: "clamp(28px, 8vw, 48px)", // Taille de texte fluide selon la largeur de l'écran
    fontWeight: 800,
    letterSpacing: "-1px", color: "#0F172A",
  },
  titleAccent: { color: "#EF4444" },
  subtitle: {
    margin: 0, fontSize: 14, color: "#475569",
    maxWidth: 420, marginInline: "auto", lineHeight: 1.5,
    padding: "0 8px",
  },

  main: { 
    maxWidth: 560, 
    width: "100%",
    margin: "0 auto", 
    padding: "20px 16px 60px", // Marges ajustées pour mobile
    boxSizing: "border-box",
  },

  card: {
    background: "#FFFFFF",
    border: "1px solid rgba(239,68,68,0.08)",
    borderRadius: 18, 
    padding: "16px", // Atténué pour libérer de l'espace sur petit écran
    boxSizing: "border-box",
  },

  dropzone: {
    border: "1.5px dashed rgba(239,68,68,0.15)",
    borderRadius: 12, padding: "30px 12px",
    textAlign: "center", cursor: "pointer",
    transition: "all 0.2s",
  },
  dropzoneHover: {
    border: "1.5px dashed rgba(239,68,68,0.5)",
    background: "rgba(239,68,68,0.04)",
  },
  dropIconWrap: {
    width: 48, height: 48, borderRadius: "50%",
    background: "rgba(239,68,68,0.07)",
    border: "1px solid rgba(239,68,68,0.15)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#EF4444", margin: "0 auto 12px",
    transition: "all 0.2s",
  },
  dropIconWrapHover: {
    background: "rgba(239,68,68,0.14)",
    border: "1px solid rgba(239,68,68,0.35)",
  },
  dropTitle: { margin: "0 0 4px", fontSize: 14, fontWeight: 600, color: "#1E293B" },
  dropSub:   { margin: "0 0 6px", fontSize: 12, color: "#475569" },
  dropCta:   { color: "#EF4444", cursor: "pointer", textDecoration: "underline" },
  dropHint:  { margin: 0, fontSize: 11, color: "#1E293B", letterSpacing: 0.5 },

  previewBox: {
    borderRadius: 10, overflow: "hidden",
    border: "1px solid rgba(239,68,68,0.1)",
  },
  previewImg: { width: "100%", maxHeight: 240, objectFit: "cover", display: "block" },
  previewFooter: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "8px 12px",
    background: "rgba(239,68,68,0.03)",
  },
  previewName: { fontSize: 12, color: "#475569", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  deleteBtn: {
    fontSize: 11, color: "#EF4444",
    background: "rgba(239,68,68,0.1)",
    border: "1px solid rgba(239,68,68,0.2)",
    borderRadius: 6, padding: "3px 8px", cursor: "pointer", flexShrink: 0,
  },

  errorBox: {
    display: "flex", alignItems: "center", gap: 8,
    background: "rgba(239,68,68,0.07)",
    border: "1px solid rgba(239,68,68,0.18)",
    borderRadius: 8, padding: "10px 14px", marginTop: 14,
    fontSize: 13, color: "#DC2626",
  },

  btn: {
    width: "100%", marginTop: 16, padding: "12px 0",
    background: "#B91C1C", border: "none", borderRadius: 10,
    color: "#fff", fontSize: 14, fontWeight: 600,
    cursor: "pointer", display: "flex",
    alignItems: "center", justifyContent: "center", gap: 8,
  },
  btnBusy: { background: "#450A0A", cursor: "not-allowed" },
  spin: {
    width: 14, height: 14, borderRadius: "50%",
    border: "2px solid rgba(255,255,255,0.15)",
    borderTop: "2px solid #fff",
    display: "inline-block",
    animation: "spin 0.7s linear infinite",
  },

  result: { marginTop: 16 },
  resultCard: {
    borderRadius: 12, border: "1px solid",
    padding: "12px 14px", position: "relative", overflow: "hidden",
    display: "flex", alignItems: "center", gap: 10,
  },
  resultGlow: {
    position: "absolute", top: -20, left: -20,
    width: 80, height: 80, borderRadius: "50%",
    filter: "blur(30px)", opacity: 0.25,
  },
  resultSup: {
    margin: "0 0 2px", fontSize: 10, fontWeight: 600,
    letterSpacing: 1.1, textTransform: "uppercase", color: "#475569",
  },
  resultName: { margin: 0, fontSize: "clamp(16px, 5vw, 20px)", fontWeight: 700 },
  resultRight: { marginLeft: "auto", textAlign: "right", flexShrink: 0 },
  resultPct: { margin: 0, fontSize: "clamp(22px, 6vw, 28px)", fontWeight: 800, lineHeight: 1 },
  resultPctSup: { margin: "2px 0 0", fontSize: 9, color: "#475569" },

  bar: {
    height: 4, borderRadius: 99, marginTop: 10,
    background: "rgba(239,68,68,0.08)", overflow: "hidden",
  },
  barFill: {
    height: "100%", borderRadius: 99,
    transition: "width 0.7s cubic-bezier(.4,0,.2,1)",
  },

  sectionLabel: {
    margin: "16px 0 8px", fontSize: 10, fontWeight: 600,
    letterSpacing: 1.1, textTransform: "uppercase", color: "#334155",
  },
  top3Row: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "6px 0",
    borderBottom: "1px solid rgba(239,68,68,0.06)",
  },
  top3Rank: { fontSize: 11, fontWeight: 700, width: 12, flexShrink: 0 },
  top3Name: { fontSize: 12, color: "#475569", width: 85, flexShrink: 0 },
  top3Track: {
    flex: 1, height: 3, borderRadius: 99,
    background: "rgba(239,68,68,0.08)", overflow: "hidden",
  },
  top3Fill: { height: "100%", borderRadius: 99, transition: "width 0.5s ease" },
  top3Pct: {
    fontSize: 11, fontWeight: 500, width: 35,
    textAlign: "right", fontVariantNumeric: "tabular-nums", flexShrink: 0,
  },

  resetBtn: {
    width: "100%", marginTop: 16, padding: "10px 0",
    background: "transparent",
    border: "1px solid rgba(239,68,68,0.15)",
    borderRadius: 10, color: "#475569",
    fontSize: 13, cursor: "pointer",
  },

  steps: {
    display: "flex", alignItems: "center", justifyContent: "center",
    gap: "6px 12px", marginTop: 20, flexWrap: "wrap",
  },
  stepItem: { display: "flex", alignItems: "center", gap: 6 },
  stepN: { fontSize: 10, fontWeight: 700, color: "#450A0A", letterSpacing: 0.8 },
  stepLabel: { fontSize: 11, color: "#1E293B" },
  stepSep: { color: "#1A0000", fontSize: 12 },
};
