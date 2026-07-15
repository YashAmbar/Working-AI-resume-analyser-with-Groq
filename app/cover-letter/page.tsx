'use client';
import { useState } from 'react';
import { UserButton } from '@clerk/nextjs';

export default function CoverLetterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    if (!file || !jobDescription) return;
    setLoading(true);
    setError('');
    setCoverLetter('');
    try {
      setStage('Reading your resume...');
      const formData = new FormData();
      formData.append('resume', file);
      const parseRes = await fetch('/api/parse-resume', { method: 'POST', body: formData });
      const parseData = await parseRes.json();
      if (parseData.error) throw new Error(parseData.error);
      setStage('Writing your cover letter...');
      const res = await fetch('/api/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: parseData.text, jobDescription, companyName, jobTitle }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setCoverLetter(data.coverLetter);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
      setStage('');
    }
  }

  function copy() {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Sora:wght@600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:'Inter',sans-serif;background:#0a0a0f;color:#e2e8f0;min-height:100vh;}
        .navbar{display:flex;justify-content:space-between;align-items:center;padding:1rem 2.5rem;border-bottom:1px solid #ffffff0d;background:#0a0a0fcc;backdrop-filter:blur(12px);position:sticky;top:0;z-index:50;}
        .logo{font-family:'Sora',sans-serif;font-size:20px;font-weight:700;background:linear-gradient(135deg,#818cf8,#c084fc);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
        .nav-right{display:flex;align-items:center;gap:28px;}
        .nav-link{font-size:13px;color:#64748b;text-decoration:none;font-weight:500;transition:color 0.2s;}
        .nav-link:hover,.nav-link.active{color:#e2e8f0;}
        .page{max-width:900px;margin:0 auto;padding:3rem 1.5rem 5rem;}
        .page-badge{display:inline-flex;align-items:center;gap:8px;background:#13131f;border:1px solid #818cf820;border-radius:100px;padding:5px 14px;font-size:12px;color:#818cf8;margin-bottom:1rem;font-weight:500;}
        h1{font-family:'Sora',sans-serif;font-size:2.2rem;font-weight:700;letter-spacing:-0.02em;margin-bottom:8px;}
        h1 .grad{background:linear-gradient(135deg,#818cf8,#c084fc);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
        .page-sub{color:#475569;font-size:14px;margin-bottom:2.5rem;}
        .grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px;}
        @media(max-width:640px){.grid{grid-template-columns:1fr;}}
        .card{background:#0d0d18;border:1px solid #ffffff08;border-radius:24px;padding:1.75rem;}
        .card-title{font-size:11px;color:#334155;text-transform:uppercase;letter-spacing:0.12em;font-weight:600;margin-bottom:1.25rem;}
        .upload-zone{border:1.5px dashed #1e2035;border-radius:16px;padding:2.5rem 2rem;text-align:center;cursor:pointer;position:relative;transition:all 0.2s;background:#0a0a14;}
        .upload-zone.has-file{border-color:#10b981;border-style:solid;background:#0a1812;}
        .file-input{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%;}
        .upload-icon{font-size:28px;margin-bottom:10px;}
        .upload-t{font-size:13px;color:#64748b;}
        .upload-name{font-size:13px;color:#10b981;font-weight:600;margin-top:8px;}
        .lbl{display:block;font-size:12px;color:#475569;margin-bottom:6px;font-weight:500;}
        .inp{width:100%;background:#13131f;border:1px solid #ffffff08;border-radius:12px;padding:11px 14px;font-size:13px;color:#e2e8f0;font-family:'Inter',sans-serif;outline:none;transition:border-color 0.2s;}
        .inp:focus{border-color:#818cf840;}
        .inp::placeholder{color:#1e293b;}
        .ta{width:100%;background:#13131f;border:1px solid #ffffff08;border-radius:12px;padding:11px 14px;font-size:13px;color:#e2e8f0;font-family:'Inter',sans-serif;outline:none;transition:border-color 0.2s;resize:none;}
        .ta:focus{border-color:#818cf840;}
        .ta::placeholder{color:#1e293b;}
        .field{margin-bottom:14px;}
        .two{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;}
        .btn{width:100%;padding:17px;border-radius:16px;border:none;font-size:15px;font-weight:600;font-family:'Inter',sans-serif;cursor:pointer;transition:all 0.25s;background:linear-gradient(135deg,#818cf8,#c084fc);color:#fff;letter-spacing:0.01em;}
        .btn:disabled{opacity:0.35;cursor:not-allowed;}
        .btn:not(:disabled):hover{transform:translateY(-2px);box-shadow:0 12px 40px #818cf840;}
        .loading-wrap{margin-top:1.25rem;text-align:center;}
        .loading-stage{font-size:13px;color:#818cf8;margin-bottom:10px;font-weight:500;}
        .track{height:2px;background:#1e2035;border-radius:2px;overflow:hidden;}
        .fill{height:100%;background:linear-gradient(90deg,#818cf8,#c084fc);border-radius:2px;animation:sweep 2.5s ease-in-out infinite;}
        @keyframes sweep{0%{width:5%}60%{width:80%}100%{width:95%}}
        .err{margin-top:1rem;padding:14px 18px;background:#1a0a0a;border:1px solid #ef444440;border-radius:14px;color:#f87171;font-size:13px;}
        .result-card{background:#0d0d18;border:1px solid #ffffff08;border-radius:24px;padding:1.75rem;margin-top:20px;}
        .result-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;}
        .result-title{font-size:11px;color:#334155;text-transform:uppercase;letter-spacing:0.12em;font-weight:600;}
        .copy-btn{display:flex;align-items:center;gap:6px;background:#13131f;border:1px solid #ffffff10;color:#818cf8;padding:8px 16px;border-radius:10px;font-size:12px;font-weight:600;cursor:pointer;font-family:'Inter',sans-serif;transition:all 0.2s;}
        .copy-btn:hover{background:#1a1a2e;}
        .letter-body{background:#13131f;border:1px solid #ffffff06;border-radius:16px;padding:2rem;}
        .letter-body pre{font-size:14px;color:#94a3b8;line-height:1.9;white-space:pre-wrap;font-family:'Inter',sans-serif;}
        footer{text-align:center;padding:2rem;border-top:1px solid #ffffff08;color:#1e293b;font-size:12px;margin-top:2rem;}
      `}</style>

      <nav className="navbar">
        <div className="logo">ResumeAI</div>
        <div className="nav-right">
          <a href="/" className="nav-link">Resume Analyser</a>
          <a href="/cover-letter" className="nav-link active">Cover Letter</a>
          <a href="/history" className="nav-link">History</a>
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </nav>

      <div className="page">
        <div className="page-badge">✉ AI Cover Letter Generator</div>
        <h1>Land the interview with a<br /><span className="grad">tailored cover letter.</span></h1>
        <p className="page-sub">Upload your resume, paste the job description — get a personalised letter in seconds.</p>

        <div className="grid">
          <div className="card">
            <div className="card-title">📄 Your resume</div>
            <div className={`upload-zone${file ? ' has-file' : ''}`}>
              <input type="file" accept=".pdf" className="file-input"
                onChange={(e) => setFile(e.target.files?.[0] || null)} />
              <div className="upload-icon">{file ? '✅' : '📄'}</div>
              {file
                ? <div className="upload-name">✓ {file.name}</div>
                : <div className="upload-t">Click or drop your PDF resume</div>}
            </div>
          </div>

          <div className="card">
            <div className="card-title">🏢 Job details</div>
            <div className="two">
              <div>
                <label className="lbl">Company name</label>
                <input className="inp" placeholder="Google, TCS..." value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)} />
              </div>
              <div>
                <label className="lbl">Job title</label>
                <input className="inp" placeholder="Software Engineer..." value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)} />
              </div>
            </div>
            <div className="field">
              <label className="lbl">Job description</label>
              <textarea className="ta" rows={7} placeholder="Paste the full job description here..."
                value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} />
            </div>
          </div>
        </div>

        <button className="btn" onClick={handleGenerate} disabled={!file || !jobDescription || loading}>
          {loading ? (stage || 'Generating...') : '✨ Generate my cover letter →'}
        </button>

        {loading && (
          <div className="loading-wrap">
            <div className="loading-stage">{stage}</div>
            <div className="track"><div className="fill"></div></div>
          </div>
        )}
        {error && <div className="err">⚠ {error}</div>}

        {coverLetter && (
          <div className="result-card">
            <div className="result-header">
              <div className="result-title">✉ Your cover letter</div>
              <button className="copy-btn" onClick={copy}>
                {copied ? '✓ Copied!' : '📋 Copy to clipboard'}
              </button>
            </div>
            <div className="letter-body">
              <pre>{coverLetter}</pre>
            </div>
          </div>
        )}
      </div>

      <footer>Built with Next.js · Groq · Llama 3.3 · Clerk · Neon</footer>
    </>
  );
}