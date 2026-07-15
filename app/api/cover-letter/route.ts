import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const { resumeText, jobDescription, companyName, jobTitle } = await req.json();

    if (!resumeText || !jobDescription) {
      return NextResponse.json({ error: 'Resume and job description are required' }, { status: 400 });
    }

    const client = new Groq({ apiKey });

    const completion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: `You are an expert career coach and professional writer. Write a compelling, personalized cover letter based on the candidate's resume and the job description provided.

Guidelines:
- Write in first person, in the candidate's natural voice
- Keep it to 3-4 paragraphs
- Opening: Express enthusiasm for the specific role at ${companyName || 'the company'}
- Middle: Connect 2-3 specific achievements from the resume to the job requirements
- Closing: Strong call to action
- Do NOT use generic phrases like "I am writing to apply"
- Make it sound human, confident, and specific
- Do NOT include subject line or email headers
- Start directly with "Dear Hiring Manager,"

Job Title: ${jobTitle || 'the position'}
Company: ${companyName || 'the company'}

JOB DESCRIPTION:
${jobDescription}

CANDIDATE RESUME:
${resumeText}

Write the cover letter now:`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });

    const coverLetter = completion.choices[0]?.message?.content || '';

    return NextResponse.json({ coverLetter });

  } catch (error) {
    console.error('Cover letter error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to generate cover letter'
    }, { status: 500 });
  }
}