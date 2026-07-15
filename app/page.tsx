'use client';
import { UserButton, useUser } from '@clerk/nextjs';

export default function LandingPage() {
  const { isSignedIn } = useUser();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Sora:wght@600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        html,body{width:100%;overflow-x:hidden;}
        body{font-family:'Inter',sans-serif;background:#0a0a0f;color:#e2e8f0;min-height:100vh;}

        /* NAVBAR */
        .navbar{display:flex;justify-content:space-between;align-items:center;padding:1.25rem 4rem;border-bottom:1px solid #ffffff0d;background:#0a0a0fcc;backdrop-filter:blur(12px);position:sticky;top:0;z-index:50;}
        .logo{font-family:'Sora',sans-serif;font-size:24px;font-weight:800;background:linear-gradient(135deg,#818cf8,#c084fc);-webkit-background-clip:text;-webkit-text-fill-color:transparent;text-decoration:none;}
        .nav-right{display:flex;align-items:center;gap:32px;}
        .nav-link{font-size:15px;color:#64748b;text-decoration:none;font-weight:500;transition:color 0.2s;}
        .nav-link:hover{color:#e2e8f0;}
        .nav-btn{padding:10px 22px;border-radius:10px;font-size:14px;font-weight:600;font-family:'Inter',sans-serif;cursor:pointer;transition:all 0.2s;text-decoration:none;display:inline-block;}
        .nav-btn-outline{background:transparent;border:1px solid #ffffff15;color:#e2e8f0;}
        .nav-btn-outline:hover{border-color:#818cf8;color:#818cf8;}
        .nav-btn-fill{background:linear-gradient(135deg,#818cf8,#c084fc);border:none;color:#fff;margin-left:4px;}
        .nav-btn-fill:hover{transform:translateY(-1px);box-shadow:0 8px 24px #818cf840;}

        /* HERO */
        .hero{text-align:center;padding:10rem 4rem 7rem;position:relative;overflow:hidden;width:100%;}
        .hero::before{content:'';position:absolute;top:-300px;left:50%;transform:translateX(-50%);width:1000px;height:1000px;background:radial-gradient(ellipse,#818cf815 0%,transparent 70%);pointer-events:none;}
        .badge{display:inline-flex;align-items:center;gap:8px;background:#13131f;border:1px solid #818cf825;border-radius:100px;padding:8px 20px;font-size:14px;color:#818cf8;margin-bottom:2.5rem;font-weight:500;}
        .badge-dot{width:8px;height:8px;background:#818cf8;border-radius:50%;animation:blink 2s infinite;}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
        .hero h1{font-family:'Sora',sans-serif;font-size:clamp(3.5rem,7vw,7rem);font-weight:800;line-height:1.05;margin-bottom:2rem;letter-spacing:-0.03em;}
        .grad{background:linear-gradient(135deg,#818cf8 0%,#c084fc 50%,#f472b6 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
        .hero-sub{color:#475569;font-size:clamp(16px,2vw,22px);max-width:640px;margin:0 auto 3.5rem;line-height:1.75;}
        .hero-btns{display:flex;gap:16px;justify-content:center;flex-wrap:wrap;margin-bottom:5rem;}
        .hero-btn-primary{display:inline-flex;align-items:center;gap:10px;padding:18px 40px;border-radius:16px;font-size:17px;font-weight:600;font-family:'Inter',sans-serif;background:linear-gradient(135deg,#818cf8,#c084fc);color:#fff;border:none;cursor:pointer;text-decoration:none;transition:all 0.25s;}
        .hero-btn-primary:hover{transform:translateY(-3px);box-shadow:0 20px 60px #818cf845;}
        .hero-btn-secondary{display:inline-flex;align-items:center;gap:10px;padding:18px 40px;border-radius:16px;font-size:17px;font-weight:600;font-family:'Inter',sans-serif;background:#13131f;color:#e2e8f0;border:1px solid #ffffff10;cursor:pointer;text-decoration:none;transition:all 0.25s;}
        .hero-btn-secondary:hover{border-color:#818cf840;transform:translateY(-3px);}

        /* STATS */
        .stats-bar{display:flex;justify-content:center;border:1px solid #ffffff08;border-radius:24px;background:#0d0d18;max-width:800px;margin:0 auto;overflow:hidden;}
        .stat-item{flex:1;padding:2.5rem 2rem;text-align:center;border-right:1px solid #ffffff08;}
        .stat-item:last-child{border-right:none;}
        .stat-num{font-family:'Sora',sans-serif;font-size:48px;font-weight:800;background:linear-gradient(135deg,#818cf8,#c084fc);-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1;}
        .stat-lbl{font-size:15px;color:#334155;margin-top:8px;}

        /* SECTIONS */
        .section{padding:8rem 6rem;width:100%;}
        .section-label{font-size:14px;color:#818cf8;text-transform:uppercase;letter-spacing:0.14em;font-weight:600;text-align:center;margin-bottom:1.25rem;}
        .section-title{font-family:'Sora',sans-serif;font-size:clamp(2.5rem,4vw,4.5rem);font-weight:800;text-align:center;margin-bottom:1.25rem;letter-spacing:-0.03em;line-height:1.1;}
        .section-sub{color:#475569;text-align:center;font-size:18px;max-width:560px;margin:0 auto 4rem;line-height:1.75;}

        /* TOOLS */
        .tools-grid{display:grid;grid-template-columns:1fr 1fr;gap:28px;width:100%;}
        @media(max-width:768px){.tools-grid,.features-grid,.steps{grid-template-columns:1fr !important;}.stats-bar{flex-direction:column;}.stat-item{border-right:none;border-bottom:1px solid #ffffff08;}.stat-item:last-child{border-bottom:none;}.section{padding:6rem 2rem;}.navbar{padding:1rem 1.5rem;}.hero{padding:7rem 2rem 5rem;}}
        .tool-card{background:#0d0d18;border:1px solid #ffffff08;border-radius:28px;padding:3rem;position:relative;overflow:hidden;transition:all 0.3s;cursor:pointer;text-decoration:none;display:block;}
        .tool-card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,#818cf825,transparent);}
        .tool-card:hover{border-color:#818cf820;transform:translateY(-6px);box-shadow:0 32px 80px #00000070;}
        .tool-icon{width:80px;height:80px;border-radius:22px;display:flex;align-items:center;justify-content:center;font-size:40px;margin-bottom:2rem;}        .icon-purple{background:linear-gradient(135deg,#818cf820,#c084fc20);border:1px solid #818cf820;}
        .icon-blue{background:linear-gradient(135deg,#38bdf820,#818cf820);border:1px solid #38bdf820;}
        .tool-card h3{font-family:'Sora',sans-serif;font-size:36px;font-weight:700;margin-bottom:16px;color:#e2e8f0;}
        .tool-card p{font-size:20px;color:#475569;line-height:1.75;margin-bottom:2rem;}
        .tool-features{list-style:none;margin-bottom:2.5rem;}
        .tool-features li{font-size:18px;color:#64748b;padding:9px 0;display:flex;align-items:center;gap:12px;}
        .tool-features li::before{content:'✓';color:#818cf8;font-weight:700;font-size:16px;}
        .tool-cta{display:inline-flex;align-items:center;gap:8px;font-size:20px;font-weight:600;color:#818cf8;}

        /* HOW IT WORKS */
        .how-section{padding:8rem 6rem;background:#0d0d18;border-top:1px solid #ffffff06;border-bottom:1px solid #ffffff06;width:100%;}
        .steps{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:0;margin-top:4rem;}
        .step{text-align:center;padding:2rem 1.5rem;position:relative;}
        .step:not(:last-child)::after{content:'→';position:absolute;right:-8px;top:2.5rem;color:#1e2035;font-size:24px;}
        .step-num{width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#818cf820,#c084fc20);border:1px solid #818cf830;display:flex;align-items:center;justify-content:center;margin:0 auto 1.25rem;font-family:'Sora',sans-serif;font-size:20px;font-weight:700;color:#818cf8;}
        .step h4{font-size:18px;font-weight:600;color:#e2e8f0;margin-bottom:8px;}
        .step p{font-size:15px;color:#334155;line-height:1.65;}

        /* FEATURES */
        .features-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;width:100%;}
        .feat-card{background:#0d0d18;border:1px solid #ffffff06;border-radius:24px;padding:2rem;}
        .feat-icon{font-size:32px;margin-bottom:16px;}
        .feat-card h4{font-size:18px;font-weight:600;color:#e2e8f0;margin-bottom:8px;}
        .feat-card p{font-size:15px;color:#334155;line-height:1.7;}

        /* CTA */
        .cta-section{padding:8rem 4rem;text-align:center;width:100%;}
        .cta-box{max-width:900px;margin:0 auto;background:#0d0d18;border:1px solid #818cf815;border-radius:36px;padding:6rem 4rem;position:relative;overflow:hidden;}
        .cta-box::before{content:'';position:absolute;top:-150px;left:50%;transform:translateX(-50%);width:600px;height:600px;background:radial-gradient(ellipse,#818cf812 0%,transparent 70%);pointer-events:none;}
        .cta-box h2{font-family:'Sora',sans-serif;font-size:clamp(2.5rem,4vw,4.5rem);font-weight:800;margin-bottom:1.25rem;letter-spacing:-0.03em;line-height:1.1;}
        .cta-box p{color:#475569;font-size:18px;margin-bottom:2.5rem;line-height:1.75;max-width:560px;margin-left:auto;margin-right:auto;}

        footer{text-align:center;padding:2.5rem;border-top:1px solid #ffffff06;color:#1e293b;font-size:14px;}
      `}</style>

      {/* NAVBAR */}
      <nav className="navbar">
        <a href="/" className="logo">ResumeAI</a>
        <div className="nav-right">
          <a href="/analyse" className="nav-link">Resume Analyser</a>
          <a href="/cover-letter" className="nav-link">Cover Letter</a>
          {isSignedIn ? (
            <>
              <a href="/analyse" className="nav-btn nav-btn-outline">Dashboard</a>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <>
              <a href="/sign-in" className="nav-btn nav-btn-outline">Sign in</a>
              <a href="/sign-up" className="nav-btn nav-btn-fill">Get started free</a>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <div className="hero">
        <div className="badge"><span className="badge-dot"></span>Powered by Llama 3.3 · 70B · Free</div>
        <h1>Get hired faster with<br /><span className="grad">AI-powered resume tools.</span></h1>
        <p className="hero-sub">Analyse your resume, fix ATS issues, and generate tailored cover letters — all in one place, powered by AI.</p>
        <div className="hero-btns">
          <a href="/analyse" className="hero-btn-primary">📄 Analyse my resume →</a>
          <a href="/cover-letter" className="hero-btn-secondary">✉ Generate cover letter</a>
        </div>
        <div className="stats-bar">
          <div className="stat-item"><div className="stat-num">92</div><div className="stat-lbl">Avg. ATS score after fix</div></div>
          <div className="stat-item"><div className="stat-num">3s</div><div className="stat-lbl">Analysis time</div></div>
          <div className="stat-item"><div className="stat-num">Free</div><div className="stat-lbl">No credit card needed</div></div>
        </div>
      </div>

      {/* TOOLS */}
      <div className="section">
        <div className="section-label">Our Tools</div>
        <h2 className="section-title">Everything you need to<br />land your next job</h2>
        <p className="section-sub">Two powerful AI tools designed to give you an unfair advantage in your job search.</p>
        <div className="tools-grid">
          <a href="/analyse" className="tool-card">
            <div className="tool-icon icon-purple">📊</div>
            <h3>AI Resume Analyser</h3>
            <p>Upload your PDF resume and get an instant ATS compatibility score with detailed feedback.</p>
            <ul className="tool-features">
              <li>ATS score out of 100</li>
              <li>Top skills detection</li>
              <li>Strengths & gap analysis</li>
              <li>AI-generated summary</li>
              <li>Analysis history saved</li>
            </ul>
            <div className="tool-cta">Analyse my resume →</div>
          </a>
          <a href="/cover-letter" className="tool-card">
            <div className="tool-icon icon-blue">✉</div>
            <h3>Cover Letter Generator</h3>
            <p>Upload your resume and paste a job description — get a tailored cover letter in seconds.</p>
            <ul className="tool-features">
              <li>Personalised to the job</li>
              <li>Written in your voice</li>
              <li>Highlights your best projects</li>
              <li>Professional tone</li>
              <li>Copy with one click</li>
            </ul>
            <div className="tool-cta">Generate cover letter →</div>
          </a>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="how-section">
        <div className="section-label">How it works</div>
        <h2 className="section-title">From upload to interview-ready<br />in under 60 seconds</h2>
        <div className="steps">
          <div className="step">
            <div className="step-num">1</div>
            <h4>Upload resume</h4>
            <p>Drop your PDF resume into the analyser tool</p>
          </div>
          <div className="step">
            <div className="step-num">2</div>
            <h4>AI analyses</h4>
            <p>Llama 3.3 70B reads and evaluates every line</p>
          </div>
          <div className="step">
            <div className="step-num">3</div>
            <h4>Get feedback</h4>
            <p>See your ATS score, skills, strengths and gaps</p>
          </div>
          <div className="step">
            <div className="step-num">4</div>
            <h4>Apply with confidence</h4>
            <p>Generate a tailored cover letter and apply</p>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div className="section">
        <div className="section-label">Features</div>
        <h2 className="section-title">Built for serious<br />job seekers</h2>
        <p className="section-sub">Every feature is designed to give you a real advantage over other candidates.</p>
        <div className="features-grid">
          <div className="feat-card"><div className="feat-icon">🎯</div><h4>ATS Score</h4><p>Know exactly how ATS systems rate your resume with a score out of 100.</p></div>
          <div className="feat-card"><div className="feat-icon">🛠</div><h4>Skill Detection</h4><p>AI identifies your top skills and compares them to what employers want.</p></div>
          <div className="feat-card"><div className="feat-icon">⚠</div><h4>Gap Analysis</h4><p>Find exactly what's missing from your resume and how to fix it.</p></div>
          <div className="feat-card"><div className="feat-icon">✉</div><h4>Cover Letters</h4><p>Generate personalised cover letters tailored to specific job descriptions.</p></div>
          <div className="feat-card"><div className="feat-icon">📂</div><h4>History</h4><p>All your analyses are saved so you can track improvement over time.</p></div>
          <div className="feat-card"><div className="feat-icon">⚡</div><h4>Instant Results</h4><p>Powered by Groq's ultra-fast inference — results in under 3 seconds.</p></div>
        </div>
      </div>

      {/* CTA */}
      <div className="cta-section">
        <div className="cta-box">
          <h2>Ready to get more<br /><span className="grad">interview calls?</span></h2>
          <p>Join thousands of job seekers using ResumeAI to stand out from the crowd. Free forever, no credit card needed.</p>
          <a href="/analyse" className="hero-btn-primary" style={{display:'inline-flex',marginTop:'0.5rem'}}>
            Get started free →
          </a>
        </div>
      </div>

      <footer>© 2026 ResumeAI · Built with Next.js · Groq · Llama 3.3 · Clerk · Neon</footer>
    </>
  );
}