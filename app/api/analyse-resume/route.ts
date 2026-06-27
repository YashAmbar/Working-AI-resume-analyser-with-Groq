import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(req: NextRequest) {
  try {
    console.log('=== ANALYSE ROUTE HIT ===');

    const apiKey = process.env.GROQ_API_KEY;
    console.log('API Key:', apiKey ? 'FOUND' : 'MISSING');

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    let body;
    try {
      body = await req.json();
      console.log('Resume text length:', body?.resumeText?.length ?? 'undefined');
    } catch (e) {
      console.error('Failed to parse request body:', e);
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { resumeText } = body;

    if (!resumeText) {
      return NextResponse.json({ error: 'No resume text provided' }, { status: 400 });
    }

    console.log('Calling Groq API...');
    const client = new Groq({ apiKey });

    const completion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: `You are an expert resume analyser. Analyse the following resume and return ONLY a JSON object with no extra text, no markdown, no backticks. Just raw JSON.

The JSON must have exactly this structure:
{
  "score": <number from 0 to 100>,
  "experience_years": <number>,
  "top_skills": [<list of up to 6 skill strings>],
  "strengths": [<list of 3 strength strings>],
  "gaps": [<list of 3 improvement suggestion strings>],
  "summary": "<2 sentence summary of the candidate>"
}

Resume text:
${resumeText}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 1024,
    });

    const raw = completion.choices[0]?.message?.content || '';
    console.log('Groq raw response:', raw.substring(0, 200));

    const clean = raw.replace(/```json|```/g, '').trim();
    const analysis = JSON.parse(clean);

    return NextResponse.json({ analysis });

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Analysis failed'
    }, { status: 500 });
  }
}