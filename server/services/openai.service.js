/**
 * OpenAI Service — Legaforce
 *
 * Provides GPT-4o-powered:
 *   1. CV summary generation from profile data
 *   2. AI match scoring (candidate vs job requirements)
 *
 * Falls back to local logic when OPENAI_API_KEY is not set (dev mode).
 */
import { OPENAI_API_KEY, NODE_ENV } from "../config/env.js";

const isEnabled = !!OPENAI_API_KEY;

if (isEnabled) {
  console.log(" OpenAI API initialized");
} else {
  console.log("⚠️  OpenAI API key not configured — using local fallback");
}

// ── Shared fetch helper ────────────────────────

async function chatCompletion(systemPrompt, userPrompt, maxTokens = 1024) {
  if (!isEnabled) return null;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user",   content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error("OpenAI API error:", response.status, error);
      return null;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch (err) {
    console.error("OpenAI request failed:", err.message);
    return null;
  }
}

// ── 1. Generate CV Summary ─────────────────────

export async function generateCVSummary(profile, cvData = {}) {
  const fullName = `${profile.firstName} ${profile.lastName}`.trim();
  const experience = cvData.experience || [];
  const skills = cvData.skills || [];
  const education = cvData.education || [];
  const certifications = cvData.certifications || [];

  const systemPrompt = `You are an expert professional CV writer specializing in overseas Filipino workers (OFW) and international manpower recruitment. Write clear, professional, and compelling CV content. Always write in third person. Be specific and quantify achievements when possible.`;

  const userPrompt = `Generate a professional CV summary (2-3 paragraphs) and a list of key strengths for this candidate:

Name: ${fullName}
Nationality: ${profile.nationality || "Filipino"}
Phone: ${profile.phone || "Not provided"}

Work Experience:
${experience.length > 0 ? experience.map((e) => `- ${e.position || e.title} at ${e.company} (${e.startDate || "?"} – ${e.endDate || "Present"}): ${e.description || "No description"}`).join("\n") : "No work experience listed"}

Skills: ${skills.length > 0 ? skills.join(", ") : "None listed"}

Education:
${education.length > 0 ? education.map((e) => `- ${e.degree} from ${e.institution} (${e.year || ""})`).join("\n") : "None listed"}

Certifications:
${certifications.length > 0 ? certifications.map((c) => `- ${c.name} (${c.issuer || ""})`).join("\n") : "None listed"}

Return a JSON object with this structure (no markdown, just raw JSON):
{
  "summary": "Professional summary paragraph(s)",
  "keyStrengths": ["Strength 1", "Strength 2", "Strength 3", "Strength 4", "Strength 5"]
}`;

  const result = await chatCompletion(systemPrompt, userPrompt, 800);

  if (result) {
    try {
      // Strip markdown code fences if present
      const cleaned = result.replace(/```json?\s*/g, "").replace(/```\s*/g, "").trim();
      const parsed = JSON.parse(cleaned);
      return {
        summary: parsed.summary || "",
        keyStrengths: parsed.keyStrengths || [],
        generatedBy: "openai-gpt-4o",
      };
    } catch (err) {
      console.error("Failed to parse OpenAI CV response:", err.message);
      // Fall through to local fallback
    }
  }

  // ── Local fallback ──
  return {
    summary: buildLocalSummary(fullName, profile, experience, skills, education, certifications),
    keyStrengths: skills.slice(0, 5),
    generatedBy: "local-fallback",
  };
}

function buildLocalSummary(fullName, profile, experience, skills, education, certifications) {
  let s = `${fullName} is a dedicated professional`;
  const titles = experience.map((e) => e.position || e.title).filter(Boolean);
  if (titles.length > 0) s += ` with experience as ${titles.slice(0, 3).join(", ")}`;
  if (profile.nationality) s += ` from ${profile.nationality}`;
  const degrees = education.map((e) => e.degree).filter(Boolean);
  if (degrees.length > 0) s += `. Holds a ${degrees[0]}`;
  if (skills.length > 0) s += `. Skilled in ${skills.slice(0, 5).join(", ")}`;
  const certNames = certifications.map((c) => c.name).filter(Boolean);
  if (certNames.length > 0) s += `. Certified in ${certNames.slice(0, 3).join(", ")}`;
  s += ". Seeking overseas employment opportunities for career growth and professional development.";
  return s;
}

// ── 2. AI Match Score ──────────────────────────

export async function computeAIMatchScore(profileSkills, jobRequirements, jobTitle) {
  const systemPrompt = `You are an AI recruitment matching system. Evaluate how well a candidate matches a job based on their skills vs the job requirements. Return a JSON object with a "score" (0-100 integer) and a "reason" (1 sentence).`;

  const skillsList = Array.isArray(profileSkills) ? profileSkills : [];
  const reqList = Array.isArray(jobRequirements)
    ? jobRequirements
    : Array.isArray(jobRequirements?.skills)
      ? jobRequirements.skills
      : [];

  const userPrompt = `Job title: ${jobTitle || "Unknown"}
Job requirements/skills: ${reqList.length > 0 ? reqList.join(", ") : "None specified"}
Candidate skills: ${skillsList.length > 0 ? skillsList.join(", ") : "None listed"}

Return a JSON object (no markdown): { "score": <0-100>, "reason": "brief explanation" }`;

  const result = await chatCompletion(systemPrompt, userPrompt, 200);

  if (result) {
    try {
      const cleaned = result.replace(/```json?\s*/g, "").replace(/```\s*/g, "").trim();
      const parsed = JSON.parse(cleaned);
      return {
        score: Math.max(0, Math.min(100, parseInt(parsed.score, 10) || 0)),
        reason: parsed.reason || "",
        scoredBy: "openai-gpt-4o",
      };
    } catch (err) {
      console.error("Failed to parse OpenAI match response:", err.message);
    }
  }

  // ── Local fallback: simple keyword matching ──
  if (skillsList.length === 0 || reqList.length === 0) {
    return { score: null, reason: "Insufficient data", scoredBy: "local-fallback" };
  }
  const lowerSkills = skillsList.map((s) => s.toLowerCase());
  const lowerReqs = reqList.map((r) => r.toLowerCase());
  const matched = lowerSkills.filter((s) =>
    lowerReqs.some((r) => r.includes(s) || s.includes(r))
  );
  const score = Math.min(100, Math.round((matched.length / lowerReqs.length) * 100));
  return { score, reason: `${matched.length}/${lowerReqs.length} skills matched`, scoredBy: "local-fallback" };
}
