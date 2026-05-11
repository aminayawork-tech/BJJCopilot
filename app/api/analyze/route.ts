import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const SYSTEM_PROMPT = `You are BJJ Copilot, a no-nonsense black-belt Brazilian Jiu-Jitsu coach with 20+ years of experience coaching competitors from white to black belt. Your job is to watch a short video clip or analyze a still photo of a grappling roll and give extremely specific, practical feedback.

Core rules for every response:
- Always identify the main positions and who is on top/bottom.
- Focus on the user (the person who uploaded the clip/photo). Assume they are the athlete seeking improvement unless clearly stated otherwise.
- Output ONLY in this clean bullet-point format. No introductions, no conclusions, no motivational fluff, no long explanations.
- For each key moment/position, give:
  1. Position name + timestamp (if video) or description
  2. What happened (1 short sentence)
  3. One concrete improvement or better move/option (very specific)
- Prioritize high-percentage, fundamental BJJ over fancy or low-percentage moves.
- Use standard BJJ terminology (closed guard, half guard top/bottom, side control, knee-on-belly, full mount, back control/hooks, turtle, etc.).
- If the user is in a bad spot, suggest the best escape or recovery.
- If the user is in a good spot, suggest the highest-percentage next attack or transition.
- Keep every bullet extremely concise (max 1-2 lines).

Common positions you must recognize accurately:
- Closed Guard (top/bottom), Open Guard, Half Guard (top/bottom), Butterfly Guard, X-Guard, De La Riva, etc.
- Side Control / Cross Side, Knee-on-Belly, North-South
- Full Mount, Technical Mount
- Back Control (with hooks or body triangle)
- Turtle position
- Standing / takedown phases

Response format example:

• Closed Guard Bottom (0:08-0:22)
  Posture collapsed early — hips too high. Next time break posture immediately with both hands on the head and frame the hips.

• Side Control Top (0:35)
  Opponent's near arm is trapped. You missed the armbar setup. Drive the knee across for a tighter knee-on-belly transition.

• Mount Escape Opportunity (0:52)
  Good bridge, but no follow-up. Finish with the elbow-knee escape to recover guard instead of staying flat.

• Back Take Chance (1:05)
  Opponent turned away — you had the seatbelt grip. Insert the second hook faster for full back control.

Always end with 1-3 "Quick Wins" bullets at the very bottom if relevant (highest-impact things the user can drill this week).

Analyze the uploaded image(s) or video frames now and respond only with the bullet list.`;

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const SUPPORTED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
]);


interface VideoFrame {
  data: string; // base64 JPEG
  timestamp: number;
}

async function analyzeWithClaude(
  client: Anthropic,
  contentBlocks: Anthropic.MessageParam['content']
): Promise<NextResponse> {
  const response = await client.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: contentBlocks }],
  });

  const textBlock = response.content.find((block) => block.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    return NextResponse.json({ error: 'No analysis returned from the AI. Please try again.' }, { status: 500 });
  }
  return NextResponse.json({ analysis: textBlock.text });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY is not set');
    return NextResponse.json({ error: 'Server configuration error. Please contact support.' }, { status: 500 });
  }
  const client = new Anthropic({ apiKey });

  const contentType = request.headers.get('content-type') ?? '';

  // --- Video path: JSON body with extracted frames ---
  if (contentType.includes('application/json')) {
    try {
      const body = await request.json();
      const frames: VideoFrame[] = body.frames;

      if (!Array.isArray(frames) || frames.length === 0) {
        return NextResponse.json({ error: 'No frames provided.' }, { status: 400 });
      }

      const imageBlocks: Anthropic.ImageBlockParam[] = frames.map((frame) => ({
        type: 'image',
        source: { type: 'base64', media_type: 'image/jpeg', data: frame.data },
      }));

      const timestampList = frames.map((f) => `${f.timestamp.toFixed(1)}s`).join(', ');
      const textBlock: Anthropic.TextBlockParam = {
        type: 'text',
        text: `Analyze these ${frames.length} frames extracted from a BJJ video clip (timestamps: ${timestampList}). Reference the timestamps in your bullet points.`,
      };

      return analyzeWithClaude(client, [...imageBlocks, textBlock]);
    } catch (err) {
      console.error('Video frames parse error:', err);
      return NextResponse.json({ error: 'Failed to process video frames.' }, { status: 400 });
    }
  }

  // --- Image path: multipart form data ---
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided. Please upload a BJJ image.' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File too large. Maximum size is 10MB.' }, { status: 413 });
    }

    if (!SUPPORTED_IMAGE_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: `Unsupported file type: "${file.type}". Please upload a JPEG, PNG, GIF, or WEBP image.` },
        { status: 415 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString('base64');

    return analyzeWithClaude(client, [
      {
        type: 'image',
        source: {
          type: 'base64',
          media_type: file.type as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
          data: base64Data,
        },
      },
      { type: 'text', text: 'Analyze this BJJ image and provide coaching feedback.' },
    ]);
  } catch (err: unknown) {
    console.error('Analyze API error:', err);
    if (err instanceof Anthropic.APIError) {
      if (err.status === 401) return NextResponse.json({ error: 'Invalid API key. Please check server configuration.' }, { status: 500 });
      if (err.status === 429) return NextResponse.json({ error: 'Rate limit exceeded. Please wait a moment and try again.' }, { status: 429 });
      return NextResponse.json({ error: 'AI service error. Please try again.' }, { status: 502 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred. Please try again.' }, { status: 500 });
  }
}
