'use client';
import { useState } from 'react';
import { UserButton } from '@clerk/nextjs';

type Analysis = {
  score: number;
  experience_years: number;
  top_skills: string[];
  strengths: string[];
  gaps: string[];
  summary: string;
};

export default function AnalysePage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState('');
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  async function handleAnalyse() {
    if (!file) return;
    setLoading(true);
    setError('');
    setAnalysis(null);
    try {
      setStage('Reading your resume...');
      const formData = new FormData();
      formData.append('resume', file);
      const parseRes = await fetch('/api/parse-resume', { method: 'POST', body: formData });
      const parseData = await parseRes.json();
      if (parseData.error) throw new Error(parseData.error);
      setStage('AI is analysing your resume...');
      const analyseRes = await fetch('/api/analyse-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: parseData.text, fileName: file.name }),
      });
      const analyseData = await analyseRes.json();
      if (analyseData.error) throw new Error(analyseData.error);
      setAnalysis(analyseData.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
      setStage('');
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === 'application/pdf') { setFile(dropped); setAnalysis(null); }
  }

  const score = analysis?.score ?? 0;
  const scoreColor = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';
  const scoreLabel = score >= 75 ? 'Strong' : score >= 50 ? 'Average' : 'Needs Work';
  const circumference = 2 * Math.PI * 54;
  const dash = circumference - (score / 100) * circumference;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Sora:wght@600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:'Inter',sans-serif;background:#0a0a0f;color:#e2e8f0;min-height:100vh;}
        .navbar{display:flex;justify-content:space-between;align-items:center;padding:1rem 2.5rem;border-bottom:1px solid #ffffff0d;background:#0a0a0fcc;backdrop-filter:blur(12px);position:sticky;top:0;z-index:50;}
        .logo{font-family:'Sora',sans-serif;font-size:20px;font-weight:700;background:linear-gradient(135deg,#818cf8,#c084fc);-webkit-background-clip:text;-webkit-text-fill-color:transparent;text-decoration:none;}
        .nav-right{display:flex;align-items:center;gap:28px;}
        .nav-link{font-size:13px;color:#64748b;text-decoration:none;font-weight:500;transition:color 0.2s;}
        .nav-link:hover,.nav-link.active{color:#e2e8f0;}
        .page{max-width:920px;margin:0 auto;padding:3rem 1.5rem 5rem;}
        .page-header{margin-bottom:2.5rem;}
        .badge{display:inline-flex;align-items:center;gap:8px;background:#13131f;border:1px solid #818cf820;border-radius:100px;padding:5px 14px;font-size:12px;color:#818cf8;margin-bottom:1rem;font-weight:500;}
        h1{font-family:'Sora',sans-serif;font-size:2rem;font-weight:700;letter-spacing:-0.02em;margin-bottom:8px;}
        .grad{background:linear-gradient(135deg,#818cf8,#c084fc);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
        .page-sub{color:#475569;font-size:14px;}
        .upload-zone{border:1.5px dashed #1e2035;border-radius:24px;padding:3.5rem 2rem;text-align:center;cursor:pointer;transition:all 0.25s;background:#0d0d18;position:relative;margin-bottom:1.5rem;}
        .upload-zone.drag{border-color:#818cf8;background:#0d0d1f;}
        .upload-zone.has-file{border-color:#10b981;border-style:solid;background:#0a1812;}
        .file-input{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%;}
        .upload-icon{width:56px;height:56px;background:#13131f;border:1px solid #1e2035;border-radius:16px;display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;font-size:26px;}
        .upload-title{font-size:15px;font-weight:600;margin-bottom:4px;}
        .upload-sub{font-size:13px;color:#334155;}
        .upload-name{margin-top:10px;font-size:13px;color:#10b981;font-weight:600;}
        .btn{width:100%;padding:17px;border-radius:16px;border:none;font-size:15px;font-weight:600;font-family:'Inter',sans-serif;cursor:pointer;transition:all 0.25s;background:linear-gradient(135deg,#818cf8,#c084fc);color:#fff;margin-bottom:1.5rem;}
        .btn:disabled{opacity:0.35;cursor:not-allowed;}
        .btn:not(:disabled):hover{transform:translateY(-2px);box-shadow:0 12px 40px #818cf840;}
        .loading-wrap{text-align:center;margin-bottom:1.5rem;}
        .loading-stage{font-size:13px;color:#818cf8;margin-bottom:10px;font-weight:500;}
        .track{height:2px;background:#1e2035;border-radius:2px;overflow:hidden;}
        .fill{height:100%;background:linear-gradient(90deg,#818cf8,#c084fc);animation:sweep 2.5s ease-in-out infinite;}
        @keyframes sweep{0%{width:5%}60%{width:80%}100%{width:95%}}
        .err{padding:14px 18px;background:#1a0a0a;border:1px solid #ef444440;border-radius:14px;color:#f87171;font-size:13px;margin-bottom:1.5rem;}
        .results-top{display:grid;grid-template-columns:220px 1fr;gap:20px;margin-bottom:20px;}
        @media(max-width:640px){.results-top,.three{grid-template-columns:1fr !important;}}
        .card{background:#0d0d18;border:1px solid #ffffff08;border-radius:24px;padding:1.75rem;}
        .score-card{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;}
        .score-lbl{font-size:11px;color:#334155;text-transform:uppercase;letter-spacing:0.12em;margin-top:12px;margin-bottom:6px;}
        .score-badge{display:inline-flex;padding:4px 14px;border-radius:100px;font-size:12px;font-weight:600;}
        .summary-lbl{font-size:11px;color:#334155;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:14px;}
        .summary-txt{font-size:14px;color:#94a3b8;line-height:1.85;}
        .stats{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:1.5rem;}
        .stat{background:#13131f;border:1px solid #ffffff08;border-radius:16px;padding:1.25rem;text-align:center;}
        .stat-n{font-family:'Sora',sans-serif;font-size:34px;font-weight:700;color:#818cf8;}
        .stat-l{font-size:11px;color:#334155;text-transform:uppercase;letter-spacing:0.08em;margin-top:6px;}
        .three{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-top:0;}
        .sec-title{font-size:11px;color:#334155;text-transform:uppercase;letter-spacing:0.12em;margin-bottom:16px;font-weight:600;}
        .skill{display:inline-block;background:#13131f;border:1px solid #818cf820;color:#818cf8;border-radius:8px;padding:5px 13px;font-size:12px;font-weight:500;margin:3px;}
        .chk{display:flex;gap:10px;margin-bottom:12px;font-size:13px;color:#94a3b8;line-height:1.6;align-items:flex-start;}
        .chk-icon{width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:10px;font-weight:700;margin-top:1px;}
        .green-icon{background:#052e16;color:#10b981;}
        .amber-icon{background:#1c1007;color:#f59e0b;}
        .cta-bar{margin-top:1.5rem;padding:1.5rem;background:#0d0d18;border:1px solid #818cf815;border-radius:20px;display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;}
        .cta-bar p{font-size:14px;color:#64748b;}
        .cta-bar a{display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,#818cf8,#c084fc);color:#fff;padding:11px 22px;border-radius:12px;font-size:13px;font-weight:600;text-decoration:none;transition:all 0.2s;}
        .cta-bar a:hover{transform:translateY(-1px);box-shadow:0 8px 24px #818cf840;}
        footer{text-align:center;padding:2rem;border-top:1px solid #ffffff08;color:#1e293b;font-size:12px;margin-top:2rem;}
      `}</style>

      <nav className="navbar">
        <a href="/" className="logo">ResumeAI</a>
        <div className="nav-right">
          <a href="/analyse" className="nav-link active">Resume Analyser</a>
          <a href="/cover-letter" className="nav-link">Cover Letter</a>
          <a href="/history" className="nav-link">History</a>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      <div className="page">
        <div className="page-header">
          <div className="badge">📊 AI Resume Analyser</div>
          <h1>Your resume,<br /><span className="grad">brutally honest.</span></h1>
          <p className="page-sub">Upload your PDF and get an ATS score, skill analysis, and improvement suggestions in seconds.</p>
        </div>

        <div
          className={`upload-zone${dragOver ? ' drag' : ''}${file ? ' has-file' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <input type="file" accept=".pdf" className="file-input"
            onChange={(e) => { setFile(e.target.files?.[0] || null); setAnalysis(null); }} />
          <div className="upload-icon">{file ? '✅' : '📄'}</div>
          {file ? (
            <><div className="upload-title">Resume ready</div><div className="upload-name">✓ {file.name}</div></>
          ) : (
            <><div className="upload-title">Drop your resume here</div><div className="upload-sub">PDF only · or click to browse</div></>
          )}
        </div>

        <button className="btn" onClick={handleAnalyse} disabled={!file || loading}>
          {loading ? (stage || 'Analysing...') : 'Analyse my resume →'}
        </button>

        {loading && <div className="loading-wrap"><div className="loading-stage">{stage}</div><div className="track"><div className="fill"></div></div></div>}
        {error && <div className="err">⚠ {error}</div>}

        {analysis && (
          <>
            <div className="results-top">
              <div className="card score-card">
                <svg width="130" height="130" viewBox="0 0 130 130">
                  <circle cx="65" cy="65" r="54" fill="none" stroke="#ffffff06" strokeWidth="10" />
                  <circle cx="65" cy="65" r="54" fill="none" stroke={scoreColor} strokeWidth="10"
                    strokeDasharray={circumference} strokeDashoffset={dash}
                    strokeLinecap="round" transform="rotate(-90 65 65)"
                    style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }} />
                  <text x="65" y="73" textAnchor="middle" fill={scoreColor}
                    fontSize="30" fontWeight="700" fontFamily="Sora,sans-serif">{score}</text>
                </svg>
                <div className="score-lbl">ATS Score</div>
                <div className="score-badge" style={{ background: scoreColor + '18', color: scoreColor }}>{scoreLabel}</div>
              </div>
              <div className="card">
                <div className="summary-lbl">AI Summary</div>
                <div className="summary-txt">{analysis.summary}</div>
                <div className="stats">
                  <div className="stat"><div className="stat-n">{analysis.experience_years}</div><div className="stat-l">Years exp.</div></div>
                  <div className="stat"><div className="stat-n">{analysis.top_skills.length}</div><div className="stat-l">Skills found</div></div>
                </div>
              </div>
            </div>
            <div className="three">
              <div className="card">
                <div className="sec-title">🛠 Top Skills</div>
                {analysis.top_skills.map((s, i) => <span key={i} className="skill">{s}</span>)}
              </div>
              <div className="card">
                <div className="sec-title">✅ Strengths</div>
                {analysis.strengths.map((s, i) => (
                  <div key={i} className="chk"><div className="chk-icon green-icon">✓</div><span>{s}</span></div>
                ))}
              </div>
              <div className="card">
                <div className="sec-title">⚠ Improve</div>
                {analysis.gaps.map((g, i) => (
                  <div key={i} className="chk"><div className="chk-icon amber-icon">→</div><span>{g}</span></div>
                ))}
              </div>
            </div>
            <div className="cta-bar">
              <p>Ready to apply? Generate a tailored cover letter from this resume.</p>
              <a href="/cover-letter">✉ Generate cover letter →</a>
            </div>
          </>
        )}
      </div>
      <footer>Built with Next.js · Groq · Llama 3.3 · Clerk · Neon</footer>
    </>
  );
}