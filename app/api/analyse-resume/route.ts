import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    console.log('=== ANALYSE ROUTE HIT ===');

    const { userId } = await auth();
    console.log('User ID:', userId);

    if (!userId) {
      return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    console.log('API Key:', apiKey ? 'FOUND' : 'MISSING');

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const body = await req.json();
    const { resumeText, fileName } = body;
    console.log('Resume text length:', resumeText?.length);

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
    console.log('Analysis parsed successfully, score:', analysis.score);

    // Save to database
    try {
      console.log('Saving to database...');
      const user = await currentUser();
      const email = user?.emailAddresses[0]?.emailAddress || '';

      const dbUser = await prisma.user.upsert({
        where: { clerkId: userId },
        update: {},
        create: { clerkId: userId, email },
      });
      console.log('DB User:', dbUser.id);

      const saved = await prisma.analysis.create({
        data: {
          userId: dbUser.id,
          fileName: fileName || 'resume.pdf',
          score: analysis.score,
          experienceYears: analysis.experience_years,
          topSkills: analysis.top_skills,
          strengths: analysis.strengths,
          gaps: analysis.gaps,
          summary: analysis.summary,
        },
      });
      console.log('✅ Analysis saved to database! ID:', saved.id);

    } catch (dbError) {
      console.error('❌ DATABASE ERROR:', dbError);
    }

    return NextResponse.json({ analysis });

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Analysis failed'
    }, { status: 500 });
  }
}