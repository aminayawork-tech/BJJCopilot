import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const BASE_SYSTEM_PROMPT = `You are a BJJ black belt instructor with 20+ years of experience. Answer questions about Brazilian Jiu-Jitsu techniques, positions, escapes, submissions, and training concepts. Be specific, practical, and concise. Use standard BJJ terminology. Focus on high-percentage fundamentals over advanced or low-percentage techniques. Keep answers tight — no motivational filler.

IMPORTANT FORMATTING RULES: Write in plain text only. No markdown. No asterisks, no underscores, no pound signs, no backticks. For lists use simple numbering like "1." "2." or start lines with a dash and space. Separate paragraphs with a blank line.`;

function buildSystemPrompt(analysisContext?: string): string {
  if (!analysisContext) return BASE_SYSTEM_PROMPT;
  return `${BASE_SYSTEM_PROMPT}

The athlete has just received this coaching analysis of their roll and wants to discuss it:

---
${analysisContext}
---

Reference specific moments and feedback from that analysis when relevant. Help them understand the corrections, drill suggestions, and concepts mentioned above.`;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY is not set');
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }

  let messages: ChatMessage[];
  let analysisContext: string | undefined;
  try {
    const body = await request.json();
    messages = body.messages;
    analysisContext = body.analysisContext;
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'No messages provided.' }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 1024,
      system: buildSystemPrompt(analysisContext),
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const textBlock = response.content.find((block) => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json({ error: 'No reply from AI.' }, { status: 500 });
    }

    return NextResponse.json({ reply: textBlock.text });
  } catch (err: unknown) {
    console.error('Chat API error:', err);
    if (err instanceof Anthropic.APIError) {
      if (err.status === 401) return NextResponse.json({ error: 'Invalid API key.' }, { status: 500 });
      if (err.status === 429) return NextResponse.json({ error: 'Rate limit exceeded. Please wait a moment.' }, { status: 429 });
      return NextResponse.json({ error: 'AI service error. Please try again.' }, { status: 502 });
    }
    return NextResponse.json({ error: 'Unexpected error. Please try again.' }, { status: 500 });
  }
}
