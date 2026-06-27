'use client';
import { useState } from 'react';

type Analysis = {
  score: number;
  experience_years: number;
  top_skills: string[];
  strengths: string[];
  gaps: string[];
  summary: string;
};

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState('');
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState('');

  async function handleAnalyse() {
    if (!file) return;
    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      setStage('📄 Reading your resume...');
      const formData = new FormData();
      formData.append('resume', file);
      const parseRes = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      });
      const parseData = await parseRes.json();
      if (parseData.error) throw new Error(parseData.error);

      setStage('🤖 Claude is analysing your resume...');
      const analyseRes = await fetch('/api/analyse-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: parseData.text }),
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

  const scoreColor = analysis
    ? analysis.score >= 75 ? '#22c55e'
    : analysis.score >= 50 ? '#f59e0b'
    : '#ef4444'
    : '#534AB7';

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-16 px-4">
      <div className="w-full max-w-2xl">

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">AI Resume Analyser</h1>
          <p className="text-gray-500">Upload your resume and get instant AI-powered feedback</p>
        </div>

        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center mb-4">
          <div className="text-5xl mb-4">📄</div>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => { setFile(e.target.files?.[0] || null); setAnalysis(null); }}
            className="block mx-auto text-sm text-gray-500 mb-3"
          />
          {file && <p className="text-sm text-indigo-600 font-medium">✓ {file.name}</p>}
        </div>

        <button
          onClick={handleAnalyse}
          disabled={!file || loading}
          className="w-full py-4 rounded-xl text-white font-semibold text-lg transition-all mb-6"
          style={{ backgroundColor: !file || loading ? '#a5a5a5' : '#534AB7' }}
        >
          {loading ? stage : '✨ Analyse My Resume'}
        </button>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm mb-6">
            ❌ {error}
          </div>
        )}

        {analysis && (
          <div className="space-y-4">

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="text-6xl font-bold mb-1" style={{ color: scoreColor }}>
                {analysis.score}
              </div>
              <div className="text-gray-400 text-sm uppercase tracking-wide">Resume Score / 100</div>
              <p className="text-gray-600 mt-3 text-sm leading-relaxed">{analysis.summary}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
                <div className="text-3xl font-bold text-indigo-600">{analysis.experience_years}</div>
                <div className="text-gray-400 text-xs uppercase tracking-wide mt-1">Years Experience</div>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
                <div className="text-3xl font-bold text-indigo-600">{analysis.top_skills.length}</div>
                <div className="text-gray-400 text-xs uppercase tracking-wide mt-1">Skills Detected</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-700 mb-3">🛠 Top Skills</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.top_skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-700 mb-3">✅ Strengths</h3>
              <ul className="space-y-2">
                {analysis.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>{s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-700 mb-3">⚠️ Areas to Improve</h3>
              <ul className="space-y-2">
                {analysis.gaps.map((g, i) => (
                  <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">→</span>{g}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}