import OpenAI from 'openai';
import { NextResponse } from 'next/server';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error('OPENAI_API_KEY is not set in environment variables');
}

let openai: OpenAI | null = null;

try {
  if (apiKey) {
    openai = new OpenAI({ apiKey });
  }
} catch (error) {
  console.error('Error initializing OpenAI:', error);
}

export async function POST(req: Request) {
  if (!openai) {
    console.error('OpenAI client is not initialized. OPENAI_API_KEY may be missing.');
    return NextResponse.json({ error: 'OpenAI client is not initialized. Check server logs for details.' }, { status: 500 });
  }

  try {
    const body = await req.json();
    console.log('Received request body:', body);

    if (!body.messages || !Array.isArray(body.messages) || body.messages.some((msg: Message) => !msg.role || !msg.content)) {
      console.error('Invalid or missing messages in request body');
      return NextResponse.json({ error: 'Invalid or missing messages in request body' }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: body.messages,
    });

    console.log('OpenAI API response:', completion);

    if (!completion.choices || completion.choices.length === 0) {
      console.error('OpenAI response did not contain any choices');
      return NextResponse.json({ error: 'No choices returned from OpenAI' }, { status: 500 });
    }

    const reply = completion.choices[0]?.message?.content ?? 'Respuesta vacía';

    return NextResponse.json({ reply });
  } catch (error: unknown) {
    console.error('Error in POST handler:', error);

    if (error instanceof Error) {
      console.error('Error details:', error.stack);
      return NextResponse.json({ error: 'An error occurred during your request.', details: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: 'An unknown error occurred during your request.' }, { status: 500 });
  }
}