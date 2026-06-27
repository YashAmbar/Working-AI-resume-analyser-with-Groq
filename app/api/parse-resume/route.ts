import { NextRequest, NextResponse } from 'next/server';
import { extractText } from 'unpdf';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('resume') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are supported' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = new Uint8Array(bytes);

    const { text, totalPages } = await extractText(buffer, { mergePages: true });

    const wordCount = text.split(/\s+/).filter(Boolean).length;

    return NextResponse.json({
      text,
      pages: totalPages,
      wordCount,
    });

  } catch (error) {
    console.error('PDF parse error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to parse PDF'
    }, { status: 500 });
  }
}