import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import fs from "fs";
import path from "path";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function toSlug(subject: string): string {
  return subject
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function loadFile(slug: string, filename: string): string {
  try {
    const filePath = path.join(process.cwd(), "src", "data", "notes", filename);
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return "";
  }
}

export async function POST(req: NextRequest) {
  const { topic, subject, context, count = 10 } = await req.json();

  const safeCount = Math.min(Math.max(parseInt(count, 10) || 10, 1), 30);
  const slug = toSlug(subject);

  const notes = loadFile(slug, `${slug}.txt`);
  const pyq = loadFile(slug, `${slug}-pyq.txt`);

  const prompt = `You are an expert question setter for LBS MCA entrance exam preparation.

${notes ? `=== SUBJECT NOTES ===\n${notes}\n` : ""}
${pyq ? `=== PAST YEAR QUESTIONS (PYQ) ===\n${pyq}\n` : ""}
${context ? `=== EXTRA CONTEXT FROM USER ===\n${context}\n` : ""}
${!notes && !pyq && !context ? "No reference material provided. Use general knowledge for this topic." : ""}

Generate exactly ${safeCount} MCQ questions for the topic: "${topic}" (Subject: ${subject}).

IMPORTANT INSTRUCTIONS:
- Match the difficulty and style of the PYQ provided above
- At least 40% of questions should be directly inspired by or adapted from the PYQ (same concepts, similar phrasing, same level of depth)
- Remaining questions should be based on the notes and cover important concepts the PYQ style would test
- ALL questions must be type "mcq" with exactly 4 options
- Do not include short answer or descriptive questions

Return ONLY valid JSON. No markdown. No backticks. No text outside the JSON.

{
  "questions": [
    {
      "id": 1,
      "type": "mcq",
      "question": "Question text?",
      "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
      "answer": "Option A text",
      "explanation": "Why this is correct"
    }
  ]
}

Rules:
- "answer" must be the EXACT string of the correct option — not A/B/C/D letters
- All 4 options must be meaningfully different
- No "All of the above" or "None of the above"
- LBS MCA entrance exam difficulty level`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 6000,
    });

    const raw = completion.choices[0]?.message?.content || "";
    const clean = raw.replace(/```json|```/g, "").trim();
    const data = JSON.parse(clean);

    // Normalize options if model returned {A: "..."} instead of array
    data.questions = data.questions.map(
      (q: { type: string; options?: unknown }) => {
        if (q.type === "mcq" && q.options && !Array.isArray(q.options)) {
          q.options = Object.values(q.options as Record<string, string>);
        }
        return q;
      },
    );

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to generate questions" },
      { status: 500 },
    );
  }
}
